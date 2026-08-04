import { randomUUID } from "node:crypto";
import { sql } from "@/lib/db";
import { slugify } from "@/lib/utils";
import type { Collection, Product } from "@/lib/db/types";

const COLLECTION_COLUMNS = `id, slug, name, description, created_at AS "createdAt"`;

const PRODUCT_COLUMNS = `
  p.id, p.slug, p.name, p.category, p.description, p.colorway, p.sku,
  p.drop_code AS "dropCode", p.price_cents AS "priceCents", p.stock, p.status,
  p.sizes, p.created_at AS "createdAt"
`;

export async function getAllCollections(): Promise<Collection[]> {
  const rows = await sql.query(
    `SELECT ${COLLECTION_COLUMNS} FROM collections ORDER BY created_at DESC`,
  );
  return rows as unknown as Collection[];
}

export async function getCollectionBySlug(slug: string): Promise<Collection | null> {
  const rows = await sql.query(
    `SELECT ${COLLECTION_COLUMNS} FROM collections WHERE slug = $1 LIMIT 1`,
    [slug],
  );
  return (rows[0] as Collection) ?? null;
}

/** Products that belong to a given collection, newest first. */
export async function getProductsForCollection(collectionId: string): Promise<Product[]> {
  const rows = await sql.query(
    `SELECT ${PRODUCT_COLUMNS}
     FROM products p
     JOIN product_collections pc ON pc.product_id = p.id
     WHERE pc.collection_id = $1
     ORDER BY p.created_at DESC`,
    [collectionId],
  );
  return rows as unknown as Product[];
}

/** How many products sit in each collection — used on the /collections index. */
export async function getCollectionProductCounts(): Promise<Map<string, number>> {
  const rows = (await sql.query(
    `SELECT collection_id AS "collectionId", COUNT(*)::int AS count
     FROM product_collections
     GROUP BY collection_id`,
  )) as { collectionId: string; count: number }[];

  const counts = new Map<string, number>();
  for (const row of rows) counts.set(row.collectionId, row.count);
  return counts;
}

export async function createCollection(input: {
  name: string;
  description: string;
  productIds: string[];
}): Promise<Collection> {
  const id = randomUUID();
  const slug = slugify(input.name);

  // The id is generated here (rather than left to the DB's default) so both
  // inserts can be built upfront and run atomically via sql.transaction —
  // the transaction API needs its query list constructed synchronously, so
  // the second insert can't depend on a RETURNING value from the first.
  const queries = [
    sql`INSERT INTO collections (id, slug, name, description)
        VALUES (${id}, ${slug}, ${input.name}, ${input.description})`,
    ...input.productIds.map(
      (productId) =>
        sql`INSERT INTO product_collections (product_id, collection_id)
            VALUES (${productId}, ${id})`,
    ),
  ];
  await sql.transaction(queries);

  const rows = await sql.query(
    `SELECT ${COLLECTION_COLUMNS} FROM collections WHERE id = $1`,
    [id],
  );
  return rows[0] as Collection;
}

export async function deleteCollection(id: string): Promise<void> {
  // product_collections rows are removed automatically via ON DELETE CASCADE
  // (defined in schema.sql) — no application-level cleanup needed.
  await sql.query(`DELETE FROM collections WHERE id = $1`, [id]);
}
