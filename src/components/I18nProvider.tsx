"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getDictionary, type Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/locales";
import { LOCALE_COOKIE, CURRENCY_COOKIE } from "@/lib/i18n/cookie-names";
import { formatPrice as formatPriceRaw, type CurrencyCode } from "@/lib/currency";

type I18nContextValue = {
  locale: Locale;
  currency: CurrencyCode;
  t: Dictionary;
  formatPrice: (cents: number) => string;
  setLocale: (locale: Locale) => void;
  setCurrency: (currency: CurrencyCode) => void;
};

const I18nContext = createContext<I18nContextValue | null>(null);

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

function setCookie(name: string, value: string) {
  document.cookie = `${name}=${value}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;
}

export function I18nProvider({
  initialLocale,
  initialCurrency,
  children,
}: {
  initialLocale: Locale;
  initialCurrency: CurrencyCode;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [locale, setLocaleState] = useState(initialLocale);
  const [currency, setCurrencyState] = useState(initialCurrency);

  const setLocale = useCallback(
    (next: Locale) => {
      setLocaleState(next);
      setCookie(LOCALE_COOKIE, next);
      router.refresh();
    },
    [router],
  );

  const setCurrency = useCallback(
    (next: CurrencyCode) => {
      setCurrencyState(next);
      setCookie(CURRENCY_COOKIE, next);
      router.refresh();
    },
    [router],
  );

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      currency,
      t: getDictionary(locale),
      formatPrice: (cents: number) => formatPriceRaw(cents, currency),
      setLocale,
      setCurrency,
    }),
    [locale, currency, setLocale, setCurrency],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
