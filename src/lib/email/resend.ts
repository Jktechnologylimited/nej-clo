import { Resend } from "resend";

let client: Resend | null = null;

/**
 * Lazily instantiate Resend so the app can still build/run locally without
 * an API key set (emails are just skipped, with a console warning).
 */
export function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    console.warn(
      "[email] RESEND_API_KEY is not set — skipping email send. See .env.example.",
    );
    return null;
  }
  if (!client) {
    client = new Resend(process.env.RESEND_API_KEY);
  }
  return client;
}

export const EMAIL_FROM =
  process.env.RESEND_FROM_EMAIL ?? "Nej Clothing <onboarding@resend.dev>";
