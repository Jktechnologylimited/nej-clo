import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { subscribeToRestockAlert } from "@/lib/product-alerts";
import { getProductById } from "@/lib/products";

const schema = z.object({
  productId: z.string().min(1),
  email: z.string().email("Enter a valid email"),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const product = await getProductById(parsed.data.productId);
  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  await subscribeToRestockAlert(parsed.data.productId, parsed.data.email);
  return NextResponse.json({ ok: true });
}
