// Flat-rate domestic shipping. All amounts in kobo (NGN minor units), same
// convention as priceCents elsewhere. International rates aren't implemented
// since there's no address-country-based logic yet; every non-Calabar order
// is charged the domestic flat rate (or gets it waived over the free-shipping
// threshold, same as always).
export const SHIPPING_FLAT_CENTS = 600_000; // ₦6,000
export const FREE_SHIPPING_THRESHOLD_CENTS = 10_000_000; // ₦100,000

// Free shipping for Calabar residents regardless of order size. Matched
// case-insensitively against the city field entered at checkout — there's no
// separate "region" field, so this is only as reliable as what the customer
// typed (e.g. "calabar", "Calabar, Cross River" both match; a misspelling
// wouldn't). Good enough for a flat local-delivery promo; revisit with a
// proper address/postcode lookup if this needs to be airtight.
const FREE_SHIPPING_CITIES = ["calabar"];

function isFreeShippingCity(city: string | undefined | null): boolean {
  if (!city) return false;
  const normalized = city.toLowerCase().trim();
  return FREE_SHIPPING_CITIES.some((c) => normalized.includes(c));
}

export function calculateShippingCents(subtotalCents: number, city?: string | null): number {
  if (isFreeShippingCity(city)) return 0;
  return subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_FLAT_CENTS;
}
