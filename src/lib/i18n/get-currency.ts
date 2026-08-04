import { cookies } from "next/headers";
import { defaultCurrency, isCurrency, type CurrencyCode } from "@/lib/currency";
import { CURRENCY_COOKIE } from "./cookie-names";

export { CURRENCY_COOKIE };

/** Reads the visitor's currency from their cookie (set by proxy.ts on first visit). */
export async function getCurrency(): Promise<CurrencyCode> {
  const cookieStore = await cookies();
  const value = cookieStore.get(CURRENCY_COOKIE)?.value;
  return isCurrency(value) ? value : defaultCurrency;
}
