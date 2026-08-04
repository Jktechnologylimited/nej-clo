import Link from "next/link";
import { notFound } from "next/navigation";
import { getOrderByNumber } from "@/lib/orders";
import { formatPrice } from "@/lib/currency";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function OrderConfirmedPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const [result, locale] = await Promise.all([
    getOrderByNumber(orderNumber),
    getLocale(),
  ]);
  if (!result) notFound();
  const t = getDictionary(locale);

  const { order, items } = result;

  return (
    <div className="mx-auto max-w-2xl px-5 py-14 sm:px-8 sm:py-20">
      <div className="border border-line-strong bg-paper text-ink">
        <div className="border-b-2 border-dashed border-ink/40 px-6 py-5">
          <p className="font-mono-data text-[11px] tracking-[0.2em] text-ink-muted">
            {t.checkout.receiptLabel}
          </p>
          <h1 className="mt-2 font-display text-2xl font-black uppercase tracking-tight">
            {t.checkout.confirmedTitle}
          </h1>
          <p className="mt-1 font-mono-data text-sm text-ink-muted">
            {order.orderNumber}
          </p>
        </div>

        <div className="px-6 py-5">
          <table className="w-full border-collapse font-mono-data text-xs">
            <thead>
              <tr className="border-b border-ink/20 text-left text-ink-muted">
                <th className="pb-2 font-normal">{t.cart.item}</th>
                <th className="pb-2 font-normal">{t.product.size}</th>
                <th className="pb-2 text-center font-normal">{t.product.qty}</th>
                <th className="pb-2 text-right font-normal">{t.checkout.total}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-ink/10">
                  <td className="py-2">{item.productName}</td>
                  <td className="py-2">{item.size}</td>
                  <td className="py-2 text-center">{item.quantity}</td>
                  <td className="py-2 text-right">
                    {formatPrice(item.unitPriceCents * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-4 flex justify-between font-mono-data text-sm font-bold">
            <span>{t.checkout.total}</span>
            <span>{formatPrice(order.totalCents)}</span>
          </div>

          <div className="dashed-line mt-6 grid grid-cols-2 gap-4 pt-4 font-mono-data text-[11px] text-ink-muted">
            <div>
              <p>{t.checkout.shipTo}</p>
              <p className="mt-1 text-ink">
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
            <div>
              <p>{t.checkout.status}</p>
              <p className="mt-1 text-ink">{order.status.toUpperCase()}</p>
              <p className="mt-3">{t.checkout.confirmationSentTo}</p>
              <p className="mt-1 text-ink">{order.email}</p>
            </div>
          </div>
        </div>
      </div>

      <Link
        href="/shop"
        className="mt-8 inline-block border border-paper px-6 py-3 font-mono-data text-xs tracking-[0.15em] text-paper transition hover:bg-amber hover:border-amber hover:text-ink"
      >
        {t.checkout.backToStock}
      </Link>
    </div>
  );
}
