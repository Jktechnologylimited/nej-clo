import { sql } from "@/lib/db";

// The editable fields. Adding a new one here means adding it to the admin
// form and reading it (with a dictionary fallback) wherever it's rendered.
export const SITE_CONTENT_FIELDS = [
  { key: "hero_lede", label: "Hero lede" },
  { key: "manifesto_1_title", label: "Manifesto — item 1 title" },
  { key: "manifesto_1_body", label: "Manifesto — item 1 body" },
  { key: "manifesto_2_title", label: "Manifesto — item 2 title" },
  { key: "manifesto_2_body", label: "Manifesto — item 2 body" },
  { key: "manifesto_3_title", label: "Manifesto — item 3 title" },
  { key: "manifesto_3_body", label: "Manifesto — item 3 body" },
  { key: "footer_desc", label: "Footer description" },
] as const;

export type SiteContentKey = (typeof SITE_CONTENT_FIELDS)[number]["key"];
export type SiteContentMap = Partial<Record<SiteContentKey, string>>;

/**
 * Flattens the English dictionary's defaults for the editable fields into
 * plain strings, keyed the same way as SiteContentMap. Used to show
 * placeholder/default text in the admin editor — deliberately returns only
 * strings (never the dictionary's function-valued fields like
 * `hero.eyebrow` or `checkout.confirm`), since this ends up as a prop on a
 * Client Component and functions can't cross that boundary.
 */
export function defaultSiteContent(dict: {
  hero: { lede: string };
  manifesto: { items: { title: string; body: string }[] };
  footer: { desc: string };
}): Record<SiteContentKey, string> {
  return {
    hero_lede: dict.hero.lede,
    manifesto_1_title: dict.manifesto.items[0].title,
    manifesto_1_body: dict.manifesto.items[0].body,
    manifesto_2_title: dict.manifesto.items[1].title,
    manifesto_2_body: dict.manifesto.items[1].body,
    manifesto_3_title: dict.manifesto.items[2].title,
    manifesto_3_body: dict.manifesto.items[2].body,
    footer_desc: dict.footer.desc,
  };
}

export async function getSiteContent(): Promise<SiteContentMap> {
  const rows = (await sql`SELECT key, value FROM site_content`) as unknown as {
    key: string;
    value: string;
  }[];

  const map: SiteContentMap = {};
  for (const row of rows) map[row.key as SiteContentKey] = row.value;
  return map;
}

export async function setSiteContent(entries: SiteContentMap): Promise<void> {
  const pairs = Object.entries(entries).filter(
    (entry): entry is [string, string] => typeof entry[1] === "string",
  );
  if (pairs.length === 0) return;

  const queries = pairs.map(
    ([key, value]) =>
      sql`INSERT INTO site_content (key, value, updated_at)
          VALUES (${key}, ${value}, now())
          ON CONFLICT (key) DO UPDATE SET value = ${value}, updated_at = now()`,
  );
  await sql.transaction(queries);
}

export async function resetSiteContent(): Promise<void> {
  await sql`DELETE FROM site_content`;
}
