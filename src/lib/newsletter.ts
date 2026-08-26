import { sql } from "@/lib/db";

export async function isSubscribedToDropAlerts(email: string): Promise<boolean> {
  const rows = await sql.query(
    `SELECT subscribed FROM newsletter_subscribers WHERE email = $1 LIMIT 1`,
    [email.toLowerCase().trim()],
  );
  return rows[0]?.subscribed === true;
}
