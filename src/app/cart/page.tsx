"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { useI18n } from "@/components/I18nProvider";
import { calculateShippingCents } from "@/lib/shipping";

export default function CartPage() {
  const { items, removeItem, setQuantity, setSize, subtotalCents } = useCart();
  const { t, formatPrice } = useI18n();
  const [promoCode, setPromoCode] = useState("");
  const [promoMessage, setPromoMessage] = useState<string | null>(null);
  const [limitedRunOpen, setLimitedRunOpen] = useState(true);

  const shippingCents = calculateShippingCents(subtotalCents);
  const estimatedTotalCents = subtotalCents + shippingCents;

  function handlePromoSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPromoMessage(t.cart.promoComingSoon);
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8">
        <p className="font-mono-data text-[11px] tracking-[0.2em] text-ink-muted">
          {t.cart.title.toUpperCase()}
        </p>
        <h1 className="mt-2 font-display text-2xl font-extrabold uppercase text-ink">
          {t.cart.empty}
        </h1>
        <Link
          href="/shop"
          className="mt-6 inline-block border border-ink bg-ink px-6 py-3 font-mono-data text-xs tracking-[0.15em] text-paper transition hover:bg-amber hover:border-amber hover:text-ink"
        >
          {t.hero.viewStock}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold uppercase tracking-tight text-ink">
            {t.cart.title}
          </h1>
          <p className="mt-1 font-mono-data text-xs text-ink-muted">
            {t.cart.itemsCount(items.reduce((s, i) => s + i.quantity, 0))}
          </p>
        </div>
        <Link
          href="/shop"
          className="font-mono-data text-xs tracking-[0.1em] text-ink-muted underline underline-offset-2 hover:text-ink"
        >
          ← {t.cart.continueShopping}
        </Link>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <div className="border border-line-strong">
            <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 border-b border-line-strong bg-bg-raised px-4 py-3 font-mono-data text-[10px] tracking-[0.15em] text-ink-muted sm:grid">
              <span>{t.cart.item}</span>
              <span>{t.product.size}</span>
              <span>{t.product.qty}</span>
              <span>{t.cart.subtotal}</span>
              <span />
            </div>

            {items.map((item) => {
              const sizeOptions = item.availableSizes
                ? item.availableSizes.split(",").map((s) => s.trim())
                : [item.size];

              const sizeSelect = (
                <select
                  value={item.size}
                  onChange={(e) => setSize(item.productId, item.size, e.target.value)}
                  className="w-fit border border-line-strong bg-paper px-2 py-1.5 font-mono-data text-xs text-ink focus:border-ink focus:outline-none"
                >
                  {sizeOptions.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              );

              const qtyStepper = (
                <div className="flex w-fit items-center border border-line-strong text-ink-muted">
                  <button
                    onClick={() => setQuantity(item.productId, item.size, item.quantity - 1)}
                    className="px-2 py-1 font-mono-data hover:text-ink"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="min-w-[2ch] px-1 text-center font-mono-data text-sm text-ink">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(item.productId, item.size, item.quantity + 1)}
                    className="px-2 py-1 font-mono-data hover:text-ink"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              );

              return (
                <div
                  key={`${item.productId}-${item.size}`}
                  className="border-b border-line-strong px-4 py-4 last:border-b-0"
                >
                  {/* Mobile: stacked card. Hidden at sm and up. */}
                  <div className="sm:hidden">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link
                          href={`/product/${item.slug}`}
                          className="font-display text-sm font-bold uppercase text-ink hover:text-ink-muted"
                        >
                          {item.name}
                        </Link>
                        <p className="font-mono-data text-[11px] text-ink-muted">{item.colorway}</p>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId, item.size)}
                        aria-label="Remove"
                        className="shrink-0 font-mono-data text-base text-rust"
                      >
                        ×
                      </button>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {sizeSelect}
                        {qtyStepper}
                      </div>
                      <span className="font-mono-data text-sm text-ink">
                        {formatPrice(item.unitPriceCents * item.quantity)}
                      </span>
                    </div>
                  </div>

                  {/* sm and up: table row grid. */}
                  <div className="hidden sm:grid sm:grid-cols-[2fr_1fr_1fr_1fr_auto] sm:items-center sm:gap-4">
                    <div>
                      <Link
                        href={`/product/${item.slug}`}
                        className="font-display text-sm font-bold uppercase text-ink hover:text-ink-muted"
                      >
                        {item.name}
                      </Link>
                      <p className="font-mono-data text-[11px] text-ink-muted">{item.colorway}</p>
                    </div>
                    {sizeSelect}
                    {qtyStepper}
                    <span className="font-mono-data text-sm text-ink">
                      {formatPrice(item.unitPriceCents * item.quantity)}
                    </span>
                    <button
                      onClick={() => removeItem(item.productId, item.size)}
                      className="justify-self-end font-mono-data text-[11px] tracking-[0.1em] text-rust hover:underline"
                    >
                      ×
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 border border-line-strong">
            <button
              type="button"
              onClick={() => setLimitedRunOpen((v) => !v)}
              className="flex w-full items-center justify-between px-4 py-3 font-mono-data text-xs tracking-[0.1em] text-ink"
            >
              {t.cart.limitedRunTitle}
              <span>{limitedRunOpen ? "−" : "+"}</span>
            </button>
            {limitedRunOpen && (
              <p className="border-t border-line px-4 py-3 font-body text-xs leading-relaxed text-ink-muted">
                {t.cart.limitedRunBody}
              </p>
            )}
          </div>

          <form onSubmit={handlePromoSubmit} className="mt-4">
            <p className="mb-1.5 font-mono-data text-[11px] tracking-[0.1em] text-ink-muted">
              {t.cart.promoLabel}
            </p>
            <div className="flex gap-0">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder={t.cart.promoPlaceholder}
                className="w-full min-w-0 border border-line-strong bg-paper px-3 py-2.5 font-mono-data text-xs text-ink placeholder:text-ink-muted/50 focus:border-ink focus:outline-none"
              />
              <button
                type="submit"
                className="shrink-0 border border-l-0 border-ink bg-ink px-5 py-2.5 font-mono-data text-xs tracking-[0.1em] text-paper transition hover:bg-amber hover:text-ink"
              >
                {t.cart.promoApply}
              </button>
            </div>
            {promoMessage && (
              <p className="mt-1.5 font-mono-data text-[11px] text-ink-muted">{promoMessage}</p>
            )}
          </form>
        </div>

        <div className="h-fit border border-line-strong bg-bg-raised p-5">
          <div className="space-y-2 font-mono-data text-sm text-ink">
            <div className="flex justify-between">
              <span className="text-ink-muted">{t.cart.subtotal}</span>
              <span>{formatPrice(subtotalCents)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink-muted">{t.cart.shipping}</span>
              <span>{shippingCents === 0 ? t.cart.freeShipping : formatPrice(shippingCents)}</span>
            </div>
          </div>
          <div className="dashed-line mt-4 flex justify-between pt-4 font-mono-data text-base font-bold text-ink">
            <span>{t.cart.estimatedTotal}</span>
            <span>{formatPrice(estimatedTotalCents)}</span>
          </div>
          <p className="mt-1 font-mono-data text-[10px] text-ink-muted">{t.cart.taxIncluded}</p>

          <Link
            href="/checkout"
            className="mt-5 flex w-full items-center justify-center gap-2 border border-ink bg-ink px-6 py-4 text-center font-mono-data text-xs tracking-[0.15em] text-paper transition hover:bg-amber hover:border-amber hover:text-ink"
          >
            <svg width="13" height="13" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="4.5" y="8" width="9" height="7" rx="1" />
              <path d="M6.5 8V6a2.5 2.5 0 0 1 5 0v2" />
            </svg>
            {t.cart.checkout}
          </Link>

          <p className="mt-4 text-center font-mono-data text-[10px] tracking-[0.1em] text-ink-muted">
            VISA &nbsp;·&nbsp; MASTERCARD &nbsp;·&nbsp; VERVE &nbsp;·&nbsp; PAYSTACK
          </p>
        </div>
      </div>
    </div>
  );
}
