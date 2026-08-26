import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/orders";
import { formatPrice } from "@/lib/currency";
import { OrderFulfillmentForm } from "./OrderFulfillmentForm";

export default async function EditOrderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const result = await getOrderById(id);
  if (!result) notFound();
  const { order, items } = result;

  return (
    <div className="mx-auto max-w-2xl px-5 py-14 sm:px-8 sm:py-20">
      <p className="font-mono-data text-[11px] tracking-[0.2em] text-ink-muted">
        ADMIN — ORDER
      </p>
      <h1 className="mt-1 font-display text-3xl font-extrabold uppercase tracking-tight text-ink">
        {order.orderNumber}
      </h1>

      <div className="mt-6 grid gap-4 border border-line-strong p-4 font-mono-data text-xs sm:grid-cols-2">
        <div>
          <p className="text-ink-muted">CUSTOMER</p>
          <p className="mt-1 text-ink">{order.name}</p>
          <p className="text-ink-muted">{order.email}</p>
        </div>
        <div>
          <p className="text-ink-muted">SHIP TO</p>
          <p className="mt-1 text-ink">
            {order.addressLine1}{order.addressLine2 ? `, ${order.addressLine2}` : ""}
            <br />
            {order.city}, {order.postalCode}
            <br />
            {order.country}
          </p>
        </div>
      </div>

      <div className="mt-4 border border-line-strong p-4">
        <p className="mb-2 font-mono-data text-xs text-ink-muted">ITEMS</p>
        <div className="space-y-1.5">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between font-mono-data text-xs text-ink">
              <span>{item.productName} — {item.size} × {item.quantity}</span>
              <span>{formatPrice(item.unitPriceCents * item.quantity)}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between border-t border-dashed border-line-strong pt-2 font-mono-data text-xs font-bold text-ink">
          <span>TOTAL</span>
          <span>{formatPrice(order.totalCents)}</span>
        </div>
      </div>

      <OrderFulfillmentForm order={order} />
    </div>
  );
}
