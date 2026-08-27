# Nej Clothing

Full-stack storefront for an independent streetwear label. Built with Next.js 16 (App Router, Turbopack), Neon Postgres with **raw parameterized SQL — no ORM**, Resend for transactional email, and a small custom session-based auth layer — no third-party auth provider needed.

**Design concept:** black theme throughout, matching the brand's actual logo (white "N Ξ J" wordmark on black — see `public/logo.png` and the favicon). Went through a full light/cream phase while building against a 15-batch wireframe set, then reverted back to dark to match the real brand identity once that logo existed. The "manifest" terminology (cart = manifest, "ADD TO MANIFEST", etc.) carries through regardless of palette — see `## Notable additions` → *Black theme reversion* below for what that reversion actually involved.

**Redesign status:** All 13 provided wireframe batches are built (Batches 1–5, 7–15 — Batch 6 was never provided, so it's skipped by necessity). Checkout and the admin panel were never part of the wireframe set at all, so there's no reference to build them against — both got the same theme treatment as everything else so they're visually consistent, just not restructured to a specific spec, because none exists. `/legal/privacy` and `/legal/terms` remain generic placeholders since they weren't part of any batch either — see the note in that section.

**Notable additions across redesign rounds:**

*Batches 4, 5, 7 (Product Detail, Cart, Order Confirmation):*
- Products now support a **photo gallery** (up to 6 images, `image_urls` array) instead of a single photo — the product page has a real thumbnail rail. Collections still take a single cover image.
- **Flat-rate shipping** (`src/lib/shipping.ts`): ₦2,500 domestic, free over ₦100,000 subtotal. Applied in the cart estimate, the actual Paystack charge, and the order confirmation breakdown.
- Cart items can now have their **size changed inline** via a dropdown (`CartProvider.setSize`), not just quantity.
- Color swatches on the product page link between colorway "siblings" — products sharing the same name, matching how the seed data already models one garment in multiple colors.
- Promo code field exists in the UI (matching the wireframe) but isn't wired to a real discount system yet — it shows a clear "coming soon" message on submit rather than silently doing nothing.
- No reviews/ratings and no wishlist/save-for-later — both would need real backend systems and data that doesn't exist yet, so rather than fake star ratings or a non-functional bookmark icon, both are simply omitted from this pass.

*Batches 8, 9, 10 (Account Dashboard, Orders, Order Tracking):*
- **Real fulfillment tracking**, not a static explainer — `src/lib/order-status.ts` defines the full status vocabulary (`pending → paid → processing → dispatched → in_transit → out_for_delivery → delivered`, plus `failed`/`cancelled`). Orders also carry `carrier` and `tracking_number`, both admin-settable.
- **New admin section**: `/admin/orders` — previously there was no way to view or manage orders from the admin panel at all. Lets you update an order's status/carrier/tracking number, which is what actually drives the account-side tracking page and dashboard stats.
- **Account section restructured** with a shared sidebar (`/account` route group) and real pages: dashboard with live stats, a searchable/filterable order list, per-order detail with a working "Reorder" button, and a tracking page with a real (not fake) progress timeline.
- Explicitly **not simulated**: the tracking page has no live map or GPS position, since there's no real carrier API integration behind it — showing one would mean fabricating a location. The timeline itself is real, driven by whatever status admin has set.
- Addresses, Payment Methods, and Security are still placeholder pages under `/account` — each would need its own real backend (saved-address CRUD, Paystack card tokenization, password-change flow) that's out of scope for a wireframe-fidelity pass. **Profile is no longer a placeholder** — `/account/profile` lets a customer update their name and email for real, with uniqueness checking and an immediate session refresh (see below).

*Batches 11, 12, 13 (Drop Alerts, Collections, Search):*
- **Real restock notifications**, not a mockup — sold-out product pages have a working "notify me when back in stock" form (`product_alerts` table). When admin flips a product's status off `sold_out`, everyone who signed up gets an actual email via Resend, and the list clears. Explicitly **not built**: SMS/push notification channels (no SMS provider configured) and the in-app notification bell/center (would need its own notifications data model generating records on order updates and restocks) — the wireframe's mockups for those would've been pure decoration without real infrastructure behind them, so they're left out rather than faked.
- **Collections got a `badge` field** (admin-settable free text — "NEW DROP", "LIMITED", "RESTOCK", etc.), shown as a pill on the collection card and cover banner. The wireframe's Category/Type/Season filter dropdowns aren't built since there's no real taxonomy data behind them yet.
- **Search is real**, not a stub — matches products (name, description, SKU, colorway, category) and collections (name, description) live as you type, no debounce needed at this catalog size. Recent searches persist via `localStorage`. "Popular searches" from the wireframe isn't built — there's no real analytics behind it, and faking popularity data felt worse than leaving it out.

*Batches 14, 15 (About, Help & Info) — the last two:*
- **About page** (`/about`) — hero, the 5-value Manifest section, brand story, and a 4-point "what makes NEJ different" grid, all real written copy. **Deliberately left out the wireframe's "Featured In" press-logo section** (Hypebeast, GQ, etc.) — this site has no actual press coverage, and displaying real publication names would be a false claim about the business. Add that section back once there's real coverage to show.
- **Help & Info page** (`/help?tab=size-guide|shipping|returns|care`) — real tabbed content, not a mockup. The size chart has actual measurements (tops: XS–XXL, bottoms: 28–36 waist). Shipping figures are pulled live from `src/lib/shipping.ts`'s real constants rather than a separately hardcoded number, so this page can't drift out of sync with what checkout actually charges — and it only describes domestic Nigeria shipping, since that's the only rate that's actually implemented (the wireframe's international rates aren't wired into checkout, so claiming them here would've been misleading).
- ⚠️ **`SUPPORT_EMAIL` in `HelpClient.tsx` is a placeholder** (`support@nejclothing.com`) — replace it with your real inbox before customers rely on it. It's used for the "Email Support" button and the returns process copy.
- ⚠️ **Returns/shipping policy text is generic, reasonable e-commerce language, not a legal document** — have it reviewed before treating it as your actual binding policy, same caveat as the `/legal/privacy` and `/legal/terms` placeholders.

*Bug fixes along the way:*
- Twice now, a client component ended up receiving the *entire* translation dictionary as a prop from a server component (`SiteContentForm`, then `OrdersListClient` and `ShopClient`) — React can't serialize the dictionary's function-valued entries (like `checkout.confirm(price)`) across that boundary, so the page crashed. Fixed all three the same way: read translations via `useI18n()` client-side instead of passing them down, which is how every other client component in the app already does it. Swept the whole codebase afterward and found no more instances.
- The mobile hamburger menu could render behind other page content. Root cause: the header's `position: sticky` + `z-40` creates its own CSS stacking context, which traps any nested element's z-index — a `z-50` child still can't out-rank content elsewhere on the page. Fixed by portaling the menu's overlay straight into `document.body`.
- `migrate.ts` split SQL statements on raw `;` characters without knowing comments exist, so a semicolon used as ordinary punctuation inside a `--` comment ("...above; existing images...") silently corrupted a statement — and, worse, swallowed a real `ALTER TABLE` inside the broken chunk, so a column never actually got created. Fixed by stripping comments before splitting.

## Black theme reversion, logo, shipping changes

- **Theme flip back to dark.** Not a simple variable swap — `ink` (primary text) and `paper` (card surface) effectively traded places (ink is now light, paper is now dark), which propagated correctly through almost the entire site automatically since components already referenced these semantic tokens rather than literal colors. The one thing that *didn't* just work: the `amber` accent, used both as text-on-dark-page (needs to be light-ish) and as a button/badge background with text on top (needs the text to be dark for contrast). I checked this with actual WCAG contrast math rather than eyeballing it — light "ink" text on the accent color came out to 2.27:1 (fails badly; 4.5:1 is the minimum), while dark text on that same accent came out to 7.44:1. Fixed by auditing and updating every `bg-amber` pairing across ~25 files to use dark text specifically in that context, confirmed with a final sweep that nothing was missed.
- **Logo and favicon**, generated from the uploaded logo image: a transparent-background version of the full "N Ξ J" wordmark (now used in the header, footer, and mobile menu, replacing the old text logo), and a tighter crop of just the "Ξ" mark for the favicon — the full wordmark is too wide/thin to read at 16–32px. Caught a real bug here during verification: the first generated `favicon.ico` wasn't encoded in a format Next.js's image pipeline accepts ("The PNG is not in RGBA format"), which broke the production build outright. Fixed by re-encoding every embedded frame as explicit RGBA before rebuilding — confirmed the fix with a clean build.
- **Homepage hero reverted** to the original design (dual "NEJ / CLOTHING" headline, "VIEW STOCK" / "LIVE DROP ONLY" buttons) with a **live countdown timer** to the next drop, replacing the wireframe-era hero that had a static "STOCK_LOG_XXX" headline and decorative (non-functional) carousel dots. The rest of the wireframe-driven pages/IA (Shop, Collections, Search, Account, etc.) are untouched — this was scoped to the hero only.
- **Shipping rate is now ₦6,000** (was ₦2,500), and **Calabar residents get free shipping regardless of order size** — matched case-insensitively against the city entered at checkout (`src/lib/shipping.ts`). This is wired into the actual Paystack charge, the live estimate on the checkout page (updates as you type your city), and the Help page's policy text (which pulls the real constants, so it can't drift out of sync with what's actually charged).
- **Product cards now slide to a second photo on hover** — front image slides out, second uploaded photo slides in, intended for a "back of garment" shot. Only activates when a product has 2+ photos; falls back to the existing single-image treatment otherwise. The admin product photo uploader has a hint explaining the first-two-photos convention.

**Not done / needs your input:** two items from the same request were genuinely ambiguous and I didn't want to guess wrong and build the wrong thing —
- **"subs"** — no idea what this referred to. Possible reads: subscriber management (already exists, `/admin/subscribers`), Paystack subaccounts (already implemented, `PAYSTACK_SUBACCOUNT_CODE`), or actual subscription/recurring billing (a real feature that doesn't exist and would be a substantial build). Tell me which and I'll act on it.
- **"payment gateway"** — Paystack is fully built from earlier work; I didn't change anything here since nothing specific was flagged as broken. Let me know if something's actually not working.

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

## Order notifications

When an order comes in, **two** emails go out (both via Resend, both best-effort — a failed email never fails the order): one to the customer, and one to the store owner. The owner email goes to `ORDER_NOTIFICATION_EMAIL` if set, otherwise `ADMIN_EMAIL` — either way, **make sure that's an inbox someone actually checks**, since it defaults to the same placeholder-ish address used for the admin login. It includes the order number, items, total, shipping address, and a direct link to that order in `/admin/orders`.

Timing matches the customer email exactly: if Paystack isn't configured, both go out the moment the order is logged; if it is, both wait until `/api/checkout/paystack/callback` verifies the payment, so the owner is never notified about an order that was never actually paid for.

## Admin-editable content

Beyond products, collections, and orders, `/admin/content` covers: the homepage hero lede, the three manifesto blurbs, the footer description, the 4-item trust strip (shown on Home, Product, and Cart), the About page's intro and story paragraphs, and the support email shown on the Help page (and used in the returns instructions). Leaving a field blank falls back to built-in default copy. This doesn't cover *everything* on the site — navigation labels, buttons, and other fixed UI chrome still come from the translated dictionaries (`src/lib/i18n/dictionaries.ts`), and structural content like the size chart or care instructions is still hardcoded — but it covers what a store owner is most likely to actually want to change without touching code.

One tradeoff worth knowing: these fields (including the trust strip, hero, and manifesto) are normally translated per-language via the dictionaries. An admin override replaces the text for **every language** with whatever was typed in — there's no separate override per locale. Fine for a single-language override; if you need the override itself translated, that'd need a bigger content-management rework than this key-value system.

## Admin visibility

- **`/admin/customers`** — every registered account, join date, and how many orders they've placed.
- **`/admin/subscribers`** — everyone signed up for drop alerts / the newsletter, with active/unsubscribed status.
- **`/admin/orders`** — now tags each order **ACCOUNT** or **GUEST** so you can tell which came from a registered customer.

## Product colors

Product cards, the gallery, and colorway-swatch selectors used to *guess* a hex color from the colorway's **name** via a small hardcoded table (`"Bitumen Black" → #17140f`, five entries total) — any colorway outside those five names silently fell back to generic grey, which didn't match the real garment. Fixed: products now have a real `swatch_hex` column, set via an actual color picker in `/admin/products/[id]/edit`. Existing rows saved before this fell back to the old name-based guess until re-saved with a real color (`effectiveSwatch()` in `src/lib/colorway.ts` handles the fallback).
## Mobile responsiveness

Audited and fixed sitewide, not just spot-checked. The one serious bug: the header's nav (Shop All / Collections / About / Drop Alerts) was `hidden lg:flex` with **no mobile fallback at all** — anyone on a phone had no way to reach those from the header. Fixed with a proper slide-in hamburger menu (`MobileMenu.tsx`), scroll-locked while open, closes on Escape or backdrop tap.

Other fixes from this pass:
- **Product gallery** — the vertical thumbnail rail next to the main image, fine on tablet/desktop, was cramming the photo down to an unusably narrow strip on phones. Mobile now gets a full-width image with swipe arrows and a "2/5" counter badge instead, matching the wireframe's actual mobile pattern rather than just shrinking the desktop layout.
- **Cart line items** — was relying on an implicit 2-column grid auto-flow for the mobile layout, which left the remove button stranded alone in its own row. Replaced with an explicit stacked card layout on mobile (name/remove on top, size/qty/price below) and kept the table-style grid for `sm:` and up.
- **Hero headline** — `STOCK_LOG_XXX` is one unbroken string (underscores, no spaces), which meant it couldn't wrap at a word boundary and risked overflowing the viewport on the smallest phones. Reduced the base font size and added `break-words` as a safety net.
- Two admin list rows (collections, and the pattern already present in products/orders) had the same "long text pushes action buttons off-screen" bug the price-overflow fix addressed earlier — same fix applied: `min-w-0`/`truncate` on the text column, `shrink-0` on the actions.
- Shop's mobile filter panel now renders in a proper bordered/padded container when toggled open instead of appearing as bare unstyled content.

Swept for the other usual culprits (fixed pixel widths, 3+ column grids with no mobile override, raw `<table>` elements, `whitespace-nowrap` without a scroll container) and didn't find further issues — everything else already had a working responsive pattern.

## What's included

- **`/`** — hero with live countdown to the next drop (Fridays 18:00), featured stock, manifesto strip
- **`/shop`** — full product grid, filterable by status (in stock / limited / restocked / sold out)
- **`/collections`**, **`/collections/[slug]`** — curated groups of products
- **`/product/[slug]`** — product detail, size + quantity picker, add to cart
- **`/cart`** — line-item editing, persisted to `localStorage`
- **`/checkout`** — collects shipping details, logs the order, then either confirms immediately or sends the customer to pay via Paystack (see [Payments](#payments))
- **`/checkout/confirmed/[orderNumber]`** — receipt-styled order confirmation, always shown in GBP (the actual recorded charge currency)
- **`/account`**, **`/account/login`**, **`/account/signup`** — signup/login/logout, order history. `/account` is protected by `src/proxy.ts`, which redirects signed-out visitors to login.
- **`/admin`**, **`/admin/products`** (edit price/stock/status/photo/details), **`/admin/collections`** (create/edit/delete, cover photo), **`/admin/content`** — requires a session with `role = "admin"` (see `ADMIN_EMAIL`/`ADMIN_PASSWORD` above); enforced both in `proxy.ts` and again in each API route. Has its own top nav + logout, shared via `src/app/admin/layout.tsx`.
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

- **Product/collection photos are optional** — upload one from `/admin/products/[id]/edit` or the collection forms; without one, products fall back to the minimal line-icon illustrations (`GarmentIcon.tsx`) on flat colourway swatches, and collections just show text. Images are downscaled to max 1200px and compressed to JPEG client-side (`ImageUploadField.tsx`), then stored as a `data:` URL directly in Postgres — no external storage account needed, at the cost of larger row sizes. If the catalog grows a lot, swap this for Vercel Blob/S3/Cloudinary and store a real URL in the same `image_url` column instead.
- **Auth is intentionally simple**: bcrypt + signed cookie, no password reset flow, no email verification. Good enough for a real store's MVP; add those before handling a large user base.
- **Paystack integration is untested against a live account** — written against Paystack's stable, documented REST API, type-checked and built cleanly, but there's no way to exercise a real payment from this environment. Test thoroughly with Paystack's test keys/test cards before going live.
- **Admin bootstrapping is seed-only** — there's no UI to promote an existing customer account to admin; re-run `db:seed` with different `ADMIN_EMAIL`/`ADMIN_PASSWORD`, or update a user's `role` column directly in Neon's SQL editor.
- **"Editable from admin" covers a specific set of content**, not literally every string on the site: product/collection data, plus the hero lede, the three manifesto blurbs, and the footer description (`/admin/content`). Navigation, buttons, and other fixed UI text still come from the translated i18n dictionaries — making those admin-editable would mean either editing per-language (a much bigger content-management system) or breaking translation for whichever admin edits them. Login/signup forms are also still English-only.

## Deploying

Works as-is on Vercel: connect the repo, add the same environment variables from `.env.local` in the project's settings, and deploy. Run `npm run db:migrate` (then `npm run db:seed` if it's a fresh database) against your production Neon database before or during your first deploy.
