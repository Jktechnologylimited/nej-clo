"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/db/types";
import { productCategoryValues, productStatusValues } from "@/lib/db/types";
import { ImageUploadField } from "@/components/ImageUploadField";

const inputClass =
  "w-full border border-line-strong bg-transparent px-3 py-2.5 font-mono-data text-sm text-paper placeholder:text-paper/30 focus:border-amber focus:outline-none";
const selectClass =
  "w-full border border-line-strong bg-bg px-3 py-2.5 font-mono-data text-sm text-paper focus:border-amber focus:outline-none";

export function ProductEditForm({ product }: { product: Product }) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string | null>(product.imageUrl);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      slug: form.get("slug"),
      name: form.get("name"),
      category: form.get("category"),
      description: form.get("description"),
      colorway: form.get("colorway"),
      sku: form.get("sku"),
      dropCode: form.get("dropCode"),
      priceNaira: Number(form.get("priceNaira")),
      stock: Number(form.get("stock")),
      status: form.get("status"),
      sizes: form.get("sizes"),
      imageUrl,
    };

    try {
      const res = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <ImageUploadField label="PRODUCT PHOTO" value={imageUrl} onChange={setImageUrl} />

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block font-mono-data text-[11px] tracking-[0.1em] text-paper/40">
            NAME
          </span>
          <input name="name" required defaultValue={product.name} className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1.5 block font-mono-data text-[11px] tracking-[0.1em] text-paper/40">
            COLOURWAY
          </span>
          <input name="colorway" required defaultValue={product.colorway} className={inputClass} />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block font-mono-data text-[11px] tracking-[0.1em] text-paper/40">
          SLUG — /product/…
        </span>
        <input
          name="slug"
          required
          pattern="[a-z0-9-]+"
          defaultValue={product.slug}
          className={inputClass}
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block font-mono-data text-[11px] tracking-[0.1em] text-paper/40">
          DESCRIPTION
        </span>
        <textarea
          name="description"
          required
          rows={3}
          defaultValue={product.description}
          className={inputClass}
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block font-mono-data text-[11px] tracking-[0.1em] text-paper/40">
            CATEGORY
          </span>
          <select name="category" defaultValue={product.category} className={selectClass}>
            {productCategoryValues.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block font-mono-data text-[11px] tracking-[0.1em] text-paper/40">
            STATUS
          </span>
          <select name="status" defaultValue={product.status} className={selectClass}>
            {productStatusValues.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block font-mono-data text-[11px] tracking-[0.1em] text-paper/40">
            SKU
          </span>
          <input name="sku" required defaultValue={product.sku} className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1.5 block font-mono-data text-[11px] tracking-[0.1em] text-paper/40">
            DROP CODE
          </span>
          <input name="dropCode" required defaultValue={product.dropCode} className={inputClass} />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block font-mono-data text-[11px] tracking-[0.1em] text-paper/40">
            PRICE (₦ NAIRA)
          </span>
          <input
            name="priceNaira"
            type="number"
            min="0"
            step="1"
            required
            defaultValue={product.priceCents / 100}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block font-mono-data text-[11px] tracking-[0.1em] text-paper/40">
            STOCK
          </span>
          <input
            name="stock"
            type="number"
            min="0"
            step="1"
            required
            defaultValue={product.stock}
            className={inputClass}
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block font-mono-data text-[11px] tracking-[0.1em] text-paper/40">
          SIZES — comma-separated
        </span>
        <input
          name="sizes"
          required
          defaultValue={product.sizes}
          placeholder="S,M,L,XL"
          className={inputClass}
        />
      </label>

      {error && (
        <p className="border border-rust bg-rust/10 px-3 py-2 font-mono-data text-xs text-rust">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full border border-paper bg-paper px-6 py-4 text-center font-mono-data text-xs tracking-[0.15em] text-ink transition hover:bg-amber hover:border-amber disabled:opacity-50"
      >
        {submitting ? "SAVING…" : "SAVE CHANGES"}
      </button>
    </form>
  );
}
