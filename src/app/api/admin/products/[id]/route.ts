import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { updateProduct, getProductById } from "@/lib/products";
import { productCategoryValues, productStatusValues } from "@/lib/db/types";
import { getRestockAlertEmails, clearRestockAlerts } from "@/lib/product-alerts";
import { sendRestockAlertEmail } from "@/lib/email/send";

const updateSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  name: z.string().min(1),
  category: z.enum(productCategoryValues),
  description: z.string().min(1),
  colorway: z.string().min(1),
  sku: z.string().min(1),
  dropCode: z.string().min(1),
  // Price comes in from the form as whole Naira (e.g. 35000), not kobo.
  priceNaira: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
  status: z.enum(productStatusValues),
  sizes: z.string().min(1),
  imageUrls: z
    .array(
      z
        .string()
        .max(2_500_000, "Image is too large")
        .regex(/^data:image\//, "Expected an image data URL"),
    )
    .max(6, "Up to 6 photos per product"),
});

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }
  return null;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Check the form for errors." },
      { status: 400 },
    );
  }

  const { priceNaira, ...rest } = parsed.data;

  try {
    const before = await getProductById(id);
    const product = await updateProduct(id, {
      ...rest,
      priceCents: Math.round(priceNaira * 100), // Naira -> kobo
    });
    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 });
    }

    // Just came back in stock — notify anyone who asked to be told, then
    // clear the list (a customer who wants alerts for a *future* restock of
    // the same item signs up again).
    if (before?.status === "sold_out" && product.status !== "sold_out") {
      const emails = await getRestockAlertEmails(id);
      if (emails.length > 0) {
        const productUrl = new URL(`/product/${product.slug}`, request.nextUrl.origin).toString();
        for (const email of emails) {
          await sendRestockAlertEmail(email, {
            productName: product.name,
            colorway: product.colorway,
            priceCents: product.priceCents,
            productUrl,
          });
        }
        await clearRestockAlerts(id);
      }
    }

    return NextResponse.json({ product });
  } catch {
    return NextResponse.json(
      { error: "Couldn't save — that slug or SKU may already be in use." },
      { status: 409 },
    );
  }
}
