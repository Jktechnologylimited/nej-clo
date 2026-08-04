import { notFound } from "next/navigation";
import { getProductBySlug } from "@/lib/products";
import { GarmentIcon } from "@/components/GarmentIcon";
import { StampBadge } from "@/components/StampBadge";
import { AddToCartForm } from "@/components/AddToCartForm";
import { swatchFor } from "@/lib/colorway";
import { formatPrice } from "@/lib/currency";
import { getLocale } from "@/lib/i18n/get-locale";
import { getCurrency } from "@/lib/i18n/get-currency";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, locale, currency] = await Promise.all([
    getProductBySlug(slug),
    getLocale(),
    getCurrency(),
  ]);
  if (!product) notFound();
  const t = getDictionary(locale);

  const sizes = product.sizes.split(",").map((s) => s.trim());
  const soldOut = product.status === "sold_out";

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="grid gap-10 lg:grid-cols-2">
        <div
          className="relative flex aspect-[4/5] items-center justify-center border border-line-strong"
          style={{ backgroundColor: swatchFor(product.colorway) }}
        >
          <GarmentIcon
            category={product.category}
            className={`h-40 w-40 ${
              product.colorway === "Bone" || product.colorway === "Amber"
                ? "text-ink/70"
                : "text-paper/85"
            } ${soldOut ? "opacity-40" : ""}`}
          />
          {product.status !== "available" && (
            <div className="absolute right-4 top-4">
              <StampBadge
                status={product.status}
                label={t.shop.filters[product.status as keyof typeof t.shop.filters]}
              />
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between font-mono-data text-[11px] tracking-[0.15em] text-paper/40">
            <span>{product.dropCode}</span>
            <span>{product.sku}</span>
          </div>

          <h1 className="mt-3 font-display text-3xl font-black uppercase leading-tight tracking-tight text-paper sm:text-4xl">
            {product.name}
          </h1>
          <p className="mt-1 font-mono-data text-sm tracking-[0.05em] text-paper/50">
            {product.colorway}
          </p>

          <p className="mt-4 font-mono-data text-2xl text-paper">
            {formatPrice(product.priceCents, currency)}
          </p>

          <p className="mt-6 max-w-md font-body text-sm leading-relaxed text-paper/60">
            {product.description}
          </p>

          <div className="dashed-line mt-8 pt-8">
            <AddToCartForm
              productId={product.id}
              slug={product.slug}
              name={product.name}
              colorway={product.colorway}
              priceCents={product.priceCents}
              sizes={sizes}
              soldOut={soldOut}
            />
          </div>

          <div className="dashed-line mt-8 grid grid-cols-2 gap-4 pt-6 font-mono-data text-[11px] tracking-[0.05em] text-paper/40">
            <div>
              <p className="text-paper/25">{t.product.stockLogged}</p>
              <p className="mt-1 text-paper/60">{product.stock} units</p>
            </div>
            <div>
              <p className="text-paper/25">{t.product.category}</p>
              <p className="mt-1 text-paper/60 capitalize">{product.category}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
