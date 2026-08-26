import Link from "next/link";
import { getAllOrders } from "@/lib/orders";
import { formatPrice } from "@/lib/currency";

export default async function AdminOrdersPage() {
  const orders = await getAllOrders();

  return (
    <div className="mx-auto max-w-4xl px-5 py-14 sm:px-8 sm:py-20">
      <p className="font-mono-data text-[11px] tracking-[0.2em] text-ink-muted">ADMIN</p>
      <h1 className="mt-1 font-display text-3xl font-extrabold uppercase tracking-tight text-ink">
        Orders
      </h1>

      {orders.length === 0 ? (
        <p className="mt-10 border border-dashed border-line-strong px-6 py-10 text-center font-mono-data text-xs text-ink-muted">
          NO ORDERS YET.
        </p>
      ) : (
        <div className="mt-8 divide-y divide-line border border-line">
          {orders.map((o) => (
            <Link
              key={o.id}
              href={`/admin/orders/${o.id}/edit`}
              className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-bg-raised"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-mono-data text-xs text-ink">
                  {o.orderNumber} <span className="text-ink-muted">— {o.name}</span>
                </p>
                <p className="mt-1 truncate font-mono-data text-[11px] text-ink-muted">
                  {new Date(o.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  · {o.status.replace("_", " ").toUpperCase()}
                </p>
              </div>
              <p className="shrink-0 font-mono-data text-sm text-ink">{formatPrice(o.totalCents)}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
