import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { updateOrderFulfillment } from "@/lib/orders";
import { orderStatusValues } from "@/lib/order-status";

const updateSchema = z.object({
  status: z.enum(orderStatusValues),
  carrier: z.string().nullable(),
  trackingNumber: z.string().nullable(),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Check the form for errors." }, { status: 400 });
  }

  await updateOrderFulfillment(id, {
    status: parsed.data.status,
    carrier: parsed.data.carrier || null,
    trackingNumber: parsed.data.trackingNumber || null,
  });

  return NextResponse.json({ ok: true });
}
