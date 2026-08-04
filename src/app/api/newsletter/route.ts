import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sql } from "@/lib/db";

const newsletterSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = newsletterSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const email = parsed.data.email.toLowerCase().trim();

  // Re-subscribing after a previous unsubscribe should just flip the flag,
  // not fail on the unique index.
  await sql.query(
    `INSERT INTO newsletter_subscribers (email, subscribed)
     VALUES ($1, true)
     ON CONFLICT (email) DO UPDATE SET subscribed = true`,
    [email],
  );

  return NextResponse.json({ ok: true });
}
