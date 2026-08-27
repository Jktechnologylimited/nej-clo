"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

const inputClass =
  "w-full border border-line-strong bg-transparent px-3 py-2.5 font-mono-data text-sm text-ink placeholder:text-ink/30 focus:border-amber focus:outline-none";

export function ProfileForm({ name, email }: { name: string; email: string }) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
    };

    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Something went wrong");
      setSaved(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-5">
      <label className="block">
        <span className="mb-1.5 block font-mono-data text-[11px] tracking-[0.1em] text-ink-muted">
          NAME
        </span>
        <input name="name" required defaultValue={name} className={inputClass} />
      </label>

      <label className="block">
        <span className="mb-1.5 block font-mono-data text-[11px] tracking-[0.1em] text-ink-muted">
          EMAIL
        </span>
        <input type="email" name="email" required defaultValue={email} className={inputClass} />
        <span className="mt-1.5 block font-mono-data text-[10px] text-ink-muted">
          This is also your login email.
        </span>
      </label>

      {error && (
        <p className="border border-rust bg-rust/10 px-3 py-2 font-mono-data text-xs text-rust">
          {error}
        </p>
      )}
      {saved && (
        <p className="font-mono-data text-xs text-amber">Saved.</p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="border border-ink bg-ink px-6 py-3 font-mono-data text-xs tracking-[0.15em] text-paper transition hover:bg-amber hover:border-amber hover:text-bg disabled:opacity-50"
      >
        {submitting ? "SAVING…" : "SAVE CHANGES"}
      </button>
    </form>
  );
}
