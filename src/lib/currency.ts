export const currencies = ["NGN", "GBP", "USD", "EUR", "JPY", "CAD", "AUD"] as const;
export type CurrencyCode = (typeof currencies)[number];

// NGN is the true base currency: prices are entered by the admin in Naira,
// stored in kobo, and (when Paystack is configured) actually charged in NGN.
// Every other currency here is a display-only estimate for browsing.
export const defaultCurrency: CurrencyCode = "NGN";

export const currencyLabels: Record<CurrencyCode, string> = {
  NGN: "₦ NGN",
  GBP: "£ GBP",
  USD: "$ USD",
  EUR: "€ EUR",
  JPY: "¥ JPY",
  CAD: "$ CAD",
  AUD: "$ AUD",
};

/**
 * Approximate rates relative to NGN (1 NGN = X currency), for DISPLAY ONLY.
 * Based on real mid-market rates as of early August 2026 (~₦1,839.5/£1,
 * ~₦1,364/$1, ~₦1,568/€1, ~₦0.1155/¥1, ~₦957/A$1) — but they're a static
 * snapshot, not a live feed. Prices are stored and (when Paystack is
 * configured) actually charged in NGN; every other currency shown while
 * browsing is converted through this table for convenience only. Refresh
 * periodically, or swap in a real FX provider (exchangerate.host, Open
 * Exchange Rates, etc.) before treating this as anything more than a rough
 * estimate.
 */
const APPROX_RATES: Record<CurrencyCode, number> = {
  NGN: 1,
  GBP: 0.000544,
  USD: 0.000733,
  EUR: 0.000638,
  JPY: 0.1154,
  CAD: 0.001004,
  AUD: 0.001045,
};

// Representative locale used purely for number-formatting conventions
// (symbol position, decimal/thousands separators) — independent of site UI language.
const FORMAT_LOCALE: Record<CurrencyCode, string> = {
  NGN: "en-NG",
  GBP: "en-GB",
  USD: "en-US",
  EUR: "de-DE",
  JPY: "ja-JP",
  CAD: "en-CA",
  AUD: "en-AU",
};

export function isCurrency(value: string | undefined | null): value is CurrencyCode {
  return !!value && (currencies as readonly string[]).includes(value);
}

/** Converts a NGN integer-kobo amount into the target currency's integer minor units. */
export function convertFromBaseCents(cents: number, currency: CurrencyCode): number {
  if (currency === defaultCurrency) return cents;
  return Math.round(cents * APPROX_RATES[currency]);
}

export function formatPrice(
  cents: number,
  currency: CurrencyCode = defaultCurrency,
): string {
  const converted = convertFromBaseCents(cents, currency);
  return new Intl.NumberFormat(FORMAT_LOCALE[currency], {
    style: "currency",
    currency,
  }).format(converted / 100);
}

// Rough ISO-country -> currency mapping for auto-detection. Not exhaustive —
// unmapped countries fall back to NGN. Visitors can always override manually.
const COUNTRY_CURRENCY: Record<string, CurrencyCode> = {
  NG: "NGN",
  GB: "GBP", IE: "EUR",
  US: "USD",
  CA: "CAD",
  AU: "AUD", NZ: "AUD",
  JP: "JPY",
  FR: "EUR", DE: "EUR", ES: "EUR", IT: "EUR", NL: "EUR", PT: "EUR",
  BE: "EUR", AT: "EUR",
};

export function detectCurrencyFromCountry(countryCode: string | null): CurrencyCode {
  if (!countryCode) return defaultCurrency;
  return COUNTRY_CURRENCY[countryCode.toUpperCase()] ?? defaultCurrency;
}
