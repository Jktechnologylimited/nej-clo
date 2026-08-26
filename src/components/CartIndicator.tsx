"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

export function CartIndicator() {
  const { count } = useCart();
  return (
    <Link
      href="/cart"
      aria-label="Cart"
      className="relative text-ink/70 transition hover:text-ink"
    >
      <svg width="19" height="19" viewBox="0 0 19 19" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 6h11l-1 9.5a1.5 1.5 0 0 1-1.5 1.35H6.5A1.5 1.5 0 0 1 5 15.5L4 6Z" strokeLinejoin="round" />
        <path d="M6.5 6V4.8a3 3 0 0 1 6 0V6" strokeLinecap="round" />
      </svg>
      {count > 0 && (
        <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center bg-ink font-mono-data text-[9px] text-paper">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </Link>
  );
}
