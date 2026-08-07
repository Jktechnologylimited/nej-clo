import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { getOrdersForUser } from "@/lib/orders";
import { formatPrice } from "@/lib/currency";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { LogoutButton } from "@/components/LogoutButton";

// proxy.ts already guards /account, but the session is re-read here since
// proxy only redirects — it can't pass data to the page.
export default async function AccountPage() {
  const [session, locale] = await Promise.all([getSession(), getLocale()]);
  if (!session) return null;
  const t = getDictionary(locale);

  const orders = await getOrdersForUser(session.userId);
  const dateLocale = locale === "en" ? "en-GB" : locale;

  return (
    <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono-data text-[11px] tracking-[0.2em] text-paper/40">
            {t.account.loggedInAs(session.email)}
          </p>
          <h1 className="mt-1 font-display text-3xl font-extrabold uppercase tracking-tight text-paper">
            {session.name}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          {session.role === "admin" && (
            <Link
              href="/admin"
              className="font-mono-data text-xs tracking-[0.1em] text-amber hover:underline"
            >
              {t.account.adminPanel}
            </Link>
          )}
          <LogoutButton />
        </div>
      </div>

      <div className="mt-10">
        <p className="font-mono-data text-[11px] tracking-[0.2em] text-paper/40">
          {t.account.orderHistory}
        </p>

        {orders.length === 0 ? (
          <div className="mt-4 border border-dashed border-line-strong px-6 py-10 text-center">
            <p className="font-mono-data text-xs text-paper/50">
              {t.account.nothingOnFile}
            </p>
            <Link
              href="/shop"
              className="mt-4 inline-block border border-paper px-5 py-2.5 font-mono-data text-xs tracking-[0.15em] text-paper transition hover:bg-amber hover:border-amber hover:text-ink"
            >
              {t.hero.viewStock}
            </Link>
          </div>
        ) : (
          <div className="mt-4 divide-y divide-line border border-line">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/checkout/confirmed/${order.orderNumber}`}
                className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-bg-raised"
              >
                <div className="min-w-0 flex-1">
                  <p className="truncate font-mono-data text-xs tracking-[0.05em] text-paper">
                    {order.orderNumber}
                  </p>
                  <p className="mt-1 truncate font-mono-data text-[11px] text-paper/40">
                    {new Date(order.createdAt).toLocaleDateString(dateLocale, {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                    {" — "}
                    {order.status.toUpperCase()}
                  </p>
                </div>
                <p className="shrink-0 font-mono-data text-sm text-paper">
                  {formatPrice(order.totalCents)}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
