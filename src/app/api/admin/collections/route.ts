import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { createCollection, deleteCollection } from "@/lib/collections";

const createSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  productIds: z.array(z.string()).default([]),
  imageUrl: z
    .string()
    .max(2_500_000, "Image is too large")
    .regex(/^data:image\//, "Expected an image data URL")
    .nullable()
    .default(null),
  badge: z.string().max(30, "Keep the badge short").nullable().default(null),
});

async function requireAdmin() {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }
  return null;
}

export async function POST(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Check the form — name and description are required." },
      { status: 400 },
    );
  }

  try {
    const collection = await createCollection(parsed.data);
    return NextResponse.json({ collection });
  } catch {
    return NextResponse.json(
      { error: "Couldn't create that collection — a collection with a very similar name may already exist." },
      { status: 409 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing collection id." }, { status: 400 });
  }

  await deleteCollection(id);
  return NextResponse.json({ ok: true });
}
