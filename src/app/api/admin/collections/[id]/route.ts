import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import { updateCollection } from "@/lib/collections";

const updateSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  productIds: z.array(z.string()).default([]),
  imageUrl: z
    .string()
    .max(2_500_000, "Image is too large")
    .regex(/^data:image\//, "Expected an image data URL")
    .nullable(),
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

  try {
    const collection = await updateCollection(id, parsed.data);
    return NextResponse.json({ collection });
  } catch {
    return NextResponse.json(
      { error: "Couldn't save — that slug may already be in use by another collection." },
      { status: 409 },
    );
  }
}
