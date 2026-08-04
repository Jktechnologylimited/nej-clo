import Link from "next/link";
import { ProductGrid } from "@/components/ProductGrid";
import { getAllProducts } from "@/lib/products";
import { getLocale } from "@/lib/i18n/get-locale";
import { getCurrency } from "@/lib/i18n/get-currency";
import { getDictionary } from "@/lib/i18n/dictionaries";

const FILTER_KEYS = ["available", "limited", "restocked", "sold_out"] as const;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  const [all, locale, currency] = await Promise.all([
    getAllProducts(),
    getLocale(),
    getCurrency(),
  ]);
  const t = getDictionary(locale);
  const filtered = status ? all.filter((p) => p.status === status) : all;

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="mb-8">
        <p className="font-mono-data text-[11px] tracking-[0.2em] text-paper/40">
          {t.shop.eyebrow}
        </p>
        <h1 className="mt-1 font-display text-3xl font-extrabold uppercase tracking-tight text-paper sm:text-4xl">
          {t.shop.title}
        </h1>
      </div>

      <div className="mb-8 flex flex-wrap gap-2 border-b border-line pb-6">
        <Link
          href="/shop"
          className={`border px-3 py-1.5 font-mono-data text-[11px] tracking-[0.1em] transition ${
            !status
              ? "border-amber bg-amber text-ink"
              : "border-line-strong text-paper/60 hover:border-amber hover:text-amber"
          }`}
        >
          {t.shop.filters.all}
        </Link>
        {FILTER_KEYS.map((key) => {
          const active = status === key;
          return (
            <Link
              key={key}
              href={`/shop?status=${key}`}
              className={`border px-3 py-1.5 font-mono-data text-[11px] tracking-[0.1em] transition ${
                active
                  ? "border-amber bg-amber text-ink"
                  : "border-line-strong text-paper/60 hover:border-amber hover:text-amber"
              }`}
            >
              {t.shop.filters[key]}
            </Link>
          );
        })}
      </div>

      <ProductGrid products={filtered} currency={currency} t={t} />
    </div>
  );
}
