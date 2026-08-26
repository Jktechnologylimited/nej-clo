"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { useI18n } from "./I18nProvider";

export function ManifestPreview() {
  const { count } = useCart();
  const { t } = useI18n();

  if (count === 0) return null;

  return (
    <Link
      href="/cart"
      className="mt-4 flex items-center justify-between border border-line-strong bg-bg-raised px-4 py-3 font-mono-data text-xs text-ink transition hover:border-ink"
    >
      <span>{t.product.yourManifest(count)}</span>
      <span className="underline underline-offset-2">{t.product.viewManifest} →</span>
    </Link>
  );
}
