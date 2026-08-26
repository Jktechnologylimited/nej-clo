"use client";

import { useState } from "react";
import { useCart } from "./CartProvider";
import { useI18n } from "./I18nProvider";

export function QuickAddButton({
  productId,
  slug,
  name,
  colorway,
  priceCents,
  sizes,
}: {
  productId: string;
  slug: string;
  name: string;
  colorway: string;
  priceCents: number;
  sizes: string;
}) {
  const { addItem } = useCart();
  const { t } = useI18n();
  const [added, setAdded] = useState(false);

  function handleClick() {
    const firstSize = sizes.split(",")[0]?.trim();
    if (!firstSize) return;
    addItem({
      productId,
      slug,
      name,
      colorway,
      size: firstSize,
      quantity: 1,
      unitPriceCents: priceCents,
      availableSizes: sizes,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={t.shop.quickAdd}
      title={t.shop.quickAdd}
      className="absolute bottom-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-ink font-mono-data text-sm text-paper shadow-sm transition hover:bg-amber hover:text-ink"
    >
      {added ? "✓" : "+"}
    </button>
  );
}
