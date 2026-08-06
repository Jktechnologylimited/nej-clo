import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession } from "@/lib/auth/session";
import {
  setSiteContent,
  resetSiteContent,
  SITE_CONTENT_FIELDS,
} from "@/lib/site-content";

const validKeys = SITE_CONTENT_FIELDS.map((f) => f.key) as [string, ...string[]];
const saveSchema = z.record(z.enum(validKeys), z.string());

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
  const parsed = saveSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid content payload." }, { status: 400 });
  }

  await setSiteContent(parsed.data);
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const denied = await requireAdmin();
  if (denied) return denied;

  await resetSiteContent();
  return NextResponse.json({ ok: true });
}
