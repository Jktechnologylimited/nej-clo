import { cache } from "react";
import { sql } from "@/lib/db";
import { brandingSchema, type Branding } from "@/lib/branding-image";

// One row keeps the logo and its favicon in sync, without a schema migration.
export const getBranding = cache(async (): Promise<Branding | null> => {
  const rows = await sql`SELECT value FROM site_content WHERE key = 'site_branding'`;
  if (!rows[0]) return null;
  try {
    return brandingSchema.parse(JSON.parse(rows[0].value));
  } catch {
    return null;
  }
});

export async function saveBranding(branding: Branding) {
  const value = JSON.stringify(branding);
  await sql`INSERT INTO site_content (key, value, updated_at)
    VALUES ('site_branding', ${value}, now())
    ON CONFLICT (key) DO UPDATE SET value = ${value}, updated_at = now()`;
}
