import { getAllProducts } from "@/lib/products";
import { getAllCollections, getAllProductCollectionLinks } from "@/lib/collections";
import { ShopClient } from "./ShopClient";

export default async function ShopPage() {
  const [products, collectionList, links] = await Promise.all([
    getAllProducts(),
    getAllCollections(),
    getAllProductCollectionLinks(),
  ]);

  return <ShopClient products={products} collections={collectionList} links={links} />;
}
