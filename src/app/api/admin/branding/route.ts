import { faviconUrl } from "@/lib/branding-url";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { brandingSchema } from "@/lib/branding-image";
import { normalizeBranding } from "@/lib/branding-normalize";
import { saveBranding } from "@/lib/branding";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== "admin") {
    return NextResponse.json({ error: "Not authorized." }, { status: 403 });
  }
  // Bound the body before parsing; do not trust the client-supplied length.
  const reader = request.body?.getReader();
  if (!reader) return NextResponse.json({ error: "Choose a logo." }, { status: 400 });
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > 1_600_000) {
      await reader.cancel();
      return NextResponse.json({ error: "Logo is too large." }, { status: 413 });
    }
    chunks.push(value);
  }
  let body: unknown;
  try {
    body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
  } catch {
    return NextResponse.json({ error: "Invalid image payload." }, { status: 400 });
  }
  const parsed = brandingSchema.pick({ logo: true }).safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid image payload." }, { status: 400 });
  }
  let branding;
  try {
    branding = await normalizeBranding(parsed.data.logo);
  } catch {
    return NextResponse.json({ error: "Could not decode the logo. Choose a valid image." }, { status: 400 });
  }
  await saveBranding(branding);
  return NextResponse.json({ ...branding, faviconUrl: faviconUrl(branding.favicon) });
}
