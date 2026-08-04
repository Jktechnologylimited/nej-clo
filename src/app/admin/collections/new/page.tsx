import { getAllProducts } from "@/lib/products";
import { NewCollectionForm } from "./NewCollectionForm";

export default async function NewCollectionPage() {
  const productList = await getAllProducts();

  return (
    <div className="mx-auto max-w-2xl px-5 py-14 sm:px-8 sm:py-20">
      <p className="font-mono-data text-[11px] tracking-[0.2em] text-paper/40">
        ADMIN — NEW
      </p>
      <h1 className="mt-1 font-display text-3xl font-extrabold uppercase tracking-tight text-paper">
        New collection
      </h1>

      <NewCollectionForm products={productList} />
    </div>
  );
}
