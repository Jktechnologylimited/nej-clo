"use client";

import { useState, type FormEvent } from "react";
import { useI18n } from "./I18nProvider";

export function NewsletterForm() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setState("done");
      setEmail("");
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <p className="font-mono-data text-xs tracking-[0.1em] text-amber">
        {t.footer.joined}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-0">
      <input
        type="email"
        required
        placeholder="you@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full min-w-0 border border-line-strong bg-transparent px-3 py-2 font-mono-data text-xs text-paper placeholder:text-paper/30 focus:border-amber focus:outline-none"
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className="shrink-0 border border-l-0 border-line-strong bg-paper px-4 py-2 font-mono-data text-xs tracking-[0.1em] text-ink transition hover:bg-amber disabled:opacity-50"
      >
        {state === "loading" ? "…" : t.footer.join}
      </button>
    </form>
  );
}
