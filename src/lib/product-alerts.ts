import { sql } from "@/lib/db";

export async function subscribeToRestockAlert(productId: string, email: string): Promise<void> {
  await sql`
    INSERT INTO product_alerts (product_id, email)
    VALUES (${productId}, ${email.toLowerCase().trim()})
    ON CONFLICT (product_id, email) DO NOTHING
  `;
}

export async function getRestockAlertEmails(productId: string): Promise<string[]> {
  const rows = await sql`
    SELECT email FROM product_alerts WHERE product_id = ${productId}
  `;
  return (rows as { email: string }[]).map((r) => r.email);
}

export async function clearRestockAlerts(productId: string): Promise<void> {
  await sql`DELETE FROM product_alerts WHERE product_id = ${productId}`;
}
