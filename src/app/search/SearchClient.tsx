"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useI18n } from "@/components/I18nProvider";
import { ProductGrid } from "@/components/ProductGrid";
import { searchProducts, searchCollections } from "@/lib/search";
import type { Product, Collection } from "@/lib/db/types";

const RECENT_KEY = "nej_recent_searches";
const MAX_RECENT = 5;

function loadRecent(): string[] {
  try {
    const raw = window.localStorage.getItem(RECENT_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveRecent(list: string[]) {
  try {
    window.localStorage.setItem(RECENT_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

export function SearchClient({
  products,
  collections,
}: {
  products: Product[];
  collections: Collection[];
}) {
  const { t, currency } = useI18n();
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState<string[]>([]);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time load from a client-only store (localStorage) on mount, not a derived-state loop
    setRecent(loadRecent());
  }, []);

  // Commit to recent-searches history once the query has been stable for a
  // moment, rather than requiring an explicit submit button.
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const trimmed = query.trim();
    if (trimmed.length < 2) return;

    debounceRef.current = setTimeout(() => {
      setRecent((prev) => {
        const next = [trimmed, ...prev.filter((q) => q.toLowerCase() !== trimmed.toLowerCase())].slice(
          0,
          MAX_RECENT,
        );
        saveRecent(next);
        return next;
      });
    }, 900);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  function clearRecent() {
    setRecent([]);
    saveRecent([]);
  }

  const trimmedQuery = query.trim();
  const hasQuery = trimmedQuery.length > 0;
  const matchedProducts = hasQuery ? searchProducts(products, trimmedQuery) : [];
  const matchedCollections = hasQuery ? searchCollections(collections, trimmedQuery) : [];
  const totalResults = matchedProducts.length + matchedCollections.length;

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <h1 className="font-display text-2xl font-black uppercase tracking-tight text-ink sm:text-3xl">
        {t.search.title}
      </h1>

      <div className="relative mt-6">
        <svg
          width="16"
          height="16"
          viewBox="0 0 18 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted"
        >
          <circle cx="8" cy="8" r="6" />
          <path d="M16.5 16.5 12.5 12.5" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.search.placeholder}
          className="w-full border border-line-strong bg-paper py-3 pl-10 pr-3 font-mono-data text-sm text-ink placeholder:text-ink-muted/60 focus:border-ink focus:outline-none"
        />
      </div>

      {!hasQuery && (
        <div className="mt-6">
          {recent.length > 0 && (
            <div>
              <div className="flex items-center justify-between">
                <p className="font-mono-data text-[11px] tracking-[0.15em] text-ink-muted">
                  {t.search.recentSearches}
                </p>
                <button
                  type="button"
                  onClick={clearRecent}
                  className="font-mono-data text-[11px] tracking-[0.1em] text-ink-muted underline underline-offset-2 hover:text-ink"
                >
                  {t.search.clearRecent}
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {recent.map((q) => (
                  <button
                    key={q}
                    type="button"
                    onClick={() => setQuery(q)}
                    className="border border-line-strong px-3 py-1.5 font-mono-data text-xs text-ink transition hover:border-ink"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}
          <p className="mt-8 font-mono-data text-xs text-ink-muted">{t.search.startTyping}</p>
        </div>
      )}

      {hasQuery && (
        <div className="mt-8">
          <p className="mb-6 font-mono-data text-xs tracking-[0.1em] text-ink-muted">
            {t.search.resultsFor(trimmedQuery)} — {t.search.resultsCount(totalResults)}
          </p>

          {totalResults === 0 ? (
            <p className="py-16 text-center font-mono-data text-sm text-ink-muted">
              {t.search.noResults}
            </p>
          ) : (
            <>
              {matchedCollections.length > 0 && (
                <div className="mb-10">
                  <p className="mb-3 font-mono-data text-[11px] tracking-[0.15em] text-ink-muted">
                    {t.search.collections}
                  </p>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {matchedCollections.map((c) => (
                      <Link
                        key={c.id}
                        href={`/collections/${c.slug}`}
                        className="border border-line-strong bg-paper p-4 text-ink transition hover:border-ink"
                      >
                        <p className="font-display text-sm font-bold uppercase">{c.name}</p>
                        <p className="mt-1 line-clamp-2 font-mono-data text-[11px] text-ink-muted">
                          {c.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {matchedProducts.length > 0 && (
                <div>
                  <p className="mb-3 font-mono-data text-[11px] tracking-[0.15em] text-ink-muted">
                    {t.search.products}
                  </p>
                  <ProductGrid products={matchedProducts} currency={currency} t={t} />
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
