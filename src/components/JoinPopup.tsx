"use client";

import { useEffect, useState, type FormEvent } from "react";
import { usePathname } from "next/navigation";
import { useI18n } from "./I18nProvider";

const STORAGE_KEY = "nej_join_popup_dismissed";
const SHOW_DELAY_MS = 5000;
const SKIP_PREFIXES = ["/checkout", "/account", "/admin"];

export function JoinPopup() {
  const { t } = useI18n();
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");

  useEffect(() => {
    if (SKIP_PREFIXES.some((p) => pathname.startsWith(p))) return;

    try {
      if (window.localStorage.getItem(STORAGE_KEY)) return;
    } catch {
      // localStorage unavailable — just don't persist dismissal, still show once
    }

    const timer = setTimeout(() => setVisible(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, [pathname]);

  function dismiss() {
    setVisible(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // ignore
    }
  }

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
      try {
        window.localStorage.setItem(STORAGE_KEY, "1");
      } catch {
        // ignore
      }
      setTimeout(() => setVisible(false), 1800);
    } catch {
      setState("error");
    }
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 p-4 sm:items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) dismiss();
      }}
    >
      <div className="relative w-full max-w-sm border border-line-strong bg-bg-raised p-6">
        <button
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-4 top-4 font-mono-data text-lg text-ink/40 transition hover:text-amber"
        >
          ×
        </button>

        <p className="font-mono-data text-[11px] tracking-[0.2em] text-amber">
          MANIFEST ALERT
        </p>
        <h2 className="mt-2 font-display text-xl font-extrabold uppercase leading-tight text-ink">
          {t.popup.title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-ink/60">{t.popup.body}</p>

        {state === "done" ? (
          <p className="mt-5 font-mono-data text-xs tracking-[0.1em] text-amber">
            {t.popup.success}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.popup.emailPlaceholder}
              className="w-full border border-line-strong bg-transparent px-3 py-2.5 font-mono-data text-sm text-ink placeholder:text-ink/30 focus:border-amber focus:outline-none"
            />
            {state === "error" && (
              <p className="font-mono-data text-[11px] text-rust">
                Something went wrong — try again.
              </p>
            )}
            <button
              type="submit"
              disabled={state === "loading"}
              className="w-full border border-paper bg-paper px-4 py-3 font-mono-data text-xs tracking-[0.15em] text-ink transition hover:bg-amber hover:border-amber disabled:opacity-50"
            >
              {state === "loading" ? "…" : t.popup.join}
            </button>
            <button
              type="button"
              onClick={dismiss}
              className="w-full py-1 text-center font-mono-data text-[11px] tracking-[0.1em] text-ink/30 transition hover:text-ink/60"
            >
              {t.popup.noThanks}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
