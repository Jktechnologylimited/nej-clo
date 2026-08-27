import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { getOrdersForUser } from "@/lib/orders";
import { orderStatusGroup } from "@/lib/order-status";
import { isSubscribedToDropAlerts } from "@/lib/newsletter";
import { formatPrice } from "@/lib/currency";
import { getLocale } from "@/lib/i18n/get-locale";
import { getCurrency } from "@/lib/i18n/get-currency";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default async function AccountDashboardPage() {
  const session = await getSession();
  if (!session) return null;
  const [locale, currency] = await Promise.all([getLocale(), getCurrency()]);
  const t = getDictionary(locale);
  const dateLocale = locale === "en" ? "en-GB" : locale;

  const [orders, dropAlertsOn] = await Promise.all([
    getOrdersForUser(session.userId),
    isSubscribedToDropAlerts(session.email),
  ]);

  const inTransitCount = orders.filter((o) => orderStatusGroup(o.status) === "in_transit").length;
  const deliveredCount = orders.filter((o) => orderStatusGroup(o.status) === "delivered").length;
  const recentOrders = orders.slice(0, 4);

  const stats = [
    { label: t.account.statTotalOrders, value: orders.length, link: t.account.viewAllOrders, href: "/account/orders" },
    { label: t.account.statInTransit, value: inTransitCount, link: t.account.trackOrders, href: "/account/orders?tab=in_transit" },
    { label: t.account.statDelivered, value: deliveredCount, link: t.account.viewHistory, href: "/account/orders?tab=delivered" },
    {
      label: t.account.statDropAlerts,
      value: dropAlertsOn ? t.account.dropAlertsOn : t.account.dropAlertsOff,
      link: t.account.manageAlerts,
      href: "/drop-alerts",
    },
  ];

  const quickAccess = [
    { title: t.account.qaAddresses, body: t.account.qaAddressesBody, href: "/account/addresses" },
    { title: t.account.qaDropAlerts, body: t.account.qaDropAlertsBody, href: "/drop-alerts" },
    { title: t.account.qaPaymentMethods, body: t.account.qaPaymentMethodsBody, href: "/account/payment-methods" },
    { title: t.account.qaProfile, body: t.account.qaProfileBody, href: "/account/profile" },
    { title: t.account.qaHelpCenter, body: t.account.qaHelpCenterBody, href: "/help" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-black uppercase tracking-tight text-ink sm:text-3xl">
        {t.account.welcomeBack(session.name)}
      </h1>
      <p className="mt-1 font-body text-sm text-ink-muted">{t.account.dashboardSubtitle}</p>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="border border-line-strong p-4">
            <p className="font-mono-data text-[10px] tracking-[0.1em] text-ink-muted">{stat.label}</p>
            <p className="mt-2 font-display text-2xl font-black text-ink">{stat.value}</p>
            <Link
              href={stat.href}
              className="mt-2 inline-block font-mono-data text-[10px] tracking-[0.05em] text-ink underline underline-offset-2 hover:text-ink-muted"
            >
              {stat.link} →
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <div className="flex items-center justify-between">
          <p className="font-mono-data text-xs tracking-[0.15em] text-ink-muted">
            {t.account.recentOrders}
          </p>
          <Link
            href="/account/orders"
            className="font-mono-data text-[11px] text-ink-muted underline underline-offset-2 hover:text-ink"
          >
            {t.account.viewAllOrders} →
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="mt-4 border border-dashed border-line-strong px-6 py-10 text-center">
            <p className="font-mono-data text-xs text-ink-muted">{t.account.nothingOnFile}</p>
            <Link
              href="/shop"
              className="mt-4 inline-block border border-ink bg-ink px-5 py-2.5 font-mono-data text-xs tracking-[0.15em] text-paper transition hover:bg-amber hover:border-amber hover:text-bg"
            >
              {t.hero.viewStock}
            </Link>
          </div>
        ) : (
          <div className="mt-4 divide-y divide-line border border-line">
            {recentOrders.map((order) => (
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
                  {formatPrice(order.totalCents, currency)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="mt-10">
        <p className="mb-4 font-mono-data text-xs tracking-[0.15em] text-ink-muted">
          {t.account.quickAccess}
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {quickAccess.map((qa) => (
            <Link
              key={qa.title}
              href={qa.href}
              className="border border-line-strong p-4 transition hover:border-ink"
            >
              <p className="font-mono-data text-xs font-bold text-ink">{qa.title}</p>
              <p className="mt-1 font-body text-[11px] leading-relaxed text-ink-muted">{qa.body}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-10 flex flex-col items-start justify-between gap-4 border border-line-strong bg-bg-raised p-6 sm:flex-row sm:items-center">
        <div>
          <p className="font-display text-base font-extrabold uppercase text-ink">
            {t.account.manifestContinuesTitle}
          </p>
          <p className="mt-1 max-w-md font-body text-sm text-ink-muted">
            {t.account.manifestContinuesBody}
          </p>
        </div>
        <Link
          href="/shop"
          className="shrink-0 border border-ink bg-ink px-6 py-3 font-mono-data text-xs tracking-[0.15em] text-paper transition hover:bg-amber hover:border-amber hover:text-bg"
        >
          {t.account.shopNewStock}
        </Link>
      </div>
    </div>
  );
}
