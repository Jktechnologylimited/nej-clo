# Nej Clothing

Full-stack storefront for an independent streetwear label. Built with Next.js 16 (App Router, Turbopack), Neon Postgres with **raw parameterized SQL — no ORM**, Resend for transactional email, and a small custom session-based auth layer — no third-party auth provider needed.

**Design concept:** everything is styled as a shipping manifest — products are "logged," carts are "manifests," orders are stamped receipts. Dark, guerrilla-drop energy in the hero (nod to Corteiz-style releases); quieter paper-toned ticket cards for browsing (nod to small-batch independent labels like Bolapsd). One consistent motif — perforated edges, batch numbers, monospace data — ties it together instead of a generic dark-theme-plus-accent template.

## Stack

- **Next.js 16** — App Router, Turbopack, async request APIs, `proxy.ts` route protection
- **Neon** (serverless Postgres) via `@neondatabase/serverless` directly — **no ORM**. Queries are plain parameterized SQL (`sql\`SELECT ... WHERE id = ${id}\``), see [Database](#database) below
- **Resend** — welcome email on signup, order confirmation on checkout (both fail silently if no API key is set, so the app runs without it)
- **Paystack** — optional checkout payment, split to a subaccount if configured. Falls back to "log the order, no charge" if no Paystack keys are set — see [Payments](#payments) below
- **Custom auth** — bcrypt password hashing + signed JWT session cookie (`jose`), role-based (`customer` / `admin`), no external auth service
- **Tailwind CSS v4** — design tokens defined in `src/app/globals.css`
- **i18n** — English / French / Spanish, auto-detected from the browser's `Accept-Language` header, switchable in the header/footer, persisted in a cookie
- **Currency** — 7 currencies with approximate GBP-based conversion for display, auto-detected by country (via Vercel's geo header) or browser language, switchable — see [Currency](#currency-notes) below
- **Admin panel** (`/admin`, requires `role="admin"`) — create/edit/delete collections, edit key site copy (hero, manifesto, footer)

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
```

Fill in:

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | [Neon dashboard](https://console.neon.tech) → your project → **Connection Details** → copy the pooled connection string |
| `AUTH_SECRET` | Generate with `openssl rand -base64 32` |
| `RESEND_API_KEY` | [resend.com/api-keys](https://resend.com/api-keys) (optional — emails are skipped with a console warning if unset) |
| `RESEND_FROM_EMAIL` | `onboarding@resend.dev` works until you verify your own domain in Resend |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Optional — used by `db:seed` to create the admin account. Defaults to `admin@nejclothing.test` / `change-this-password` if unset |
| `PAYSTACK_SECRET_KEY` / `PAYSTACK_PUBLIC_KEY` / `PAYSTACK_SUBACCOUNT_CODE` / `PAYSTACK_CURRENCY` | Optional — [dashboard.paystack.com](https://dashboard.paystack.com/#/settings/developer). Checkout falls back to "log the order, no charge" if `PAYSTACK_SECRET_KEY` is unset |

### 3. Apply the database schema

```bash
npm run db:migrate
```

Runs `src/lib/db/schema.sql` against your database (idempotent — safe to re-run any time you edit that file, e.g. after adding a column).

### 4. Seed sample data

```bash
npm run db:seed
```

Adds 9 sample products, 3 sample collections, and ensures an admin user exists (see the `ADMIN_EMAIL`/`ADMIN_PASSWORD` row above — **log in and change that password** if you're deploying this for real).

### 5. Run it

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database

There's no ORM. `src/lib/db/index.ts` exports `sql`, the tagged-template query function from `@neondatabase/serverless` — `${...}` interpolations are auto-parameterized (safe from SQL injection), the same way as any other tagged-template SQL client. Multi-statement operations that need to succeed or fail together (e.g. creating an order and its line items) use `sql.transaction([...])`.

- **`src/lib/db/schema.sql`** — the single source of truth for table structure. Hand-maintained; edit it directly and re-run `npm run db:migrate` when the schema changes. Every statement is `IF NOT EXISTS`, so re-running is always safe.
- **`src/lib/db/types.ts`** — plain TypeScript types mirroring each table's columns (hand-written, since there's no ORM to infer them). Queries alias `snake_case` columns to `camelCase` (`price_cents AS "priceCents"`) so the app code stays consistent.
- **`src/lib/db/migrate.ts`** — applies `schema.sql`, statement by statement.
- **`src/lib/db/seed.ts`** — clears and reseeds products/collections, upserts the admin user.
- **`src/lib/products.ts`, `orders.ts`, `collections.ts`** — the actual queries, organized by feature rather than by table.

If you'd rather use Neon's own SQL editor to poke around the data, that works fine too — there's no drizzle-studio equivalent bundled, since there's no ORM.

## Payments

Checkout works two ways, depending on whether `PAYSTACK_SECRET_KEY` is set in `.env.local`:

- **Not set (default):** the order is logged to Postgres as `status = 'pending'` and a confirmation email goes out immediately. No money moves — this is what you get out of the box, and what you're seeing if checkout completes instantly without a Paystack redirect.
- **Set:** after the order is logged, the customer is redirected to Paystack's hosted checkout (`src/lib/paystack.ts` → `initializeTransaction`). Paystack redirects back to `/api/checkout/paystack/callback`, which **verifies the transaction server-side** (never trusts the redirect alone), checks the paid amount matches the order total, then marks the order `status = 'paid'` and sends the confirmation email. Failed/abandoned payments mark the order `status = 'failed'` and send the customer back to `/checkout` with a banner — nothing is charged.
- **To turn this on:** get your keys from [dashboard.paystack.com](https://dashboard.paystack.com/#/settings/developer) and add `PAYSTACK_SECRET_KEY` (and `PAYSTACK_PUBLIC_KEY`, for completeness) to `.env.local`, then restart `npm run dev`. Use the **test** secret key first — it starts with `sk_test_` — and Paystack's [test cards](https://paystack.com/docs/payments/test-payments/) to run a full checkout before switching to a live key.
- **Subaccount split:** if `PAYSTACK_SUBACCOUNT_CODE` is set, it's passed on every transaction so the payment splits to that subaccount per whatever percentage you've configured on it in the Paystack dashboard (Settings → Subaccounts) — the split ratio isn't set in code.
- **Currency:** `PAYSTACK_CURRENCY` defaults to `NGN`, which is also the app's base currency (see below) — so the amount sent to Paystack is the exact price entered in the admin panel, in kobo, with **no approximation or conversion involved**. If you set `PAYSTACK_CURRENCY` to something else, that amount goes through the same approximate rate table as the currency switcher.
- Written against Paystack's standard, stable REST API and type-checked/built cleanly, but **not exercised against a live Paystack account** from this environment — test thoroughly before going live.

## What's included

- **`/`** — hero with live countdown to the next drop (Fridays 18:00), featured stock, manifesto strip
- **`/shop`** — full product grid, filterable by status (in stock / limited / restocked / sold out)
- **`/collections`**, **`/collections/[slug]`** — curated groups of products
- **`/product/[slug]`** — product detail, size + quantity picker, add to cart
- **`/cart`** — line-item editing, persisted to `localStorage`
- **`/checkout`** — collects shipping details, logs the order, then either confirms immediately or sends the customer to pay via Paystack (see [Payments](#payments))
- **`/checkout/confirmed/[orderNumber]`** — receipt-styled order confirmation, always shown in GBP (the actual recorded charge currency)
- **`/account`**, **`/account/login`**, **`/account/signup`** — signup/login/logout, order history. `/account` is protected by `src/proxy.ts`, which redirects signed-out visitors to login.
- **`/admin`**, **`/admin/products`** (edit price/stock/status/details), **`/admin/collections`** (create/edit/delete), **`/admin/content`** — requires a session with `role = "admin"` (see `ADMIN_EMAIL`/`ADMIN_PASSWORD` above); enforced both in `proxy.ts` and again in each API route. Has its own top nav + logout, shared via `src/app/admin/layout.tsx`.
- A join-the-community email popup, shown once per browser after a short delay (skipped on `/checkout`, `/account`, `/admin`) — dismiss state and submissions are remembered in `localStorage`
- Newsletter signup in the footer, plus a "Powered by NEJ." credit link at the very bottom → `newsletter_subscribers` table

## Currency notes

**NGN (Naira) is the base currency** — every price in the admin panel is entered in Naira, stored in the database as kobo (`price_cents`, despite the name), and is what actually gets charged via Paystack. Other currencies shown while browsing (`src/lib/currency.ts`) are converted from that NGN base using a small **static, approximate** rate table for display only — not a live feed, and last refreshed against real rates in early August 2026. Refresh that table periodically, or swap in a real FX provider (exchangerate.host, Open Exchange Rates, etc.), before relying on it for anything beyond a rough browsing estimate. Order confirmations and account order history always show the true NGN amount that was recorded.

## i18n notes

`src/lib/i18n/dictionaries.ts` covers the site chrome — navigation, headings, buttons, cart/checkout copy. Product names and descriptions come from the database and are **not translated** (that would need a translation-managed catalog, out of scope here). The login and signup forms are also still English-only. Add a language by adding an entry to `locales.ts` and a matching block in `dictionaries.ts`.

## Project structure

```
src/
  app/            routes (App Router)
    admin/        collection management (role="admin" only)
    api/          route handlers: auth, checkout, newsletter, admin/collections
  components/     UI components (Header, ProductCard, CartProvider, I18nProvider, ...)
  lib/
    db/           schema.sql, raw-SQL client, types, migrate script, seed script
    auth/         password hashing + JWT session helpers (session now carries `role`)
    email/        Resend client, HTML email templates, senders
    i18n/         locales, dictionaries, cookie-based locale/currency readers
    currency.ts   currency list, GBP conversion table, formatting
    products.ts, orders.ts, collections.ts, utils.ts, colorway.ts
  proxy.ts        route protection + locale/currency cookie detection (Next.js 16's renamed `middleware.ts`)
```

## Notes on the current build

- **No product photography** — garments are rendered as minimal line-icon illustrations (`GarmentIcon.tsx`) on flat colourway swatches, spec-sheet style. Swap in real photography by replacing the image area in `ProductCard.tsx` / `product/[slug]/page.tsx` once you have shoot assets.
- **Auth is intentionally simple**: bcrypt + signed cookie, no password reset flow, no email verification. Good enough for a real store's MVP; add those before handling a large user base.
- **Paystack integration is untested against a live account** — written against Paystack's stable, documented REST API, type-checked and built cleanly, but there's no way to exercise a real payment from this environment. Test thoroughly with Paystack's test keys/test cards before going live.
- **Admin bootstrapping is seed-only** — there's no UI to promote an existing customer account to admin; re-run `db:seed` with different `ADMIN_EMAIL`/`ADMIN_PASSWORD`, or update a user's `role` column directly in Neon's SQL editor.
- **"Editable from admin" covers a specific set of content**, not literally every string on the site: product/collection data, plus the hero lede, the three manifesto blurbs, and the footer description (`/admin/content`). Navigation, buttons, and other fixed UI text still come from the translated i18n dictionaries — making those admin-editable would mean either editing per-language (a much bigger content-management system) or breaking translation for whichever admin edits them. Login/signup forms are also still English-only.

## Deploying

Works as-is on Vercel: connect the repo, add the same environment variables from `.env.local` in the project's settings, and deploy. Run `npm run db:migrate` (then `npm run db:seed` if it's a fresh database) against your production Neon database before or during your first deploy.
