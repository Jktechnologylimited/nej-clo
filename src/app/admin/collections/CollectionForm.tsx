"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/db/types";
import { ImageUploadField } from "@/components/ImageUploadField";

const inputClass =
  "w-full border border-line-strong bg-transparent px-3 py-2.5 font-mono-data text-sm text-paper placeholder:text-paper/30 focus:border-amber focus:outline-none";

type Initial = {
  id: string;
  name: string;
  description: string;
  slug: string;
  productIds: string[];
  imageUrl: string | null;
};

export function CollectionForm({
  products,
  initial,
}: {
  products: Product[];
  initial?: Initial;
}) {
  const router = useRouter();
  const isEdit = !!initial;
  const [selected, setSelected] = useState<Set<string>>(
    new Set(initial?.productIds ?? []),
  );
  const [imageUrl, setImageUrl] = useState<string | null>(initial?.imageUrl ?? null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      description: form.get("description"),
      ...(isEdit ? { slug: form.get("slug") } : {}),
      productIds: Array.from(selected),
      imageUrl,
    };

    try {
      const res = await fetch(
        isEdit ? `/api/admin/collections/${initial!.id}` : "/api/admin/collections",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      router.push("/admin/collections");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <ImageUploadField label="COVER IMAGE" value={imageUrl} onChange={setImageUrl} />

      <label className="block">
        <span className="mb-1.5 block font-mono-data text-[11px] tracking-[0.1em] text-paper/40">
          NAME
        </span>
        <input
          name="name"
          required
          defaultValue={initial?.name}
          placeholder="e.g. Blackout Pack"
          className={inputClass}
        />
      </label>

      {isEdit && (
        <label className="block">
          <span className="mb-1.5 block font-mono-data text-[11px] tracking-[0.1em] text-paper/40">
            SLUG — /collections/…
          </span>
          <input
            name="slug"
            required
            pattern="[a-z0-9-]+"
            defaultValue={initial?.slug}
            className={inputClass}
          />
          <span className="mt-1 block font-mono-data text-[10px] text-paper/30">
            Lowercase letters, numbers, and hyphens only. Changing this changes the page&apos;s URL.
          </span>
        </label>
      )}

      <label className="block">
        <span className="mb-1.5 block font-mono-data text-[11px] tracking-[0.1em] text-paper/40">
          DESCRIPTION
        </span>
        <textarea
          name="description"
          required
          rows={3}
          defaultValue={initial?.description}
          placeholder="One or two lines about what ties this collection together."
          className={inputClass}
        />
      </label>

      <div>
        <span className="mb-2 block font-mono-data text-[11px] tracking-[0.1em] text-paper/40">
          PRODUCTS ({selected.size} selected)
        </span>
        <div className="max-h-80 divide-y divide-line overflow-y-auto border border-line-strong">
          {products.map((p) => (
            <label
              key={p.id}
              className="flex cursor-pointer items-center justify-between gap-3 px-4 py-3 transition hover:bg-bg-raised"
            >
              <span className="font-mono-data text-xs text-paper">
                {p.name} — {p.colorway}
                <span className="ml-2 text-paper/30">{p.sku}</span>
              </span>
              <input
                type="checkbox"
                checked={selected.has(p.id)}
                onChange={() => toggle(p.id)}
                className="h-4 w-4 accent-amber"
              />
            </label>
          ))}
        </div>
      </div>

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
        {submitting ? "SAVING…" : isEdit ? "SAVE CHANGES" : "CREATE COLLECTION"}
      </button>
    </form>
  );
}
