import { notFound } from "next/navigation";
import { ProductGrid } from "@/components/ProductGrid";
import { getCollectionBySlug, getProductsForCollection } from "@/lib/collections";
import { getLocale } from "@/lib/i18n/get-locale";
import { getCurrency } from "@/lib/i18n/get-currency";
import { getDictionary } from "@/lib/i18n/dictionaries";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const collection = await getCollectionBySlug(slug);
  return { title: collection ? `${collection.name} — Nej Clothing` : "Collection" };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [collection, locale, currency] = await Promise.all([
    getCollectionBySlug(slug),
    getLocale(),
    getCurrency(),
  ]);
  if (!collection) notFound();
  const t = getDictionary(locale);

  const productList = await getProductsForCollection(collection.id);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      {collection.imageUrl && (
        // eslint-disable-next-line @next/next/no-img-element -- stored as a data: URL, next/image doesn't optimize those
        <img
          src={collection.imageUrl}
          alt={collection.name}
          className="mb-10 aspect-[3/1] w-full border border-line-strong object-cover"
        />
      )}

      <div className="mb-10 max-w-2xl">
        <p className="font-mono-data text-[11px] tracking-[0.2em] text-paper/40">
          {t.collections.eyebrow} — {collection.slug.toUpperCase()}
        </p>
        <h1 className="mt-1 font-display text-3xl font-extrabold uppercase tracking-tight text-paper sm:text-4xl">
          {collection.name}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-paper/60">
          {collection.description}
        </p>
      </div>

      <ProductGrid products={productList} currency={currency} t={t} />
    </div>
  );
}
