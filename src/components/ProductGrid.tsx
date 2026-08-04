import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/db/types";
import type { CurrencyCode } from "@/lib/currency";
import type { Dictionary } from "@/lib/i18n/dictionaries";



export function ProductGrid({
  products,
  currency,
  t,
}: {
  products: Product[];
  currency: CurrencyCode;
  t: Dictionary;
}) {
  if (products.length === 0) {
    return (
      <p className="py-16 text-center font-mono-data text-sm text-paper/50">
        {t.shop.empty}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          currency={currency}
          statusLabels={t.shop.filters}
        />
      ))}
    </div>
  );
}
