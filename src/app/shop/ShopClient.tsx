"use client";

import { useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ProductGrid } from "@/components/ProductGrid";
import { useI18n } from "@/components/I18nProvider";
import type { Product, ProductCategory, ProductStatus } from "@/lib/db/types";
import { productCategoryValues, productStatusValues } from "@/lib/db/types";
import type { Collection } from "@/lib/db/types";

const PAGE_SIZE = 8;

type SortKey = "newest" | "price_asc" | "price_desc";

function ShopFilters(props: {
  products: Product[];
  collections: Collection[];
  links: { productId: string; collectionId: string }[];
}) {
  const { products, collections, links } = props;
  const { t, currency } = useI18n();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");

  const [categories, setCategories] = useState<Set<ProductCategory>>(
    new Set(
      initialCategory && (productCategoryValues as readonly string[]).includes(initialCategory)
        ? [initialCategory as ProductCategory]
        : [],
    ),
  );
  const [collectionId, setCollectionId] = useState<string>("all");
  const [sizes, setSizes] = useState<Set<string>>(new Set());
  const [availability, setAvailability] = useState<Set<ProductStatus>>(new Set());
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [sort, setSort] = useState<SortKey>("newest");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const productCollectionMap = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const link of links) {
      if (!map.has(link.productId)) map.set(link.productId, new Set());
      map.get(link.productId)!.add(link.collectionId);
    }
    return map;
  }, [links]);

  const availableSizes = useMemo(() => {
    const set = new Set<string>();
    for (const p of products) {
      for (const s of p.sizes.split(",")) set.add(s.trim());
    }
    return Array.from(set);
  }, [products]);

  function toggleSet<T>(set: Set<T>, value: T, setter: (s: Set<T>) => void) {
    const next = new Set(set);
    if (next.has(value)) next.delete(value);
    else next.add(value);
    setter(next);
  }

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (categories.size > 0 && !categories.has(p.category)) return false;
      if (collectionId !== "all") {
        if (!productCollectionMap.get(p.id)?.has(collectionId)) return false;
      }
      if (sizes.size > 0) {
        const productSizes = p.sizes.split(",").map((s) => s.trim());
        if (!productSizes.some((s) => sizes.has(s))) return false;
      }
      if (availability.size > 0 && !availability.has(p.status)) return false;

      const priceNaira = p.priceCents / 100;
      if (priceMin && priceNaira < Number(priceMin)) return false;
      if (priceMax && priceNaira > Number(priceMax)) return false;

      return true;
    });
  }, [products, categories, collectionId, sizes, availability, priceMin, priceMax, productCollectionMap]);

  const sorted = useMemo(() => {
    const copy = [...filtered];
    if (sort === "price_asc") copy.sort((a, b) => a.priceCents - b.priceCents);
    else if (sort === "price_desc") copy.sort((a, b) => b.priceCents - a.priceCents);
    else copy.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return copy;
  }, [filtered, sort]);

  const visible = sorted.slice(0, visibleCount);
  const hasMore = visibleCount < sorted.length;

  function clearAll() {
    setCategories(new Set());
    setCollectionId("all");
    setSizes(new Set());
    setAvailability(new Set());
    setPriceMin("");
    setPriceMax("");
  }

  const hasActiveFilters =
    categories.size > 0 ||
    collectionId !== "all" ||
    sizes.size > 0 ||
    availability.size > 0 ||
    !!priceMin ||
    !!priceMax;

  const checkboxClass = "h-3.5 w-3.5 accent-ink";
  const sectionLabelClass = "mb-2 font-mono-data text-[11px] font-bold tracking-[0.1em] text-ink";

  const filterPanel = (
    <div className="space-y-6">
      <div>
        <p className={sectionLabelClass}>{t.shop.filterCategory}</p>
        <div className="space-y-1.5">
          {productCategoryValues.map((c) => (
            <label key={c} className="flex items-center gap-2 font-mono-data text-xs capitalize text-ink-muted">
              <input
                type="checkbox"
                className={checkboxClass}
                checked={categories.has(c)}
                onChange={() => toggleSet(categories, c, setCategories)}
              />
              {c}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className={sectionLabelClass}>{t.shop.filterCollection}</p>
        <select
          value={collectionId}
          onChange={(e) => setCollectionId(e.target.value)}
          className="w-full border border-line-strong bg-paper px-2.5 py-2 font-mono-data text-xs text-ink focus:border-ink focus:outline-none"
        >
          <option value="all">{t.shop.allCollections}</option>
          {collections.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className={sectionLabelClass}>{t.shop.filterSize}</p>
        <div className="flex flex-wrap gap-1.5">
          {availableSizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggleSet(sizes, s, setSizes)}
              className={`border px-2.5 py-1 font-mono-data text-[11px] transition ${
                sizes.has(s)
                  ? "border-ink bg-ink text-paper"
                  : "border-line-strong text-ink-muted hover:border-ink hover:text-ink"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className={sectionLabelClass}>{t.shop.filterAvailability}</p>
        <div className="space-y-1.5">
          {productStatusValues.map((s) => (
            <label key={s} className="flex items-center gap-2 font-mono-data text-xs text-ink-muted">
              <input
                type="checkbox"
                className={checkboxClass}
                checked={availability.has(s)}
                onChange={() => toggleSet(availability, s, setAvailability)}
              />
              {t.shop.filters[s]}
            </label>
          ))}
        </div>
      </div>

      <div>
        <p className={sectionLabelClass}>{t.shop.filterPrice}</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            placeholder="₦0"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            className="w-full min-w-0 border border-line-strong bg-paper px-2.5 py-2 font-mono-data text-xs text-ink placeholder:text-ink-muted/50 focus:border-ink focus:outline-none"
          />
          <span className="text-ink-muted">–</span>
          <input
            type="number"
            min="0"
            placeholder="₦100,000+"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            className="w-full min-w-0 border border-line-strong bg-paper px-2.5 py-2 font-mono-data text-xs text-ink placeholder:text-ink-muted/50 focus:border-ink focus:outline-none"
          />
        </div>
      </div>

      {hasActiveFilters && (
        <button
          type="button"
          onClick={clearAll}
          className="w-full border border-line-strong px-4 py-2.5 font-mono-data text-xs tracking-[0.1em] text-ink-muted transition hover:border-ink hover:text-ink"
        >
          {t.shop.clearFilters}
        </button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <p className="font-mono-data text-[11px] tracking-[0.1em] text-ink-muted">Home / Shop All</p>

      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight text-ink sm:text-4xl">
            {t.shop.title}
          </h1>
          <p className="mt-1 font-mono-data text-xs text-ink-muted">
            {t.shop.itemsCount(sorted.length)}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen((v) => !v)}
            className="border border-line-strong px-4 py-2 font-mono-data text-xs tracking-[0.1em] text-ink lg:hidden"
          >
            {t.shop.filtersLabel}
          </button>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            aria-label={t.shop.sortBy}
            className="border border-line-strong bg-paper px-3 py-2 font-mono-data text-xs text-ink focus:border-ink focus:outline-none"
          >
            <option value="newest">{t.shop.sortNewest}</option>
            <option value="price_asc">{t.shop.sortPriceLow}</option>
            <option value="price_desc">{t.shop.sortPriceHigh}</option>
          </select>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[220px_1fr]">
        <aside
          className={`${mobileFiltersOpen ? "block border border-line-strong bg-bg-raised p-4" : "hidden"} lg:block lg:border-0 lg:bg-transparent lg:p-0`}
        >
          {filterPanel}
        </aside>

        <div>
          {sorted.length === 0 ? (
            <p className="py-16 text-center font-mono-data text-sm text-ink-muted">
              {t.shop.noResults}
            </p>
          ) : (
            <>
              <ProductGrid products={visible} currency={currency} t={t} />
              {hasMore && (
                <div className="mt-8 text-center">
                  <button
                    type="button"
                    onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
                    className="border border-line-strong px-8 py-3 font-mono-data text-xs tracking-[0.15em] text-ink transition hover:border-ink"
                  >
                    {t.shop.loadMore}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export function ShopClient(props: {
  products: Product[];
  collections: Collection[];
  links: { productId: string; collectionId: string }[];
}) {
  return (
    <Suspense fallback={null}>
      <ShopFilters {...props} />
    </Suspense>
  );
}
