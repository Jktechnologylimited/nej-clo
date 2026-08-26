import { notFound } from "next/navigation";
import { getProductById } from "@/lib/products";
import { ProductEditForm } from "./ProductEditForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <div className="mx-auto max-w-2xl px-5 py-14 sm:px-8 sm:py-20">
      <p className="font-mono-data text-[11px] tracking-[0.2em] text-ink/40">
        ADMIN — EDIT PRODUCT
      </p>
      <h1 className="mt-1 font-display text-3xl font-extrabold uppercase tracking-tight text-ink">
        {product.name}
      </h1>

      <ProductEditForm product={product} />
    </div>
  );
}
