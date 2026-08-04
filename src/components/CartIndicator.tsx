"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { useI18n } from "./I18nProvider";

export function CartIndicator() {
  const { count } = useCart();
  const { t } = useI18n();
  return (
    <Link
      href="/cart"
      className="font-mono-data text-xs tracking-[0.1em] text-paper/80 transition hover:text-amber"
    >
      {t.cart.title.toUpperCase()} [{count.toString().padStart(2, "0")}]
    </Link>
  );
}
