"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Product } from "@/lib/db/types";

const inputClass =
  "w-full border border-line-strong bg-transparent px-3 py-2.5 font-mono-data text-sm text-paper placeholder:text-paper/30 focus:border-amber focus:outline-none";



export function NewCollectionForm({ products }: { products: Product[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
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
      productIds: Array.from(selected),
    };

    try {
      const res = await fetch("/api/admin/collections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to create collection");
      router.push("/admin/collections");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <label className="block">
        <span className="mb-1.5 block font-mono-data text-[11px] tracking-[0.1em] text-paper/40">
          NAME
        </span>
        <input name="name" required placeholder="e.g. Blackout Pack" className={inputClass} />
      </label>

      <label className="block">
        <span className="mb-1.5 block font-mono-data text-[11px] tracking-[0.1em] text-paper/40">
          DESCRIPTION
        </span>
        <textarea
          name="description"
          required
          rows={3}
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
        {submitting ? "SAVING…" : "CREATE COLLECTION"}
      </button>
    </form>
  );
}
