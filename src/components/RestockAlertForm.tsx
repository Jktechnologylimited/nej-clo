"use client";

import { useState, type FormEvent } from "react";
import { useI18n } from "./I18nProvider";

export function RestockAlertForm({ productId }: { productId: string }) {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/product-alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, email }),
      });
      if (!res.ok) throw new Error();
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className="border border-line-strong bg-bg-raised px-4 py-3 font-mono-data text-xs text-ink">
        {t.product.notifyMeSuccess}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <p className="mb-2 font-mono-data text-[11px] tracking-[0.1em] text-ink-muted">
        {t.product.notifyMeTitle}
      </p>
      <div className="flex gap-0">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.product.notifyMePlaceholder}
          className="w-full min-w-0 border border-line-strong bg-paper px-3 py-2.5 font-mono-data text-xs text-ink placeholder:text-ink-muted/60 focus:border-ink focus:outline-none"
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="shrink-0 border border-l-0 border-ink bg-ink px-5 py-2.5 font-mono-data text-xs tracking-[0.1em] text-paper transition hover:bg-amber hover:text-ink disabled:opacity-50"
        >
          {state === "loading" ? "…" : t.product.notifyMeCta}
        </button>
      </div>
      {state === "error" && (
        <p className="mt-1.5 font-mono-data text-[10px] text-rust">
          Something went wrong — try again.
        </p>
      )}
    </form>
  );
}
