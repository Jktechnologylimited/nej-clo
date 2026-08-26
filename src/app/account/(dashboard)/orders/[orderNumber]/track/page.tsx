import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getOrderByNumber } from "@/lib/orders";
import { FULFILLMENT_STAGES, fulfillmentStageIndex } from "@/lib/order-status";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function TrackOrderPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const session = await getSession();
  if (!session) return null;

  const [result, locale] = await Promise.all([getOrderByNumber(orderNumber), getLocale()]);
  if (!result || result.order.userId !== session.userId) notFound();
  const { order } = result;
  const t = getDictionary(locale);

  const stageIndex = fulfillmentStageIndex(order.status);
  const stages = [
    { key: "paid", label: t.checkout.stepReceived },
    { key: "processing", label: t.checkout.stepProcessing },
    { key: "dispatched", label: t.checkout.stepDispatched },
    { key: "in_transit", label: t.account.statInTransit },
    { key: "out_for_delivery", label: t.checkout.stepOutForDelivery },
    { key: "delivered", label: t.checkout.stepDelivered },
  ];

  const notYetPaid = stageIndex < 0;

  return (
    <div>
      <Link
        href={`/account/orders/${order.orderNumber}`}
        className="font-mono-data text-[11px] tracking-[0.1em] text-ink-muted underline underline-offset-2 hover:text-ink"
      >
        ← {order.orderNumber}
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-black uppercase tracking-tight text-ink sm:text-3xl">
          {t.account.trackingTitle}
        </h1>
        <span className="border border-line-strong px-3 py-1 font-mono-data text-[11px] tracking-[0.05em] text-ink">
          {order.status.replace("_", " ").toUpperCase()}
        </span>
      </div>

      {notYetPaid ? (
        <p className="mt-6 border border-dashed border-line-strong px-5 py-6 font-mono-data text-xs text-ink-muted">
          {t.account.notDispatchedNote}
        </p>
      ) : (
        <>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {order.carrier && (
              <div className="border border-line-strong p-4">
                <p className="font-mono-data text-[10px] tracking-[0.1em] text-ink-muted">{t.account.carrier}</p>
                <p className="mt-1 font-mono-data text-xs text-ink">{order.carrier}</p>
              </div>
            )}
            {order.trackingNumber && (
              <div className="border border-line-strong p-4">
                <p className="font-mono-data text-[10px] tracking-[0.1em] text-ink-muted">
                  {t.account.trackingNumber}
                </p>
                <p className="mt-1 font-mono-data text-xs text-ink">{order.trackingNumber}</p>
              </div>
            )}
            <div className="border border-line-strong p-4">
              <p className="font-mono-data text-[10px] tracking-[0.1em] text-ink-muted">
                {t.account.deliveryAddress}
              </p>
              <p className="mt-1 font-mono-data text-xs text-ink">
                {order.city}, {order.country}
              </p>
            </div>
          </div>

          <p className="mt-8 mb-4 font-mono-data text-xs tracking-[0.15em] text-ink-muted">
            {t.account.deliveryProgress}
          </p>
          <div className="space-y-0">
            {stages.map((stage, i) => {
              const done = i <= stageIndex;
              const isLast = i === stages.length - 1;
              return (
                <div key={stage.key} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
                        done ? "border-ink bg-ink text-paper" : "border-line-strong text-ink-muted"
                      }`}
                    >
                      {done ? (
                        <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 7 6 10 11 4" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                      )}
                    </div>
                    {!isLast && (
                      <div className={`w-px flex-1 ${i < stageIndex ? "bg-ink" : "bg-line-strong"}`} style={{ minHeight: 24 }} />
                    )}
                  </div>
                  <div className="pb-6">
                    <p className={`font-mono-data text-xs font-bold tracking-[0.05em] ${done ? "text-ink" : "text-ink-muted"}`}>
                      {stage.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="border border-line-strong bg-bg-raised px-4 py-3 font-mono-data text-xs text-ink-muted">
            {stageIndex >= FULFILLMENT_STAGES.indexOf("dispatched") && stageIndex < FULFILLMENT_STAGES.indexOf("delivered")
              ? t.account.onTheWayNote
              : t.account.notDispatchedNote}
          </p>
        </>
      )}

      <div className="mt-10">
        <p className="mb-3 font-mono-data text-xs tracking-[0.15em] text-ink-muted">
          {t.account.quickActions}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href={`/checkout/confirmed/${order.orderNumber}`}
            className="border border-line-strong px-5 py-2.5 font-mono-data text-xs tracking-[0.1em] text-ink transition hover:border-ink"
          >
            {t.account.downloadInvoice}
          </Link>
          <Link
            href={`/account/orders/${order.orderNumber}`}
            className="border border-line-strong px-5 py-2.5 font-mono-data text-xs tracking-[0.1em] text-ink transition hover:border-ink"
          >
            {t.account.backToOrders}
          </Link>
          <Link
            href="/help#contact"
            className="border border-line-strong px-5 py-2.5 font-mono-data text-xs tracking-[0.1em] text-ink transition hover:border-ink"
          >
            {t.account.contactSupport}
          </Link>
          <Link
            href="/help#contact"
            className="border border-line-strong px-5 py-2.5 font-mono-data text-xs tracking-[0.1em] text-ink transition hover:border-ink"
          >
            {t.account.reportIssue}
          </Link>
        </div>
      </div>

      <div className="mt-8 border border-line-strong bg-bg-raised p-5">
        <p className="font-mono-data text-xs font-bold text-ink">{t.account.needHelpBannerTitle}</p>
        <p className="mt-1 font-body text-xs text-ink-muted">{t.account.needHelpBannerBody}</p>
      </div>
    </div>
  );
}
