"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { Order } from "@/lib/db/types";
import { orderStatusValues } from "@/lib/order-status";

const inputClass =
  "w-full border border-line-strong bg-transparent px-3 py-2.5 font-mono-data text-sm text-ink placeholder:text-ink/30 focus:border-amber focus:outline-none";
const selectClass =
  "w-full border border-line-strong bg-bg px-3 py-2.5 font-mono-data text-sm text-ink focus:border-amber focus:outline-none";

export function OrderFulfillmentForm({ order }: { order: Order }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      status: form.get("status"),
      carrier: form.get("carrier"),
      trackingNumber: form.get("trackingNumber"),
    };

    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      router.push("/admin/orders");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-4">
      <p className="font-mono-data text-[11px] tracking-[0.1em] text-ink-muted">
        FULFILLMENT
      </p>

      <label className="block">
        <span className="mb-1.5 block font-mono-data text-[11px] tracking-[0.1em] text-ink-muted">
          STATUS
        </span>
        <select name="status" defaultValue={order.status} className={selectClass}>
          {orderStatusValues.map((s) => (
            <option key={s} value={s}>
              {s.replace("_", " ")}
            </option>
          ))}
        </select>
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block font-mono-data text-[11px] tracking-[0.1em] text-ink-muted">
            CARRIER
          </span>
          <input
            name="carrier"
            defaultValue={order.carrier ?? ""}
            placeholder="e.g. GIG Logistics"
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block font-mono-data text-[11px] tracking-[0.1em] text-ink-muted">
            TRACKING NUMBER
          </span>
          <input
            name="trackingNumber"
            defaultValue={order.trackingNumber ?? ""}
            placeholder="e.g. GIG123456789NG"
            className={inputClass}
          />
        </label>
      </div>

      {error && (
        <p className="border border-rust bg-rust/10 px-3 py-2 font-mono-data text-xs text-rust">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full border border-ink bg-ink px-6 py-4 text-center font-mono-data text-xs tracking-[0.15em] text-paper transition hover:bg-amber hover:border-amber hover:text-bg disabled:opacity-50"
      >
        {submitting ? "SAVING…" : "SAVE FULFILLMENT"}
      </button>
    </form>
  );
}
