import { cookies } from "next/headers";
import { defaultLocale, isLocale, type Locale } from "./locales";
import { LOCALE_COOKIE } from "./cookie-names";

export { LOCALE_COOKIE };

/** Reads the visitor's locale from their cookie (set by proxy.ts on first visit). */
export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : defaultLocale;
}
