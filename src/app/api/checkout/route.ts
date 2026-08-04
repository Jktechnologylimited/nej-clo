import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sql } from "@/lib/db";
import { generateOrderNumber } from "@/lib/utils";
import { getSession } from "@/lib/auth/session";
import { sendOrderConfirmationEmail } from "@/lib/email/send";

const checkoutSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  addressLine1: z.string().min(1),
  addressLine2: z.string().optional().nullable(),
  city: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(1),
  items: z
    .array(
      z.object({
        productId: z.string(),
        name: z.string(),
        size: z.string(),
        quantity: z.number().int().positive(),
        unitPriceCents: z.number().int().nonnegative(),
      }),
    )
    .min(1),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = checkoutSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Check the form — some details are missing or invalid." },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const session = await getSession();

  const totalCents = data.items.reduce(
    (sum, i) => sum + i.unitPriceCents * i.quantity,
    0,
  );
  const orderNumber = generateOrderNumber();
  const orderId = randomUUID();

  // Generating the order id here (rather than via RETURNING) lets the order
  // row and every line item be inserted as one atomic transaction — the
  // transaction API needs its query list built synchronously, so later
  // inserts can't depend on a value returned by an earlier one.
  const queries = [
    sql`INSERT INTO orders (
          id, order_number, user_id, email, name,
          address_line1, address_line2, city, postal_code, country,
          total_cents, status
        ) VALUES (
          ${orderId}, ${orderNumber}, ${session?.userId ?? null}, ${data.email}, ${data.name},
          ${data.addressLine1}, ${data.addressLine2 || null}, ${data.city}, ${data.postalCode}, ${data.country},
          ${totalCents}, 'pending'
        )`,
    ...data.items.map(
      (item) =>
        sql`INSERT INTO order_items (
              order_id, product_id, product_name, size, quantity, unit_price_cents
            ) VALUES (
              ${orderId}, ${item.productId}, ${item.name}, ${item.size}, ${item.quantity}, ${item.unitPriceCents}
            )`,
    ),
  ];
  await sql.transaction(queries);

  await sendOrderConfirmationEmail(data.email, {
    name: data.name,
    orderNumber,
    items: data.items.map((i) => ({
      productName: i.name,
      size: i.size,
      quantity: i.quantity,
      unitPriceCents: i.unitPriceCents,
    })),
    totalCents,
  });

  return NextResponse.json({ orderNumber });
}
