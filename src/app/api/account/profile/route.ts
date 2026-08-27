import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getSession, createSessionCookie } from "@/lib/auth/session";
import { updateUserProfile, isEmailTakenByAnotherUser } from "@/lib/users";

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
});

export async function PATCH(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Not signed in." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 },
    );
  }

  const { name, email } = parsed.data;
  const normalizedEmail = email.toLowerCase().trim();

  if (await isEmailTakenByAnotherUser(normalizedEmail, session.userId)) {
    return NextResponse.json(
      { error: "That email is already in use by another account." },
      { status: 409 },
    );
  }

  const user = await updateUserProfile(session.userId, { name, email: normalizedEmail });
  if (!user) {
    return NextResponse.json({ error: "Account not found." }, { status: 404 });
  }

  // Re-issue the session cookie so the header/sidebar reflect the change
  // immediately, without requiring the customer to log out and back in.
  await createSessionCookie({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  return NextResponse.json({ ok: true });
}
