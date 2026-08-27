-- Nej Clothing — database schema.
-- Applied by `npm run db:migrate` (see src/lib/db/migrate.ts). Hand-maintained
-- since there's no ORM/migration-generator in this project — edit this file
-- directly when the schema needs to change, then re-run db:migrate.

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'customer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Retrofits the role column onto a users table created before role existed.
-- No-op (column already exists) on a fresh database created from this file.
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'customer';

CREATE UNIQUE INDEX IF NOT EXISTS users_email_idx ON users (email);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  colorway TEXT NOT NULL,
  sku TEXT NOT NULL,
  drop_code TEXT NOT NULL,
  price_cents INTEGER NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'available',
  sizes TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS products_slug_idx ON products (slug);

-- Product photo, stored as a data: URL (base64-encoded, downscaled/compressed
-- client-side before upload — see ImageUploadField.tsx). Simple and needs no
-- external storage account, at the cost of bloating row size for a large
-- catalog. Swap for Vercel Blob/S3/Cloudinary and store a real URL here
-- instead if the catalog grows significantly.
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Product gallery — multiple photos per product (Batch 4 wireframe shows a
-- thumbnail rail + main image). Superseding the single image_url column
-- above; existing single images are migrated in, image_url itself is left
-- in place but unused going forward rather than dropped, to stay reversible.
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_urls TEXT[] NOT NULL DEFAULT '{}';

-- The actual swatch color for this product's colorway, set by admin via a
-- color picker. Previously this was guessed from the colorway NAME via a
-- small hardcoded lookup table — any colorway outside that original 5-name
-- list silently fell back to generic grey, which didn't match the real
-- product. Nullable so existing rows fall back to that legacy name-based
-- guess (see swatchFor() in lib/colorway.ts) until re-saved with a real color.
ALTER TABLE products ADD COLUMN IF NOT EXISTS swatch_hex TEXT;
UPDATE products
SET image_urls = ARRAY[image_url]
WHERE image_url IS NOT NULL AND (image_urls IS NULL OR array_length(image_urls, 1) IS NULL);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT NOT NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  total_cents INTEGER NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS orders_order_number_idx ON orders (order_number);

-- Stores the Paystack transaction reference once payment is initiated, and
-- lets order status move pending -> paid / failed. Same retrofit pattern as
-- the users.role column above.
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_reference TEXT;

-- Set by admin when dispatching an order (no live carrier API integration —
-- see src/app/admin/orders). Powers the customer-facing tracking page.
ALTER TABLE orders ADD COLUMN IF NOT EXISTS carrier TEXT;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS tracking_number TEXT;

CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  size TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  unit_price_cents INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  subscribed BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS newsletter_email_idx ON newsletter_subscribers (email);

-- "Notify me when back in stock" signups. One row per (product, email); a
-- signup is cleared once the notification email is sent — a customer who
-- wants alerts for a future restock of the same item signs up again.
CREATE TABLE IF NOT EXISTS product_alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS product_alerts_pair_idx ON product_alerts (product_id, email);

CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS collections_slug_idx ON collections (slug);

-- Collection cover image, same storage approach as products.image_url above.
ALTER TABLE collections ADD COLUMN IF NOT EXISTS image_url TEXT;

-- Short status tag shown on the collection card (e.g. "NEW DROP", "LIMITED",
-- "RESTOCK") — free text, admin-set, no fixed vocabulary.
ALTER TABLE collections ADD COLUMN IF NOT EXISTS badge TEXT;

CREATE TABLE IF NOT EXISTS product_collections (
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  collection_id UUID NOT NULL REFERENCES collections(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS product_collections_pair_idx
  ON product_collections (product_id, collection_id);

-- Admin-editable marketing copy (hero lede, manifesto blurbs, footer
-- description). A plain key/value store rather than dedicated columns, since
-- the set of editable blocks is expected to grow. Missing keys fall back to
-- the English defaults baked into the i18n dictionaries — see
-- src/lib/site-content.ts.
CREATE TABLE IF NOT EXISTS site_content (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
