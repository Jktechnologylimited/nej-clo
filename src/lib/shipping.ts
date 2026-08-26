// Flat-rate domestic shipping. All amounts in kobo (NGN minor units), same
// convention as priceCents elsewhere. These match the rates shown in the
// Batch 15 (Size Guide / Shipping / Returns / Care) wireframe — international
// rates from that same wireframe aren't implemented here since there's no
// address-country-based logic yet; every order is charged the domestic rate.
export const SHIPPING_FLAT_CENTS = 250_000; // ₦2,500
export const FREE_SHIPPING_THRESHOLD_CENTS = 10_000_000; // ₦100,000

export function calculateShippingCents(subtotalCents: number): number {
  return subtotalCents >= FREE_SHIPPING_THRESHOLD_CENTS ? 0 : SHIPPING_FLAT_CENTS;
}
