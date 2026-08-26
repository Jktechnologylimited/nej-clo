import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { LogoutButton } from "@/components/LogoutButton";

export default async function AccountDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [session, locale] = await Promise.all([getSession(), getLocale()]);
  // proxy.ts already redirects signed-out visitors before this renders, but
  // guard here too since layouts can be reached in edge cases proxy can miss.
  if (!session) redirect("/account/login");
  const t = getDictionary(locale);

  const navItems = [
    { href: "/account", label: t.account.navDashboard },
    { href: "/account/orders", label: t.account.navOrders },
    { href: "/account/addresses", label: t.account.navAddresses },
    { href: "/drop-alerts", label: t.account.navDropAlerts },
    { href: "/account/payment-methods", label: t.account.navPaymentMethods },
    { href: "/account/profile", label: t.account.navProfile },
    { href: "/account/security", label: t.account.navSecurity },
    { href: "/help", label: t.account.navHelpCenter },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="flex flex-col items-start gap-4 border-b border-line pb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-bg-raised font-display text-sm font-bold text-ink">
            {session.name.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <p className="font-display text-sm font-bold uppercase text-ink">{session.name}</p>
            <p className="font-mono-data text-[11px] text-ink-muted">{session.email}</p>
          </div>
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

      <div className="mt-8 grid gap-8 lg:grid-cols-[200px_1fr]">
        <nav className="flex gap-2 overflow-x-auto pb-2 font-mono-data text-xs tracking-[0.05em] text-ink-muted lg:flex-col lg:overflow-visible lg:pb-0">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="whitespace-nowrap border border-line-strong px-3 py-2 transition hover:border-ink hover:text-ink lg:border-0 lg:px-0 lg:py-1.5"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
