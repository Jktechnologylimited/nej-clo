import { sql } from "@/lib/db";

export type Subscriber = {
  id: string;
  email: string;
  subscribed: boolean;
  createdAt: string;
};

export async function getAllSubscribers(): Promise<Subscriber[]> {
  const rows = await sql`
    SELECT id, email, subscribed, created_at AS "createdAt"
    FROM newsletter_subscribers
    ORDER BY created_at DESC
  `;
  return rows as unknown as Subscriber[];
}
