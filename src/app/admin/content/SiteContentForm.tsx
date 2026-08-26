"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import type { SiteContentMap } from "@/lib/site-content";

const textareaClass =
  "w-full border border-line-strong bg-transparent px-3 py-2.5 font-mono-data text-sm text-ink placeholder:text-ink/25 focus:border-amber focus:outline-none";

const FIELD_GROUPS: { heading: string; keys: string[]; multiline?: boolean }[] = [
  { heading: "HERO", keys: ["hero_lede"], multiline: true },
  {
    heading: "MANIFESTO — ITEM 1",
    keys: ["manifesto_1_title", "manifesto_1_body"],
  },
  {
    heading: "MANIFESTO — ITEM 2",
    keys: ["manifesto_2_title", "manifesto_2_body"],
  },
  {
    heading: "MANIFESTO — ITEM 3",
    keys: ["manifesto_3_title", "manifesto_3_body"],
  },
  { heading: "FOOTER", keys: ["footer_desc"], multiline: true },
];

const FIELD_LABELS: Record<string, string> = {
  hero_lede: "Lede paragraph",
  manifesto_1_title: "Title",
  manifesto_1_body: "Body",
  manifesto_2_title: "Title",
  manifesto_2_body: "Body",
  manifesto_3_title: "Title",
  manifesto_3_body: "Body",
  footer_desc: "Description",
};

export function SiteContentForm({
  overrides,
  defaults: defaultsMap,
}: {
  overrides: SiteContentMap;
  defaults: Record<string, string>;
}) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    for (const key of Object.keys(defaultsMap)) {
      initial[key] = overrides[key as keyof SiteContentMap] ?? "";
    }
    return initial;
  });
  const [submitting, setSubmitting] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setMessage(null);

    // Only send fields the admin actually filled in — blank fields fall
    // back to the dictionary default rather than saving an empty override.
    const payload = Object.fromEntries(
      Object.entries(values).filter(([, v]) => v.trim() !== ""),
    );

    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setMessage("Saved.");
      router.refresh();
    } catch {
      setMessage("Couldn't save — try again.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleReset() {
    if (!confirm("Reset every field back to the default copy?")) return;
    setResetting(true);
    setMessage(null);
    try {
      const res = await fetch("/api/admin/content", { method: "DELETE" });
      if (!res.ok) throw new Error();
      setValues(Object.fromEntries(Object.keys(defaultsMap).map((k) => [k, ""])));
      setMessage("Reset to defaults.");
      router.refresh();
    } catch {
      setMessage("Couldn't reset — try again.");
    } finally {
      setResetting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-8">
      {FIELD_GROUPS.map((group) => (
        <div key={group.heading}>
          <p className="mb-3 font-mono-data text-[11px] tracking-[0.15em] text-ink/40">
            {group.heading}
          </p>
          <div className="space-y-3">
            {group.keys.map((key) => (
              <label key={key} className="block">
                <span className="mb-1.5 block font-mono-data text-[10px] tracking-[0.1em] text-ink/30">
                  {FIELD_LABELS[key]}
                </span>
                <textarea
                  rows={group.multiline ? 3 : 2}
                  value={values[key] ?? ""}
                  onChange={(e) =>
                    setValues((prev) => ({ ...prev, [key]: e.target.value }))
                  }
                  placeholder={defaultsMap[key]}
                  className={textareaClass}
                />
              </label>
            ))}
          </div>
        </div>
      ))}

      {message && (
        <p className="font-mono-data text-xs text-amber">{message}</p>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 border border-paper bg-paper px-6 py-4 text-center font-mono-data text-xs tracking-[0.15em] text-ink transition hover:bg-amber hover:border-amber disabled:opacity-50"
        >
          {submitting ? "SAVING…" : "SAVE CHANGES"}
        </button>
        <button
          type="button"
          onClick={handleReset}
          disabled={resetting}
          className="border border-line-strong px-6 py-4 text-center font-mono-data text-xs tracking-[0.15em] text-ink/60 transition hover:border-rust hover:text-rust disabled:opacity-50"
        >
          {resetting ? "…" : "RESET ALL TO DEFAULTS"}
        </button>
      </div>
    </form>
  );
}
