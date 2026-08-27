"use client";

import { useState, type FormEvent } from "react";

export function NewsletterForm({
  buttonLabel,
  successLabel,
  placeholder = "you@email.com",
}: {
  buttonLabel: string;
  successLabel: string;
  placeholder?: string;
}) {
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
      <p className="font-mono-data text-xs tracking-[0.1em] text-ink">
        {successLabel}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-0">
      <input
        type="email"
        required
        placeholder={placeholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full min-w-0 border border-line-strong bg-paper px-3 py-2.5 font-mono-data text-xs text-ink placeholder:text-ink-muted/60 focus:border-ink focus:outline-none"
      />
      <button
        type="submit"
        disabled={state === "loading"}
        className="shrink-0 border border-l-0 border-ink bg-ink px-5 py-2.5 font-mono-data text-xs tracking-[0.1em] text-paper transition hover:bg-amber hover:text-bg disabled:opacity-50"
      >
        {state === "loading" ? "…" : buttonLabel}
      </button>
    </form>
  );
}
