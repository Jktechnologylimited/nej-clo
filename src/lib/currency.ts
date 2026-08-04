export const currencies = ["GBP", "USD", "EUR", "JPY", "CAD", "AUD", "NGN"] as const;
export type CurrencyCode = (typeof currencies)[number];
export const defaultCurrency: CurrencyCode = "GBP";

export const currencyLabels: Record<CurrencyCode, string> = {
  GBP: "£ GBP",
  USD: "$ USD",
  EUR: "€ EUR",
  JPY: "¥ JPY",
  CAD: "$ CAD",
  AUD: "$ AUD",
  NGN: "₦ NGN",
};

/**
 * Approximate rates relative to GBP (1 GBP = X currency), for DISPLAY ONLY.
 * All prices are stored and actually charged in GBP — there's no payment
 * processor wired up yet, and no live FX feed behind this. Swap in a real
 * provider (exchangerate.host, Open Exchange Rates, etc.) and refresh these
 * periodically before treating them as anything more than a rough estimate.
 */
const APPROX_RATES: Record<CurrencyCode, number> = {
  GBP: 1,
  USD: 1.27,
  EUR: 1.17,
  JPY: 191,
  CAD: 1.74,
  AUD: 1.93,
  NGN: 1980,
};

// Representative locale used purely for number-formatting conventions
// (symbol position, decimal/thousands separators) — independent of site UI language.
const FORMAT_LOCALE: Record<CurrencyCode, string> = {
  GBP: "en-GB",
  USD: "en-US",
  EUR: "de-DE",
  JPY: "ja-JP",
  CAD: "en-CA",
  AUD: "en-AU",
  NGN: "en-NG",
};

export function isCurrency(value: string | undefined | null): value is CurrencyCode {
  return !!value && (currencies as readonly string[]).includes(value);
}

/** Converts a GBP integer-cents amount into the target currency's integer minor units. */
function convertFromGbpCents(cents: number, currency: CurrencyCode): number {
  if (currency === "GBP") return cents;
  return Math.round(cents * APPROX_RATES[currency]);
}

export function formatPrice(
  cents: number,
  currency: CurrencyCode = defaultCurrency,
): string {
  const converted = convertFromGbpCents(cents, currency);
  return new Intl.NumberFormat(FORMAT_LOCALE[currency], {
    style: "currency",
    currency,
  }).format(converted / 100);
}

// Rough ISO-country -> currency mapping for auto-detection. Not exhaustive —
// unmapped countries fall back to GBP. Visitors can always override manually.
const COUNTRY_CURRENCY: Record<string, CurrencyCode> = {
  GB: "GBP", IE: "EUR",
  US: "USD",
  CA: "CAD",
  AU: "AUD", NZ: "AUD",
  NG: "NGN",
  JP: "JPY",
  FR: "EUR", DE: "EUR", ES: "EUR", IT: "EUR", NL: "EUR", PT: "EUR",
  BE: "EUR", AT: "EUR",
};

export function detectCurrencyFromCountry(countryCode: string | null): CurrencyCode {
  if (!countryCode) return defaultCurrency;
  return COUNTRY_CURRENCY[countryCode.toUpperCase()] ?? defaultCurrency;
}
