"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

const inputClass =
  "w-full border border-line-strong bg-transparent px-3 py-2.5 font-mono-data text-sm text-ink placeholder:text-ink/30 focus:border-amber focus:outline-none";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/account";

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      email: form.get("email"),
      password: form.get("password"),
    };

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Login failed");
      router.push(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-5 py-16 sm:px-8 sm:py-24">
      <p className="font-mono-data text-[11px] tracking-[0.2em] text-ink/40">
        ACCESS
      </p>
      <h1 className="mt-1 font-display text-3xl font-extrabold uppercase tracking-tight text-ink">
        Log in
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <label className="block">
          <span className="mb-1.5 block font-mono-data text-[11px] tracking-[0.1em] text-ink/40">
            EMAIL
          </span>
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@email.com"
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block font-mono-data text-[11px] tracking-[0.1em] text-ink/40">
            PASSWORD
          </span>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className={inputClass}
          />
        </label>

        {error && (
          <p className="font-mono-data text-xs text-rust">{error}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full border border-paper bg-paper px-6 py-3 font-mono-data text-xs tracking-[0.15em] text-ink transition hover:bg-amber hover:border-amber disabled:opacity-50"
        >
          {submitting ? "CHECKING…" : "LOG IN"}
        </button>
      </form>

      <p className="mt-6 font-mono-data text-xs text-ink/40">
        No account yet?{" "}
        <Link href="/account/signup" className="text-ink/70 underline hover:text-amber">
          Create one
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
