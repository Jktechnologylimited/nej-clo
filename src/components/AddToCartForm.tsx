"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";
import { useI18n } from "./I18nProvider";

type Props = {
  productId: string;
  slug: string;
  name: string;
  colorway: string;
  priceCents: number;
  sizes: string[];
  soldOut: boolean;
};

export function AddToCartForm({
  productId,
  slug,
  name,
  colorway,
  priceCents,
  sizes,
  soldOut,
}: Props) {
  const { addItem } = useCart();
  const { t, formatPrice } = useI18n();
  const [size, setSize] = useState<string | null>(sizes[0] ?? null);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  function handleAdd() {
    if (!size) return;
    addItem({ productId, slug, name, colorway, size, quantity, unitPriceCents: priceCents });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  if (soldOut) {
    return (
      <button
        disabled
        className="w-full cursor-not-allowed border border-line-strong bg-transparent px-6 py-4 text-center font-mono-data text-xs tracking-[0.15em] text-paper/40"
      >
        {t.product.soldOut}
      </button>
    );
  }

  return (
    <div>
      <div>
        <p className="mb-2 font-mono-data text-[11px] tracking-[0.15em] text-paper/40">
          {t.product.size}
        </p>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              className={`border px-3 py-2 font-mono-data text-xs tracking-[0.05em] transition ${
                size === s
                  ? "border-amber bg-amber text-ink"
                  : "border-line-strong text-paper/70 hover:border-amber hover:text-amber"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 flex items-center gap-4">
        <p className="font-mono-data text-[11px] tracking-[0.15em] text-paper/40">
          {t.product.qty}
        </p>
        <div className="flex items-center border border-line-strong">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="px-3 py-1.5 font-mono-data text-paper/70 transition hover:text-amber"
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="min-w-[2ch] px-2 text-center font-mono-data text-sm">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => q + 1)}
            className="px-3 py-1.5 font-mono-data text-paper/70 transition hover:text-amber"
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      <button
        type="button"
        onClick={handleAdd}
        disabled={!size}
        className="mt-6 w-full border border-paper bg-paper px-6 py-4 text-center font-mono-data text-xs tracking-[0.15em] text-ink transition hover:bg-amber hover:border-amber disabled:opacity-50"
      >
        {added ? t.product.added : t.product.addToManifest(formatPrice(priceCents * quantity))}
      </button>
    </div>
  );
}
