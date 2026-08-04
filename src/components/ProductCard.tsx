import Link from "next/link";
import { GarmentIcon } from "./GarmentIcon";
import { StampBadge } from "./StampBadge";
import { swatchFor } from "@/lib/colorway";
import { formatPrice, type CurrencyCode } from "@/lib/currency";
import type { Product } from "@/lib/db/types";
import type { Dictionary } from "@/lib/i18n/dictionaries";



export function ProductCard({
  product,
  currency,
  statusLabels,
}: {
  product: Product;
  currency: CurrencyCode;
  statusLabels: Dictionary["shop"]["filters"];
}) {
  const soldOut = product.status === "sold_out";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group block border border-line-strong bg-paper text-ink transition hover:border-amber"
    >
      <div className="flex items-center justify-between border-b border-dashed border-ink/30 px-3 py-2 font-mono-data text-[10px] tracking-[0.1em] text-ink-muted">
        <span>{product.dropCode}</span>
        <span>{product.sku}</span>
      </div>

      <div
        className="relative flex aspect-[4/5] items-center justify-center"
        style={{ backgroundColor: swatchFor(product.colorway) }}
      >
        <GarmentIcon
          category={product.category}
          className={`h-24 w-24 transition duration-300 group-hover:scale-105 ${
            product.colorway === "Bone" || product.colorway === "Amber"
              ? "text-ink/70"
              : "text-paper/85"
          } ${soldOut ? "opacity-40" : ""}`}
        />
        {product.status !== "available" && (
          <div className="absolute right-3 top-3">
            <StampBadge
              status={product.status}
              label={statusLabels[product.status as keyof typeof statusLabels]}
            />
          </div>
        )}
      </div>

      <div className="px-3 py-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-sm font-extrabold uppercase leading-tight tracking-tight">
            {product.name}
          </h3>
          <span className="shrink-0 font-mono-data text-sm font-medium">
            {formatPrice(product.priceCents, currency)}
          </span>
        </div>
        <p className="mt-1 font-mono-data text-[11px] tracking-[0.05em] text-ink-muted">
          {product.colorway}
        </p>
      </div>
    </Link>
  );
}
