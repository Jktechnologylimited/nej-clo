import Link from "next/link";
import { ProductGrid } from "@/components/ProductGrid";
import { NewsletterForm } from "@/components/NewsletterForm";
import { TrustStrip } from "@/components/TrustStrip";
import { getFeaturedProducts, getLatestDropCode } from "@/lib/products";
import { getAllCollections } from "@/lib/collections";
import { getLocale } from "@/lib/i18n/get-locale";
import { getCurrency } from "@/lib/i18n/get-currency";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getSiteContent } from "@/lib/site-content";

export default async function Home() {
  const [featured, dropCode, locale, currency, content, collectionList] = await Promise.all([
    getFeaturedProducts(5),
    getLatestDropCode(),
    getLocale(),
    getCurrency(),
    getSiteContent(),
    getAllCollections(),
  ]);
  const t = getDictionary(locale);
  const featuredCollection = collectionList[0] ?? null;

  const heroLede = content.hero_lede || t.hero.lede;
  const manifestoItems = t.manifesto.items.map((item, i) => ({
    ...item,
    title: content[`manifesto_${i + 1}_title` as keyof typeof content] || item.title,
    body: content[`manifesto_${i + 1}_body` as keyof typeof content] || item.body,
  }));

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="font-mono-data text-xs tracking-[0.2em] text-ink-muted">
                CURRENT DROP
              </p>
              <h1 className="mt-3 break-words font-display text-4xl font-black uppercase leading-[0.95] tracking-tight text-ink sm:text-6xl lg:text-7xl">
                STOCK_LOG_{dropCode ? dropCode.replace(/\D/g, "").padStart(3, "0") : "000"}
              </h1>
              <p className="mt-5 max-w-md font-body text-sm leading-relaxed text-ink-muted">
                {heroLede}
              </p>
              <div className="mt-7">
                <Link
                  href="/shop"
                  className="inline-block border border-ink bg-ink px-7 py-3.5 font-mono-data text-xs tracking-[0.15em] text-paper transition hover:bg-amber hover:border-amber hover:text-ink"
                >
                  SHOP DROP
                </Link>
              </div>
              <p className="mt-8 font-mono-data text-[11px] tracking-[0.15em] text-ink-muted">
                LIMITED RUN &nbsp;•&nbsp; NO RESTOCKS &nbsp;•&nbsp; NEJ ONLY
              </p>
            </div>

            <div className="relative aspect-[4/3] border border-line-strong bg-bg-raised">
              <div className="flex h-full items-center justify-center">
                <span className="font-display text-3xl font-black tracking-tight text-ink/15">
                  NEJ
                </span>
              </div>
              <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <span
                    key={i}
                    className={`h-1.5 w-1.5 rounded-full ${i === 0 ? "bg-ink" : "bg-ink/25"}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest stock */}
      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-ink">
            {t.home.latestStock}
          </h2>
          <Link
            href="/shop"
            className="font-mono-data text-xs tracking-[0.1em] text-ink-muted transition hover:text-ink"
          >
            {t.home.viewAll} →
          </Link>
        </div>

        <ProductGrid products={featured} currency={currency} t={t} />
      </section>

      {/* The Manifest */}
      <section className="border-y border-line bg-bg-raised">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 sm:px-8 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-ink">
              {t.manifesto.title}
            </h2>
            <div className="mt-6 space-y-6">
              {manifestoItems.map((item) => (
                <div key={item.n}>
                  <p className="font-mono-data text-xs text-ink-muted">{item.n}</p>
                  <h3 className="mt-1 font-display text-base font-extrabold uppercase text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-1 font-body text-sm leading-relaxed text-ink-muted">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
            <Link
              href="/about"
              className="mt-6 inline-block font-mono-data text-xs tracking-[0.15em] text-ink underline underline-offset-4 transition hover:text-ink-muted"
            >
              {t.home.readOurStory} →
            </Link>
          </div>
          <div className="aspect-[4/3] border border-line-strong bg-paper" />
        </div>
      </section>

      {/* Current collection */}
      {featuredCollection && (
        <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="font-mono-data text-[11px] tracking-[0.2em] text-ink-muted">
                {t.home.currentCollectionEyebrow}
              </p>
              <h2 className="mt-1 font-display text-2xl font-extrabold uppercase tracking-tight text-ink">
                {featuredCollection.name}
              </h2>
            </div>
            <Link
              href={`/collections/${featuredCollection.slug}`}
              className="font-mono-data text-xs tracking-[0.1em] text-ink-muted transition hover:text-ink"
            >
              {t.home.currentCollectionCta} →
            </Link>
          </div>
          <Link
            href={`/collections/${featuredCollection.slug}`}
            className="block aspect-[3/1] border border-line-strong bg-bg-raised"
          >
            {featuredCollection.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element -- stored as a data: URL, next/image doesn't optimize those
              <img
                src={featuredCollection.imageUrl}
                alt={featuredCollection.name}
                className="h-full w-full object-cover"
              />
            )}
          </Link>
        </section>
      )}

      {/* Drop alerts */}
      <section className="border-y border-line bg-bg-raised">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <h2 className="font-display text-lg font-extrabold uppercase tracking-tight text-ink">
              {t.home.dropAlertsTitle}
            </h2>
            <p className="mt-1 max-w-sm font-body text-sm text-ink-muted">
              {t.home.dropAlertsBody}
            </p>
          </div>
          <div className="w-full sm:w-80">
            <NewsletterForm
              buttonLabel={t.home.dropAlertsCta}
              successLabel={t.home.dropAlertsSuccess}
            />
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="mx-auto max-w-6xl px-5 sm:px-8">
        <TrustStrip t={t} />
      </section>
    </div>
  );
}
