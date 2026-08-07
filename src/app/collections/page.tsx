import Link from "next/link";
import { getAllCollections, getCollectionProductCounts } from "@/lib/collections";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export const metadata = { title: "Collections — Nej Clothing" };

export default async function CollectionsPage() {
  const [collectionList, counts, locale] = await Promise.all([
    getAllCollections(),
    getCollectionProductCounts(),
    getLocale(),
  ]);
  const t = getDictionary(locale);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="mb-8">
        <p className="font-mono-data text-[11px] tracking-[0.2em] text-paper/40">
          {t.collections.eyebrow}
        </p>
        <h1 className="mt-1 font-display text-3xl font-extrabold uppercase tracking-tight text-paper sm:text-4xl">
          {t.collections.title}
        </h1>
      </div>

      {collectionList.length === 0 ? (
        <p className="py-16 text-center font-mono-data text-sm text-paper/50">
          {t.collections.empty}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {collectionList.map((c) => (
            <Link
              key={c.id}
              href={`/collections/${c.slug}`}
              className="group block border border-line-strong bg-paper text-ink transition hover:border-amber"
            >
              {c.imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element -- stored as a data: URL, next/image doesn't optimize those
                <img
                  src={c.imageUrl}
                  alt={c.name}
                  className="aspect-[2/1] w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                />
              )}
              <div className="p-6">
                <div className="flex items-center justify-between font-mono-data text-[11px] tracking-[0.15em] text-ink-muted">
                  <span>{c.slug.toUpperCase()}</span>
                  <span>{t.collections.items(counts.get(c.id) ?? 0)}</span>
                </div>
                <h2 className="mt-3 font-display text-2xl font-extrabold uppercase tracking-tight">
                  {c.name}
                </h2>
                <p className="mt-2 max-w-md text-sm leading-relaxed text-ink-muted">
                  {c.description}
                </p>
                <span className="mt-4 inline-block font-mono-data text-[11px] tracking-[0.15em] text-ink-muted transition group-hover:text-rust">
                  {t.collections.shopCollection}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
