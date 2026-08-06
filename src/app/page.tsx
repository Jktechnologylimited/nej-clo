import Link from "next/link";
import { ProductGrid } from "@/components/ProductGrid";
import { Countdown } from "@/components/Countdown";
import { getFeaturedProducts, getLatestDropCode } from "@/lib/products";
import { getNextDropDate } from "@/lib/utils";
import { getLocale } from "@/lib/i18n/get-locale";
import { getCurrency } from "@/lib/i18n/get-currency";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getSiteContent } from "@/lib/site-content";

export default async function Home() {
  const [featured, dropCode, locale, currency, content] = await Promise.all([
    getFeaturedProducts(4),
    getLatestDropCode(),
    getLocale(),
    getCurrency(),
    getSiteContent(),
  ]);
  const t = getDictionary(locale);
  const nextDrop = getNextDropDate();

  const heroLede = content.hero_lede || t.hero.lede;
  const manifestoItems = t.manifesto.items.map((item, i) => ({
    ...item,
    title: content[`manifesto_${i + 1}_title` as keyof typeof content] || item.title,
    body: content[`manifesto_${i + 1}_body` as keyof typeof content] || item.body,
  }));

  return (
    <div>
      {/* Hero — styled like a shipping manifest stapled to the wall */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr] lg:items-end">
            <div>
              <p className="font-mono-data text-xs tracking-[0.2em] text-amber">
                {t.hero.eyebrow(dropCode ?? "NEJ-000")}
              </p>
              <h1 className="mt-4 font-display text-[15vw] font-black uppercase leading-[0.85] tracking-tight text-paper sm:text-8xl lg:text-9xl">
                {t.hero.title1}
                <br />
                {t.hero.title2}
              </h1>
              <p className="mt-6 max-w-md font-body text-sm leading-relaxed text-paper/60">
                {heroLede}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/shop"
                  className="border border-paper bg-paper px-6 py-3 font-mono-data text-xs tracking-[0.15em] text-ink transition hover:bg-amber hover:border-amber"
                >
                  {t.hero.viewStock}
                </Link>
                <Link
                  href="/shop?status=limited"
                  className="border border-line-strong px-6 py-3 font-mono-data text-xs tracking-[0.15em] text-paper transition hover:border-amber hover:text-amber"
                >
                  {t.hero.liveDropOnly}
                </Link>
              </div>
            </div>

            <div className="border border-line-strong bg-bg-raised p-6">
              <p className="font-mono-data text-[11px] tracking-[0.15em] text-paper/40">
                {t.hero.nextDrop}
              </p>
              <div className="mt-3">
                <Countdown target={nextDrop.toISOString()} />
              </div>
              <p className="dashed-line mt-6 pt-4 font-mono-data text-[11px] leading-relaxed text-paper/40">
                {t.hero.noAnnouncement}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured stock */}
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="font-mono-data text-[11px] tracking-[0.2em] text-paper/40">
              {t.featured.eyebrow}
            </p>
            <h2 className="mt-1 font-display text-2xl font-extrabold uppercase tracking-tight text-paper">
              {t.featured.title}
            </h2>
          </div>
          <Link
            href="/shop"
            className="font-mono-data text-xs tracking-[0.1em] text-paper/60 transition hover:text-amber"
          >
            {t.shop.eyebrow} →
          </Link>
        </div>

        <ProductGrid products={featured} currency={currency} t={t} />
      </section>

      {/* Manifesto strip */}
      <section className="border-y border-line bg-bg-raised">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 sm:grid-cols-3 sm:px-8">
          {manifestoItems.map((item) => (
            <div key={item.n}>
              <p className="font-mono-data text-xs text-amber">{item.n}</p>
              <h3 className="mt-2 font-display text-lg font-extrabold uppercase text-paper">
                {item.title}
              </h3>
              <p className="mt-2 font-body text-sm leading-relaxed text-paper/50">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
