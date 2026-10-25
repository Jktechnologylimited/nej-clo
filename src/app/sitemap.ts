import type { MetadataRoute } from "next";
import { getAllProducts } from "@/lib/products";
import { getAllCollections } from "@/lib/collections";
import { siteUrl } from "@/lib/seo";

export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections] = await Promise.all([getAllProducts(), getAllCollections()]);
  const paths = ["/", "/shop", "/collections", "/about", "/help", "/drop-alerts", "/legal/privacy", "/legal/terms",
    ...products.map((product) => `/product/${encodeURIComponent(product.slug)}`),
    ...collections.map((collection) => `/collections/${encodeURIComponent(collection.slug)}`),
  ];
  return paths.map((path) => ({ url: new URL(path, siteUrl()).href }));
}
