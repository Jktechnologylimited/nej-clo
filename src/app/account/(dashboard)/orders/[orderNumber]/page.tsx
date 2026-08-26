import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getOrderByNumber } from "@/lib/orders";
import { getProductById } from "@/lib/products";
import { fulfillmentStageIndex } from "@/lib/order-status";
import { formatPrice } from "@/lib/currency";
import { getLocale } from "@/lib/i18n/get-locale";
import { getCurrency } from "@/lib/i18n/get-currency";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { ReorderButton, type ReorderLine } from "./ReorderButton";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const session = await getSession();
  if (!session) return null;

  const [result, locale, currency] = await Promise.all([
    getOrderByNumber(orderNumber),
    getLocale(),
    getCurrency(),
  ]);
  if (!result || result.order.userId !== session.userId) notFound();
  const { order, items } = result;
  const t = getDictionary(locale);

  const subtotalCents = items.reduce((sum, i) => sum + i.unitPriceCents * i.quantity, 0);
  const shippingCents = order.totalCents - subtotalCents;
  const stageIndex = fulfillmentStageIndex(order.status);

  // Resolve current product data (slug/colorway may have changed, or the
  // product may have been deleted) so "Reorder" can't link to a broken page.
  const reorderLines: ReorderLine[] = (
    await Promise.all(
      items.map(async (item) => {
        if (!item.productId) return null;
        const product = await getProductById(item.productId);
        if (!product) return null;
        return {
          productId: product.id,
          slug: product.slug,
          name: product.name,
          colorway: product.colorway,
          size: item.size,
          quantity: item.quantity,
          unitPriceCents: item.unitPriceCents,
        };
      }),
    )
  ).filter((l): l is ReorderLine => l !== null);

  return (
    <div>
      <Link
        href="/account/orders"
        className="font-mono-data text-[11px] tracking-[0.1em] text-ink-muted underline underline-offset-2 hover:text-ink"
      >
        ← {t.account.backToOrders}
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-black uppercase tracking-tight text-ink sm:text-3xl">
          {order.orderNumber}
        </h1>
        <span className="border border-line-strong px-3 py-1 font-mono-data text-[11px] tracking-[0.05em] text-ink">
          {order.status.replace("_", " ").toUpperCase()}
        </span>
      </div>

      {stageIndex >= 0 && (
        <Link
          href={`/account/orders/${order.orderNumber}/track`}
          className="mt-2 inline-block font-mono-data text-[11px] text-ink underline underline-offset-2 hover:text-ink-muted"
        >
          {t.checkout.trackOrder} →
        </Link>
      )}

      <div className="mt-8">
        <p className="mb-2 font-mono-data text-xs tracking-[0.1em] text-ink-muted">
          {t.account.itemsInOrder(items.length)}
        </p>
        <div className="divide-y divide-line border border-line">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between gap-4 px-4 py-3">
              <div>
                <p className="font-mono-data text-xs text-ink">{item.productName}</p>
                <p className="mt-0.5 font-mono-data text-[11px] text-ink-muted">
                  {item.size} · {t.product.qty}: {item.quantity}
                </p>
              </div>
              <p className="font-mono-data text-xs text-ink">
                {formatPrice(item.unitPriceCents * item.quantity, currency)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="border border-line-strong p-4">
          <p className="font-mono-data text-[10px] tracking-[0.1em] text-ink-muted">
            {t.checkout.orderSummary}
          </p>
          <div className="mt-2 space-y-1.5 font-mono-data text-xs text-ink">
            <div className="flex justify-between">
              <span className="text-ink-muted">{t.cart.subtotal}</span>
              <span>{formatPrice(subtotalCents, currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">{t.cart.shipping}</span>
              <span>{shippingCents === 0 ? t.cart.freeShipping : formatPrice(shippingCents, currency)}</span>
            </div>
            <div className="flex justify-between border-t border-dashed border-line-strong pt-1.5 font-bold">
              <span>{t.checkout.totalPaid}</span>
              <span>{formatPrice(order.totalCents, currency)}</span>
            </div>
          </div>
        </div>

        <div className="border border-line-strong p-4">
          <p className="font-mono-data text-[10px] tracking-[0.1em] text-ink-muted">
            {t.checkout.shipTo}
          </p>
          <p className="mt-2 font-mono-data text-xs leading-relaxed text-ink">
            {order.name}
            <br />
            {order.addressLine1}
            {order.addressLine2 ? <>, {order.addressLine2}</> : null}
            <br />
            {order.city}, {order.postalCode}
            <br />
            {order.country}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={`/checkout/confirmed/${order.orderNumber}`}
          className="border border-line-strong px-5 py-2.5 font-mono-data text-xs tracking-[0.1em] text-ink transition hover:border-ink"
        >
          {t.account.downloadInvoice}
        </Link>
        <ReorderButton
          lines={reorderLines}
          label={t.account.reorderItems}
          addedLabel={t.account.reorderAdded}
        />
        <Link
          href="/help#contact"
          className="border border-line-strong px-5 py-2.5 font-mono-data text-xs tracking-[0.1em] text-ink transition hover:border-ink"
        >
          {t.account.needHelp}
        </Link>
      </div>
    </div>
  );
}
