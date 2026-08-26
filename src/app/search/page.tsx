import { getAllProducts } from "@/lib/products";
import { getAllCollections } from "@/lib/collections";
import { SearchClient } from "./SearchClient";

export const metadata = { title: "Search — Nej Clothing" };

export default async function SearchPage() {
  const [products, collections] = await Promise.all([
    getAllProducts(),
    getAllCollections(),
  ]);

  return <SearchClient products={products} collections={collections} />;
}
