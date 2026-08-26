"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import type { Order } from "@/lib/db/types";
import { useI18n } from "@/components/I18nProvider";
import { orderStatusGroup, type OrderStatusGroup } from "@/lib/order-status";

type Tab = "all" | OrderStatusGroup;

export function OrdersListClient({ orders }: { orders: Order[] }) {
  const { t, locale, formatPrice } = useI18n();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab");
  const [tab, setTab] = useState<Tab>(
    initialTab && ["in_transit", "delivered", "cancelled", "processing"].includes(initialTab)
      ? (initialTab as Tab)
      : "all",
  );
  const [search, setSearch] = useState("");
  const dateLocale = locale === "en" ? "en-GB" : locale;

  const counts = useMemo(() => {
    const c = { all: orders.length, in_transit: 0, delivered: 0, cancelled: 0, processing: 0 };
    for (const o of orders) c[orderStatusGroup(o.status)]++;
    return c;
  }, [orders]);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      if (tab !== "all" && orderStatusGroup(o.status) !== tab) return false;
      if (search && !o.orderNumber.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [orders, tab, search]);

  const tabs: { key: Tab; label: string }[] = [
    { key: "all", label: t.account.tabAll(counts.all) },
    { key: "in_transit", label: t.account.tabInTransit(counts.in_transit) },
    { key: "delivered", label: t.account.tabDelivered(counts.delivered) },
    { key: "cancelled", label: t.account.tabCancelled(counts.cancelled) },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-black uppercase tracking-tight text-ink sm:text-3xl">
        {t.account.ordersTitle}
      </h1>
      <p className="mt-1 font-body text-sm text-ink-muted">{t.account.ordersSubtitle}</p>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={t.account.searchOrdersPlaceholder}
        className="mt-6 w-full max-w-sm border border-line-strong bg-paper px-3 py-2.5 font-mono-data text-xs text-ink placeholder:text-ink-muted/60 focus:border-ink focus:outline-none"
      />

      <div className="mt-4 flex gap-2 overflow-x-auto border-b border-line pb-px">
        {tabs.map((tb) => (
          <button
            key={tb.key}
            type="button"
            onClick={() => setTab(tb.key)}
            className={`shrink-0 whitespace-nowrap border-b-2 px-1 pb-3 font-mono-data text-xs tracking-[0.05em] transition ${
              tab === tb.key ? "border-ink text-ink" : "border-transparent text-ink-muted hover:text-ink"
            }`}
          >
            {tb.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="mt-8 py-10 text-center font-mono-data text-xs text-ink-muted">
          {orders.length === 0 ? t.account.nothingOnFile : t.account.noOrdersFound}
        </p>
      ) : (
        <div className="mt-4 divide-y divide-line border border-line">
          {filtered.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.orderNumber}`}
              className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-bg-raised"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate font-mono-data text-xs text-ink">{order.orderNumber}</p>
                <p className="mt-1 truncate font-mono-data text-[11px] text-ink-muted">
                  {new Date(order.createdAt).toLocaleDateString(dateLocale, {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  · {order.status.replace("_", " ").toUpperCase()}
                </p>
              </div>
              <p className="shrink-0 font-mono-data text-sm text-ink">
                {formatPrice(order.totalCents)}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
