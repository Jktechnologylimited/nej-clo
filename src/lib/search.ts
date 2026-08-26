import type { Product, Collection } from "@/lib/db/types";

function matches(haystack: string, needle: string): boolean {
  return haystack.toLowerCase().includes(needle);
}

export function searchProducts(products: Product[], query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return products.filter(
    (p) =>
      matches(p.name, q) ||
      matches(p.description, q) ||
      matches(p.sku, q) ||
      matches(p.colorway, q) ||
      matches(p.category, q) ||
      matches(p.dropCode, q),
  );
}

export function searchCollections(collections: Collection[], query: string): Collection[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return collections.filter((c) => matches(c.name, q) || matches(c.description, q));
}
