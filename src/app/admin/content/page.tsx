import { getSiteContent, defaultSiteContent } from "@/lib/site-content";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { SiteContentForm } from "./SiteContentForm";

export default async function AdminContentPage() {
  const [overrides, dict] = await Promise.all([
    getSiteContent(),
    Promise.resolve(getDictionary("en")),
  ]);
  const defaults = defaultSiteContent(dict);

  return (
    <div className="mx-auto max-w-2xl px-5 py-14 sm:px-8 sm:py-20">
      <p className="font-mono-data text-[11px] tracking-[0.2em] text-paper/40">
        ADMIN
      </p>
      <h1 className="mt-1 font-display text-3xl font-extrabold uppercase tracking-tight text-paper">
        Site content
      </h1>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-paper/50">
        Edit the hero lede, the three manifesto blurbs, and the footer
        description shown on the site. Leaving a field blank falls back to
        the default copy below. This only covers these blocks — navigation,
        buttons, and other fixed UI text still come from the translated
        dictionaries, and product details are edited from{" "}
        <a href="/admin/collections" className="text-amber hover:underline">
          Collections
        </a>
        .
      </p>

      <SiteContentForm overrides={overrides} defaults={defaults} />
    </div>
  );
}
