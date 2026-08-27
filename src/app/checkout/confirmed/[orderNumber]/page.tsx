import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderByNumber } from "@/lib/orders";
import { getAllProducts } from "@/lib/products";
import { ProductGrid } from "@/components/ProductGrid";
import { formatPrice } from "@/lib/currency";
import { getLocale } from "@/lib/i18n/get-locale";
import { getCurrency } from "@/lib/i18n/get-currency";
import { getDictionary } from "@/lib/i18n/dictionaries";

function estimatedDeliveryRange(fromDate: Date): string {
  const start = new Date(fromDate);
  start.setDate(start.getDate() + 3);
  const end = new Date(fromDate);
  end.setDate(end.getDate() + 7);
  const fmt = (d: Date) => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
  return `${fmt(start)} – ${fmt(end)}`;
}

export default async function OrderConfirmedPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const [result, locale, currency, allProducts] = await Promise.all([
    getOrderByNumber(orderNumber),
    getLocale(),
    getCurrency(),
    getAllProducts(),
  ]);
  if (!result) notFound();
  const t = getDictionary(locale);

  const { order, items } = result;
  const subtotalCents = items.reduce((sum, i) => sum + i.unitPriceCents * i.quantity, 0);
  const shippingCents = order.totalCents - subtotalCents;

  const orderedProductIds = new Set(items.map((i) => i.productId).filter(Boolean));
  const recommendations = allProducts
    .filter((p) => !orderedProductIds.has(p.id) && p.status !== "sold_out")
    .slice(0, 4);

  const steps = [
    { label: t.checkout.stepReceived, body: t.checkout.stepReceivedBody, done: true },
    { label: t.checkout.stepProcessing, body: t.checkout.stepProcessingBody, done: order.status === "paid" },
    { label: t.checkout.stepDispatched, body: t.checkout.stepDispatchedBody, done: false },
    { label: t.checkout.stepDelivered, body: t.checkout.stepDeliveredBody, done: false },
  ];

  return (
    <div className="mx-auto max-w-5xl px-5 py-14 sm:px-8 sm:py-20">
      <div className="flex flex-col items-center text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-bg-raised">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink">
            <path d="M6 13.5 11 18.5 20 8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="mt-4 font-display text-3xl font-black uppercase tracking-tight text-ink sm:text-4xl">
          {t.checkout.confirmedTitle}
        </h1>
        <p className="mt-2 max-w-md font-body text-sm text-ink-muted">{t.checkout.thankYou}</p>

        <div className="mt-6 border border-line-strong bg-bg-raised px-6 py-3">
          <p className="font-mono-data text-[10px] tracking-[0.15em] text-ink-muted">
            {t.checkout.receiptLabel}
          </p>
          <p className="mt-0.5 font-mono-data text-lg font-bold text-ink">#{order.orderNumber}</p>
        </div>
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <p className="mb-6 font-mono-data text-xs tracking-[0.15em] text-ink-muted">
            {t.checkout.whatHappensNext}
          </p>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {steps.map((step) => (
              <div key={step.label}>
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full border ${
                    step.done ? "border-ink bg-ink text-paper" : "border-line-strong text-ink-muted"
                  }`}
                >
                  {step.done ? (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M3 7 6 10 11 4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  )}
                </div>
                <p className="mt-2 font-mono-data text-[11px] font-bold tracking-[0.05em] text-ink">
                  {step.label}
                </p>
                <p className="mt-1 font-body text-[11px] leading-relaxed text-ink-muted">
                  {step.body}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
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
            <div className="border border-line-strong p-4">
              <p className="font-mono-data text-[10px] tracking-[0.1em] text-ink-muted">
                {t.checkout.shippingMethod}
              </p>
              <p className="mt-2 font-mono-data text-xs text-ink">{t.checkout.standardDelivery}</p>
              <p className="mt-1 font-mono-data text-[10px] text-ink-muted">
                {t.checkout.estimatedDelivery}: {estimatedDeliveryRange(new Date(order.createdAt))}
              </p>
            </div>
            <div className="border border-line-strong p-4">
              <p className="font-mono-data text-[10px] tracking-[0.1em] text-ink-muted">
                {t.checkout.paymentMethod}
              </p>
              <p className="mt-2 font-mono-data text-xs text-ink">
                {order.paymentReference ? t.checkout.paidViaPaystack : t.checkout.paymentPendingNote}
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-start justify-between gap-4 border border-line-strong bg-bg-raised p-5 sm:flex-row sm:items-center">
            <div>
              <p className="font-mono-data text-xs font-bold text-ink">{t.checkout.keepEyeTitle}</p>
              <p className="mt-1 max-w-sm font-body text-xs text-ink-muted">{t.checkout.keepEyeBody}</p>
              <Link
                href="/account"
                className="mt-2 inline-block font-mono-data text-[11px] text-ink underline underline-offset-2 hover:text-ink-muted"
              >
                {t.checkout.goToAccount} →
              </Link>
            </div>
            <Link
              href={`/account/orders/${order.orderNumber}/track`}
              className="w-full shrink-0 border border-ink bg-ink px-6 py-3 text-center font-mono-data text-xs tracking-[0.15em] text-paper transition hover:bg-amber hover:border-amber hover:text-bg sm:w-auto"
            >
              {t.checkout.trackOrder}
            </Link>
          </div>
        </div>

        <div className="h-fit border border-line-strong bg-bg-raised p-5">
          <p className="mb-4 font-mono-data text-[11px] tracking-[0.15em] text-ink-muted">
            {t.checkout.orderSummary} — {t.cart.itemsCount(items.length)}
          </p>
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between gap-2 font-mono-data text-xs text-ink-muted">
                <span className="min-w-0 truncate">
                  {item.productName} — {item.size} × {item.quantity}
                </span>
                <span className="shrink-0 text-ink">
                  {formatPrice(item.unitPriceCents * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="dashed-line mt-4 space-y-2 pt-4 font-mono-data text-xs text-ink">
            <div className="flex justify-between">
              <span className="text-ink-muted">{t.cart.subtotal}</span>
              <span>{formatPrice(subtotalCents)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">{t.cart.shipping}</span>
              <span>{shippingCents === 0 ? t.cart.freeShipping : formatPrice(shippingCents)}</span>
            </div>
          </div>
          <div className="mt-3 flex justify-between border-t border-dashed border-line-strong pt-3 font-mono-data text-sm font-bold text-ink">
            <span>{t.checkout.totalPaid}</span>
            <span>{formatPrice(order.totalCents)}</span>
          </div>
        </div>
      </div>

      {recommendations.length > 0 && (
        <div className="mt-16">
          <p className="mb-4 font-mono-data text-xs tracking-[0.15em] text-ink-muted">
            {t.checkout.youMightAlsoLike}
          </p>
          <ProductGrid products={recommendations} currency={currency} t={t} />
        </div>
      )}

      <Link
        href="/shop"
        className="mt-10 inline-block border border-line-strong px-6 py-3 font-mono-data text-xs tracking-[0.15em] text-ink transition hover:border-ink"
      >
        {t.checkout.backToStock}
      </Link>
    </div>
  );
}
