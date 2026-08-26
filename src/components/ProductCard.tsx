import Link from "next/link";
import { GarmentIcon } from "./GarmentIcon";
import { StampBadge } from "./StampBadge";
import { QuickAddButton } from "./QuickAddButton";
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
  const sizeList = product.sizes.split(",").map((s) => s.trim());

  return (
    <div className="group relative border border-line-strong bg-paper text-ink transition hover:border-ink">
      <Link href={`/product/${product.slug}`} className="block">
        <div
          className="relative flex aspect-[4/5] items-center justify-center overflow-hidden"
          style={{ backgroundColor: swatchFor(product.colorway) }}
        >
          {product.status !== "available" && (
            <div className="absolute left-3 top-3 z-10">
              <StampBadge
                status={product.status}
                label={statusLabels[product.status as keyof typeof statusLabels]}
              />
            </div>
          )}

          {product.imageUrls[0] ? (
            // eslint-disable-next-line @next/next/no-img-element -- stored as a data: URL, next/image doesn't optimize those
            <img
              src={product.imageUrls[0]}
              alt={product.name}
              className={`h-full w-full object-cover transition duration-300 group-hover:scale-105 ${soldOut ? "opacity-40" : ""}`}
            />
          ) : (
            <GarmentIcon
              category={product.category}
              className={`h-24 w-24 transition duration-300 group-hover:scale-105 ${
                product.colorway === "Bone" || product.colorway === "Amber"
                  ? "text-ink/70"
                  : "text-paper/85"
              } ${soldOut ? "opacity-40" : ""}`}
            />
          )}
        </div>
      </Link>

      {!soldOut && (
        <QuickAddButton
          productId={product.id}
          slug={product.slug}
          name={product.name}
          colorway={product.colorway}
          priceCents={product.priceCents}
          sizes={product.sizes}
        />
      )}

      <Link href={`/product/${product.slug}`} className="block px-3 py-3">
        <h3 className="font-display text-sm font-extrabold uppercase leading-tight tracking-tight">
          {product.name}
        </h3>
        <div className="mt-1.5 flex items-baseline justify-between gap-2">
          <p className="min-w-0 truncate font-mono-data text-[11px] tracking-[0.05em] text-ink-muted">
            {product.colorway}
          </p>
          <span className="shrink-0 font-mono-data text-sm font-medium">
            {formatPrice(product.priceCents, currency)}
          </span>
        </div>
        <p className="mt-1.5 truncate font-mono-data text-[10px] tracking-[0.05em] text-ink-muted/70">
          {sizeList.join(" · ")}
        </p>
      </Link>
    </div>
  );
}
