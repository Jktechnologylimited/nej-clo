"use client";

import { useI18n } from "./I18nProvider";
import { locales, localeLabels } from "@/lib/i18n/locales";
import { currencies, currencyLabels } from "@/lib/currency";

const selectClass =
  "border border-line-strong bg-transparent px-2 py-1 font-mono-data text-[11px] tracking-[0.05em] text-ink/70 transition hover:border-ink hover:text-ink focus:border-ink focus:outline-none [&>option]:bg-paper [&>option]:text-ink";

export function LocaleCurrencySwitcher({ className = "" }: { className?: string }) {
  const { locale, currency, setLocale, setCurrency } = useI18n();

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <select
        aria-label="Language"
        value={locale}
        onChange={(e) => setLocale(e.target.value as typeof locale)}
        className={selectClass}
      >
        {locales.map((l) => (
          <option key={l} value={l}>
            {localeLabels[l]}
          </option>
        ))}
      </select>
      <select
        aria-label="Currency"
        value={currency}
        onChange={(e) => setCurrency(e.target.value as typeof currency)}
        className={selectClass}
      >
        {currencies.map((c) => (
          <option key={c} value={c}>
            {currencyLabels[c]}
          </option>
        ))}
      </select>
    </div>
  );
}
