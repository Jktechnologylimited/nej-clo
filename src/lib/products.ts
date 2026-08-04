import { sql } from "@/lib/db";
import type { Product } from "@/lib/db/types";

const PRODUCT_COLUMNS = `
  id, slug, name, category, description, colorway, sku,
  drop_code AS "dropCode", price_cents AS "priceCents", stock, status, sizes,
  created_at AS "createdAt"
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
