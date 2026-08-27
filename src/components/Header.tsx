import Link from "next/link";
import { Ticker } from "./Ticker";
import { CartIndicator } from "./CartIndicator";
import { LocaleCurrencySwitcher } from "./LocaleCurrencySwitcher";
import { MobileMenu } from "./MobileMenu";
import { getSession } from "@/lib/auth/session";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export async function Header() {
  const [session, locale] = await Promise.all([getSession(), getLocale()]);
  const t = getDictionary(locale);

  const navItems = [
    { href: "/shop", label: t.nav.shopAll },
    { href: "/collections", label: t.nav.collections },
    { href: "/about", label: t.nav.about },
    { href: "/drop-alerts", label: t.nav.dropAlerts },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/95 backdrop-blur">
      <Ticker />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <div className="flex items-center gap-3">
          <MobileMenu
            navItems={navItems}
            accountLabel={session ? t.nav.account : t.nav.login}
            accountHref={session ? "/account" : "/account/login"}
          />
          <Link href="/" className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element -- small static brand asset, next/image config not worth it here */}
            <img src="/logo.png" alt="NEJ" className="h-6 w-auto sm:h-7" />
          </Link>
        </div>

        <nav className="hidden items-center gap-7 font-mono-data text-xs tracking-[0.15em] text-ink/70 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-ink">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <LocaleCurrencySwitcher className="hidden sm:flex" />

          <Link
            href="/search"
            aria-label="Search"
            className="text-ink/70 transition hover:text-ink"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="8" cy="8" r="6" />
              <path d="M16.5 16.5 12.5 12.5" strokeLinecap="round" />
            </svg>
          </Link>

          <Link
            href={session ? "/account" : "/account/login"}
            aria-label="Account"
            className="hidden text-ink/70 transition hover:text-ink sm:block"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="9" cy="6" r="3.2" />
              <path d="M2.5 16c1-3.5 4-5 6.5-5s5.5 1.5 6.5 5" strokeLinecap="round" />
            </svg>
          </Link>
          <Link
            href={session ? "/account" : "/account/login"}
            className="font-mono-data text-xs tracking-[0.1em] text-ink/80 transition hover:text-ink sm:hidden"
          >
            {session ? t.nav.account : t.nav.login}
          </Link>

          <CartIndicator />
        </div>
      </div>
      <div className="border-t border-line px-5 py-2 sm:hidden">
        <LocaleCurrencySwitcher />
      </div>
    </header>
  );
}
