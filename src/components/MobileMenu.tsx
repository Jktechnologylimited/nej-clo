"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

export function MobileMenu({
  navItems,
  accountLabel,
  accountHref,
}: {
  navItems: { href: string; label: string }[];
  accountLabel: string;
  accountHref: string;
}) {
  const [open, setOpen] = useState(false);
  // The header uses position:sticky + z-40, which creates its own stacking
  // context — a z-50 child can never escape above that context relative to
  // the rest of the page no matter its own z-index. Portaling straight into
  // <body> sidesteps that entirely. document.body doesn't exist during SSR,
  // so the portal only renders once mounted client-side.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client-mount flag so the portal only targets document.body after mount, not a derived-state loop
    setMounted(true);
  }, []);

  // Lock body scroll while the panel is open, and let Escape close it.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const panel = (
    <div
      className={`fixed inset-0 z-50 lg:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-ink/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`}
        onClick={() => setOpen(false)}
      />
      <div
        className={`absolute left-0 top-0 h-full w-72 max-w-[80vw] border-r border-line bg-paper p-6 transition-transform duration-200 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="font-display text-xl font-black text-ink">NEJ</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
            className="text-ink/60 transition hover:text-ink"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M4 4l10 10M14 4 4 14" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <nav className="mt-8 flex flex-col gap-1 font-mono-data text-sm tracking-[0.1em] text-ink">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="border-b border-line py-3.5 transition hover:text-ink-muted"
            >
              {item.label}
            </Link>
          ))}
          <Link
            href={accountHref}
            onClick={() => setOpen(false)}
            className="border-b border-line py-3.5 transition hover:text-ink-muted"
          >
            {accountLabel}
          </Link>
        </nav>
      </div>
    </div>
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        aria-expanded={open}
        className="text-ink/70 transition hover:text-ink lg:hidden"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M3 5.5h14M3 10h14M3 14.5h14" strokeLinecap="round" />
        </svg>
      </button>

      {mounted && createPortal(panel, document.body)}
    </>
  );
}
