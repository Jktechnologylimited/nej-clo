import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "@/lib/auth/session";
import { LOCALE_COOKIE, CURRENCY_COOKIE } from "@/lib/i18n/cookie-names";
import { pickLocaleFromAcceptLanguage } from "@/lib/i18n/locales";
import { detectCurrencyFromCountry, defaultCurrency, isCurrency } from "@/lib/currency";

// Routes that require a signed-in user. Login/signup stay public so we don't
// lock people out of the account they're trying to reach.
const PROTECTED_PREFIXES = ["/account"];
const PUBLIC_ACCOUNT_ROUTES = ["/account/login", "/account/signup"];
const ADMIN_PREFIX = "/admin";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminRoute = pathname.startsWith(ADMIN_PREFIX);
  const isAccountProtected =
    PROTECTED_PREFIXES.some((p) => pathname.startsWith(p)) &&
    !PUBLIC_ACCOUNT_ROUTES.includes(pathname);

  if (isAdminRoute || isAccountProtected) {
    const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
    const session = token ? await verifySessionToken(token) : null;

    if (!session) {
      const loginUrl = new URL("/account/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }

    if (isAdminRoute && session.role !== "admin") {
      return NextResponse.redirect(new URL("/", request.url));
    }
  }

  const response = NextResponse.next();

  // First-visit locale/currency detection. Once a visitor (or the language
  // switcher) sets these cookies, we never overwrite them again.
  if (!request.cookies.get(LOCALE_COOKIE)) {
    const locale = pickLocaleFromAcceptLanguage(
      request.headers.get("accept-language"),
    );
    response.cookies.set(LOCALE_COOKIE, locale, {
      path: "/",
      maxAge: ONE_YEAR_SECONDS,
      sameSite: "lax",
    });
  }

  if (!request.cookies.get(CURRENCY_COOKIE)) {
    // x-vercel-ip-country is populated automatically when deployed on Vercel;
    // it's absent in local dev, where we fall back to NGN.
    const country = request.headers.get("x-vercel-ip-country");
    const currency = country ? detectCurrencyFromCountry(country) : defaultCurrency;
    response.cookies.set(CURRENCY_COOKIE, currency, {
      path: "/",
      maxAge: ONE_YEAR_SECONDS,
      sameSite: "lax",
    });
  } else {
    const existing = request.cookies.get(CURRENCY_COOKIE)?.value;
    if (!isCurrency(existing)) {
      response.cookies.set(CURRENCY_COOKIE, defaultCurrency, {
        path: "/",
        maxAge: ONE_YEAR_SECONDS,
        sameSite: "lax",
      });
    }
  }

  return response;
}

export const config = {
  // Runs on everything except static assets, so locale/currency cookies get
  // set on the very first request regardless of which page a visitor lands on.
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
