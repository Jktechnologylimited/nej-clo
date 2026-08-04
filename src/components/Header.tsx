import Link from "next/link";
import { Ticker } from "./Ticker";
import { CartIndicator } from "./CartIndicator";
import { LocaleCurrencySwitcher } from "./LocaleCurrencySwitcher";
import { getSession } from "@/lib/auth/session";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export async function Header() {
  const [session, locale] = await Promise.all([getSession(), getLocale()]);
  const t = getDictionary(locale);

  return (
    <header className="sticky top-0 z-40 bg-bg/95 backdrop-blur">
      <Ticker />
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link
          href="/"
          className="font-display text-2xl font-black tracking-tight text-paper"
        >
          NEJ<span className="text-amber">.</span>
        </Link>

        <nav className="hidden items-center gap-7 font-mono-data text-xs tracking-[0.15em] text-paper/70 lg:flex">
          <Link href="/shop" className="transition hover:text-amber">
            {t.nav.shopAll}
          </Link>
          <Link href="/collections" className="transition hover:text-amber">
            {t.nav.collections}
          </Link>
          <Link href="/shop?status=limited" className="transition hover:text-amber">
            {t.nav.liveDrop}
          </Link>
          <Link
            href={session ? "/account" : "/account/login"}
            className="transition hover:text-amber"
          >
            {session ? `${t.nav.account} — ${session.name.split(" ")[0].toUpperCase()}` : t.nav.login}
          </Link>
        </nav>

        <div className="flex items-center gap-4">
          <LocaleCurrencySwitcher className="hidden sm:flex" />
          <Link
            href={session ? "/account" : "/account/login"}
            className="font-mono-data text-xs tracking-[0.1em] text-paper/80 transition hover:text-amber lg:hidden"
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
