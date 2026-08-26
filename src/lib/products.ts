import { sql } from "@/lib/db";
import type { Product } from "@/lib/db/types";

const PRODUCT_COLUMNS = `
  id, slug, name, category, description, colorway, sku,
  drop_code AS "dropCode", price_cents AS "priceCents", stock, status, sizes,
  image_urls AS "imageUrls", created_at AS "createdAt"
`;

export async function getAllProducts(): Promise<Product[]> {
  const rows = await sql.query(
    `SELECT ${PRODUCT_COLUMNS} FROM products ORDER BY created_at DESC`,
  );
  return rows as unknown as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const rows = await sql.query(
    `SELECT ${PRODUCT_COLUMNS} FROM products WHERE slug = $1 LIMIT 1`,
    [slug],
  );
  return (rows[0] as Product) ?? null;
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const all = await getAllProducts();
  return all.filter((p) => p.status !== "sold_out").slice(0, limit);
}

export async function getLatestDropCode(): Promise<string | null> {
  const all = await getAllProducts();
  return all[0]?.dropCode ?? null;
}

export async function getProductById(id: string): Promise<Product | null> {
  const rows = await sql.query(
    `SELECT ${PRODUCT_COLUMNS} FROM products WHERE id = $1 LIMIT 1`,
    [id],
  );
  return (rows[0] as Product) ?? null;
}

/**
 * Other colorways of "the same" product — matched by name, matching how the
 * seed data models a garment with multiple colorways as separate rows.
 * Powers the color-swatch selector on the product page.
 */
export async function getColorwaySiblings(name: string, excludeId: string): Promise<Product[]> {
  const rows = await sql.query(
    `SELECT ${PRODUCT_COLUMNS} FROM products WHERE name = $1 AND id != $2 ORDER BY colorway`,
    [name, excludeId],
  );
  return rows as unknown as Product[];
}

export async function updateProduct(
  id: string,
  input: {
    slug: string;
    name: string;
    category: string;
    description: string;
    colorway: string;
    sku: string;
    dropCode: string;
    priceCents: number;
    stock: number;
    status: string;
    sizes: string;
    imageUrls: string[];
  },
): Promise<Product | null> {
  await sql`
    UPDATE products
    SET
      slug = ${input.slug},
      name = ${input.name},
      category = ${input.category},
      description = ${input.description},
      colorway = ${input.colorway},
      sku = ${input.sku},
      drop_code = ${input.dropCode},
      price_cents = ${input.priceCents},
      stock = ${input.stock},
      status = ${input.status},
      sizes = ${input.sizes},
      image_urls = ${input.imageUrls}
    WHERE id = ${id}
  `;
  return getProductById(id);
}
