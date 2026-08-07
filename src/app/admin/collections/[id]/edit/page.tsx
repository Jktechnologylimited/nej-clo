import { notFound } from "next/navigation";
import { getAllProducts } from "@/lib/products";
import { getCollectionById, getProductsForCollection } from "@/lib/collections";
import { CollectionForm } from "../../CollectionForm";

export default async function EditCollectionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [collection, productList, currentProducts] = await Promise.all([
    getCollectionById(id),
    getAllProducts(),
    getProductsForCollection(id),
  ]);
  if (!collection) notFound();

  return (
    <div className="mx-auto max-w-2xl px-5 py-14 sm:px-8 sm:py-20">
      <p className="font-mono-data text-[11px] tracking-[0.2em] text-paper/40">
        ADMIN — EDIT
      </p>
      <h1 className="mt-1 font-display text-3xl font-extrabold uppercase tracking-tight text-paper">
        {collection.name}
      </h1>

      <CollectionForm
        products={productList}
        initial={{
          id: collection.id,
          name: collection.name,
          description: collection.description,
          slug: collection.slug,
          productIds: currentProducts.map((p) => p.id),
          imageUrl: collection.imageUrl,
        }}
      />
    </div>
  );
}
