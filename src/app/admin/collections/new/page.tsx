import { getAllProducts } from "@/lib/products";
import { CollectionForm } from "../CollectionForm";

export default async function NewCollectionPage() {
  const productList = await getAllProducts();

  return (
    <div className="mx-auto max-w-2xl px-5 py-14 sm:px-8 sm:py-20">
      <p className="font-mono-data text-[11px] tracking-[0.2em] text-ink/40">
        ADMIN — NEW
      </p>
      <h1 className="mt-1 font-display text-3xl font-extrabold uppercase tracking-tight text-ink">
        New collection
      </h1>

      <CollectionForm products={productList} />
    </div>
  );
}
