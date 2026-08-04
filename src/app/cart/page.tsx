"use client";

import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { useI18n } from "@/components/I18nProvider";

export default function CartPage() {
  const { items, removeItem, setQuantity, subtotalCents } = useCart();
  const { t, formatPrice } = useI18n();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8">
        <p className="font-mono-data text-[11px] tracking-[0.2em] text-paper/40">
          {t.cart.title.toUpperCase()}
        </p>
        <h1 className="mt-2 font-display text-2xl font-extrabold uppercase text-paper">
          {t.cart.empty}
        </h1>
        <Link
          href="/shop"
          className="mt-6 inline-block border border-paper px-6 py-3 font-mono-data text-xs tracking-[0.15em] text-paper transition hover:bg-amber hover:border-amber hover:text-ink"
        >
          {t.hero.viewStock}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
      <p className="font-mono-data text-[11px] tracking-[0.2em] text-paper/40">
        {t.cart.title.toUpperCase()}
      </p>
      <h1 className="mt-1 font-display text-3xl font-extrabold uppercase tracking-tight text-paper">
        {t.cart.title}
      </h1>

      <div className="mt-8 border border-line-strong">
        <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 border-b border-line-strong bg-bg-raised px-4 py-3 font-mono-data text-[10px] tracking-[0.15em] text-paper/40 sm:grid">
          <span>{t.cart.item}</span>
          <span>{t.product.size}</span>
          <span>{t.product.qty}</span>
          <span>{t.cart.subtotal}</span>
          <span />
        </div>

        {items.map((item) => (
          <div
            key={`${item.productId}-${item.size}`}
            className="grid grid-cols-2 gap-3 border-b border-line-strong px-4 py-4 last:border-b-0 sm:grid-cols-[2fr_1fr_1fr_1fr_auto] sm:items-center sm:gap-4"
          >
            <div>
              <Link
                href={`/product/${item.slug}`}
                className="font-display text-sm font-bold uppercase text-paper hover:text-amber"
              >
                {item.name}
              </Link>
              <p className="font-mono-data text-[11px] text-paper/40">
                {item.colorway}
              </p>
            </div>
            <span className="font-mono-data text-sm text-paper/70">
              {item.size}
            </span>
            <div className="flex items-center border border-line-strong text-paper/70">
              <button
                onClick={() =>
                  setQuantity(item.productId, item.size, item.quantity - 1)
                }
                className="px-2 py-1 font-mono-data hover:text-amber"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="min-w-[2ch] px-1 text-center font-mono-data text-sm">
                {item.quantity}
              </span>
              <button
                onClick={() =>
                  setQuantity(item.productId, item.size, item.quantity + 1)
                }
                className="px-2 py-1 font-mono-data hover:text-amber"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
            <span className="font-mono-data text-sm text-paper">
              {formatPrice(item.unitPriceCents * item.quantity)}
            </span>
            <button
              onClick={() => removeItem(item.productId, item.size)}
              className="justify-self-start font-mono-data text-[11px] tracking-[0.1em] text-rust hover:underline sm:justify-self-end"
            >
              {t.cart.remove}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col items-end gap-4">
        <div className="flex w-full justify-between border-t border-dashed border-line-strong pt-4 font-mono-data text-sm text-paper sm:w-72">
          <span className="text-paper/50">{t.cart.subtotal}</span>
          <span className="font-bold">{formatPrice(subtotalCents)}</span>
        </div>
        <Link
          href="/checkout"
          className="w-full border border-paper bg-paper px-6 py-4 text-center font-mono-data text-xs tracking-[0.15em] text-ink transition hover:bg-amber hover:border-amber sm:w-72"
        >
          {t.cart.checkout}
        </Link>
      </div>
    </div>
  );
}
