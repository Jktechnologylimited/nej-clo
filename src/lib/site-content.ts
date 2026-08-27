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
  { key: "trust_1_title", label: "Trust strip — item 1 title" },
  { key: "trust_1_body", label: "Trust strip — item 1 body" },
  { key: "trust_2_title", label: "Trust strip — item 2 title" },
  { key: "trust_2_body", label: "Trust strip — item 2 body" },
  { key: "trust_3_title", label: "Trust strip — item 3 title" },
  { key: "trust_3_body", label: "Trust strip — item 3 body" },
  { key: "trust_4_title", label: "Trust strip — item 4 title" },
  { key: "trust_4_body", label: "Trust strip — item 4 body" },
  { key: "about_hero_lede", label: "About page — intro paragraph" },
  { key: "about_story_paragraph_1", label: "About page — story, paragraph 1" },
  { key: "about_story_paragraph_2", label: "About page — story, paragraph 2" },
  { key: "help_support_email", label: "Support email (Help page + returns instructions)" },
] as const;

export type SiteContentKey = (typeof SITE_CONTENT_FIELDS)[number]["key"];
export type SiteContentMap = Partial<Record<SiteContentKey, string>>;

// Defaults for fields that aren't part of the translated i18n dictionaries
// (About/Help page prose is English-only static content, same as product
// descriptions — see the i18n notes in the README for why).
const STATIC_DEFAULTS: Record<string, string> = {
  about_hero_lede:
    "NEJ is an independent streetwear label built on purpose, culture, and craftsmanship. We create in limited runs so every piece carries meaning, not mass.",
  about_story_paragraph_1:
    "NEJ was born from the idea that clothing can be more than what you wear — it can be what you stand for. From the streets to the world, we represent a new era of streetwear rooted in authenticity, self-expression, and community.",
  about_story_paragraph_2: "This is NEJ. This is for the culture.",
  help_support_email: "support@nejclothing.com",
};

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
  home: {
    trustLimitedRunsTitle: string;
    trustLimitedRunsBody: string;
    trustNoRestocksTitle: string;
    trustNoRestocksBody: string;
    trustSecureTitle: string;
    trustSecureBody: string;
    trustFastTitle: string;
    trustFastBody: string;
  };
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
    trust_1_title: dict.home.trustLimitedRunsTitle,
    trust_1_body: dict.home.trustLimitedRunsBody,
    trust_2_title: dict.home.trustNoRestocksTitle,
    trust_2_body: dict.home.trustNoRestocksBody,
    trust_3_title: dict.home.trustSecureTitle,
    trust_3_body: dict.home.trustSecureBody,
    trust_4_title: dict.home.trustFastTitle,
    trust_4_body: dict.home.trustFastBody,
    about_hero_lede: STATIC_DEFAULTS.about_hero_lede,
    about_story_paragraph_1: STATIC_DEFAULTS.about_story_paragraph_1,
    about_story_paragraph_2: STATIC_DEFAULTS.about_story_paragraph_2,
    help_support_email: STATIC_DEFAULTS.help_support_email,
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

export async function getSupportEmail(): Promise<string> {
  const content = await getSiteContent();
  return content.help_support_email || STATIC_DEFAULTS.help_support_email;
}
