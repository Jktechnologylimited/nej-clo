import Link from "next/link";
import { notFound } from "next/navigation";
import { getProductBySlug, getColorwaySiblings } from "@/lib/products";
import { AddToCartForm } from "@/components/AddToCartForm";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductTabs } from "@/components/ProductTabs";
import { ManifestPreview } from "@/components/ManifestPreview";
import { TrustStrip } from "@/components/TrustStrip";
import { effectiveSwatch } from "@/lib/colorway";
import { formatPrice } from "@/lib/currency";
import { getLocale } from "@/lib/i18n/get-locale";
import { getCurrency } from "@/lib/i18n/get-currency";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getSiteContent } from "@/lib/site-content";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [product, locale, currency, content] = await Promise.all([
    getProductBySlug(slug),
    getLocale(),
    getCurrency(),
    getSiteContent(),
  ]);
  if (!product) notFound();
  const t = getDictionary(locale);
  const siblings = await getColorwaySiblings(product.name, product.id);

  const sizes = product.sizes.split(",").map((s) => s.trim());
  const soldOut = product.status === "sold_out";
  const statusLabel = t.shop.filters[product.status as keyof typeof t.shop.filters];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <p className="font-mono-data text-[11px] tracking-[0.1em] text-ink-muted">
        <Link href="/" className="hover:text-ink">Home</Link>
        {" / "}
        <Link href="/shop" className="hover:text-ink">Shop All</Link>
        {" / "}
        <Link href={`/shop?category=${product.category}`} className="capitalize hover:text-ink">
          {product.category}
        </Link>
        {" / "}
        <span className="text-ink">{product.name}</span>
      </p>

      <div className="mt-6 grid gap-10 lg:grid-cols-2">
        <ProductGallery
          images={product.imageUrls}
          category={product.category}
          colorway={product.colorway}
          swatchColor={effectiveSwatch(product)}
          productName={product.name}
          status={product.status}
          statusLabel={statusLabel}
        />

        <div>
          <div className="flex items-center justify-between font-mono-data text-[11px] tracking-[0.15em] text-ink-muted">
            <span>{product.dropCode}</span>
            <span>{product.sku}</span>
          </div>

          <h1 className="mt-3 font-display text-3xl font-black uppercase leading-tight tracking-tight text-ink sm:text-4xl">
            {product.name}
          </h1>

          <p className="mt-1 font-mono-data text-xs tracking-[0.1em] text-ink-muted">
            {t.product.limitedRunNote}
          </p>

          <p className="mt-4 font-mono-data text-2xl text-ink">
            {formatPrice(product.priceCents, currency)}
          </p>

          {siblings.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 font-mono-data text-[11px] tracking-[0.1em] text-ink-muted">
                {t.product.color}: {product.colorway.toUpperCase()}
              </p>
              <div className="flex gap-2">
                <span
                  className="h-8 w-8 border-2 border-ink"
                  style={{ backgroundColor: effectiveSwatch(product) }}
                  title={product.colorway}
                />
                {siblings.map((sib) => (
                  <Link
                    key={sib.id}
                    href={`/product/${sib.slug}`}
                    className="h-8 w-8 border border-line-strong transition hover:border-ink"
                    style={{ backgroundColor: effectiveSwatch(sib) }}
                    title={sib.colorway}
                  />
                ))}
              </div>
            </div>
          )}

          <p className="mt-6 max-w-md font-body text-sm leading-relaxed text-ink-muted">
            {product.description}
          </p>

          <div className="dashed-line mt-6 pt-6">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono-data text-[11px] tracking-[0.1em] text-ink-muted">
                {t.product.size}
              </span>
              <Link
                href="/help?tab=size-guide"
                className="font-mono-data text-[11px] tracking-[0.05em] text-ink-muted underline underline-offset-2 hover:text-ink"
              >
                {t.product.sizeGuide}
              </Link>
            </div>

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

          {!soldOut && (
            <p className="mt-3 flex items-center gap-2 font-mono-data text-xs text-ink-muted">
              <span
                className={`h-2 w-2 rounded-full ${product.status === "limited" ? "bg-amber" : "bg-ink"}`}
              />
              {statusLabel.toUpperCase()} · {t.product.shipsWithin}
            </p>
          )}

          <ManifestPreview />

          <div className="dashed-line mt-8 grid grid-cols-2 gap-4 pt-6 font-mono-data text-[11px] tracking-[0.05em] text-ink-muted">
            <div>
              <p className="text-ink-muted/60">{t.product.stockLogged}</p>
              <p className="mt-1 text-ink">{product.stock} units</p>
            </div>
            <div>
              <p className="text-ink-muted/60">{t.product.category}</p>
              <p className="mt-1 capitalize text-ink">{product.category}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-14">
        <ProductTabs
          tabs={[
            { label: t.product.tabDetails, content: product.description },
            { label: t.product.tabFit, content: t.product.fitDefault },
            { label: t.product.tabMaterial, content: t.product.materialDefault },
            { label: t.product.tabCare, content: t.product.careDefault },
            { label: t.product.tabShipping, content: t.product.shippingReturnsDefault },
          ]}
        />
      </div>

      <TrustStrip t={t} content={content} />
    </div>
  );
}
