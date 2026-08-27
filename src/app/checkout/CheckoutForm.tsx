"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/components/CartProvider";
import { useI18n } from "@/components/I18nProvider";
import { calculateShippingCents } from "@/lib/shipping";

const inputClass =
  "w-full border border-line-strong bg-transparent px-3 py-2.5 font-mono-data text-sm text-ink placeholder:text-ink/30 focus:border-amber focus:outline-none";

export function CheckoutForm({ paystackEnabled }: { paystackEnabled: boolean }) {
  const { items, subtotalCents, clear } = useCart();
  const { t, formatPrice, currency } = useI18n();
  const router = useRouter();
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get("payment");

  const [city, setCity] = useState("");
  const shippingCents = calculateShippingCents(subtotalCents, city);
  const totalCents = subtotalCents + shippingCents;

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      addressLine1: form.get("addressLine1"),
      addressLine2: form.get("addressLine2"),
      city: form.get("city"),
      postalCode: form.get("postalCode"),
      country: form.get("country"),
      items,
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");

      if (data.authorizationUrl) {
        // Paystack hosted checkout — cart clears once payment is verified
        // and the customer lands back on the confirmation page.
        window.location.href = data.authorizationUrl;
        return;
      }

      clear();
      router.push(`/checkout/confirmed/${data.orderNumber}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8">
        <h1 className="font-display text-2xl font-extrabold uppercase text-ink">
          {t.checkout.empty}
        </h1>
        <Link
          href="/shop"
          className="mt-6 inline-block border border-paper px-6 py-3 font-mono-data text-xs tracking-[0.15em] text-ink transition hover:bg-amber hover:border-amber hover:text-bg"
        >
          {t.hero.viewStock}
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8 sm:py-14">
      <p className="font-mono-data text-[11px] tracking-[0.2em] text-ink/40">
        {t.checkout.eyebrow}
      </p>
      <h1 className="mt-1 font-display text-3xl font-extrabold uppercase tracking-tight text-ink">
        {t.checkout.title}
      </h1>

      {paymentStatus === "failed" && (
        <p className="mt-4 border border-rust bg-rust/10 px-3 py-2 font-mono-data text-xs text-rust">
          {t.checkout.paymentFailed}
        </p>
      )}
      {paymentStatus === "error" && (
        <p className="mt-4 border border-rust bg-rust/10 px-3 py-2 font-mono-data text-xs text-rust">
          {t.checkout.paymentError}
        </p>
      )}

      <div className="mt-8 grid gap-10 lg:grid-cols-[1.3fr_1fr]">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block font-mono-data text-[11px] tracking-[0.1em] text-ink/40">
                {t.checkout.fullName}
              </span>
              <input name="name" required className={inputClass} />
            </label>
            <label className="block">
              <span className="mb-1.5 block font-mono-data text-[11px] tracking-[0.1em] text-ink/40">
                {t.checkout.email}
              </span>
              <input type="email" name="email" required className={inputClass} />
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block font-mono-data text-[11px] tracking-[0.1em] text-ink/40">
              {t.checkout.addressLine1}
            </span>
            <input name="addressLine1" required className={inputClass} />
          </label>

          <label className="block">
            <span className="mb-1.5 block font-mono-data text-[11px] tracking-[0.1em] text-ink/40">
              {t.checkout.addressLine2}
            </span>
            <input name="addressLine2" className={inputClass} />
          </label>

          <div className="grid gap-4 sm:grid-cols-3">
            <label className="block">
              <span className="mb-1.5 block font-mono-data text-[11px] tracking-[0.1em] text-ink/40">
                {t.checkout.city}
              </span>
              <input
                name="city"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={inputClass}
              />
              <span className="mt-1.5 block font-mono-data text-[10px] text-ink/40">
                {t.cart.calabarFreeShippingNote}
              </span>
            </label>
            <label className="block">
              <span className="mb-1.5 block font-mono-data text-[11px] tracking-[0.1em] text-ink/40">
                {t.checkout.postcode}
              </span>
              <input name="postalCode" required className={inputClass} />
            </label>
            <label className="block">
              <span className="mb-1.5 block font-mono-data text-[11px] tracking-[0.1em] text-ink/40">
                {t.checkout.country}
              </span>
              <input name="country" required className={inputClass} />
            </label>
          </div>

          {error && (
            <p className="border border-rust bg-rust/10 px-3 py-2 font-mono-data text-xs text-rust">
              {error}
            </p>
          )}

          {currency !== "NGN" && (
            <p className="font-mono-data text-[11px] leading-relaxed text-ink/40">
              {t.checkout.currencyNote}
            </p>
          )}

          <p className="font-mono-data text-[11px] leading-relaxed text-ink/40">
            {paystackEnabled ? t.checkout.securePayment : t.checkout.noPayment}
          </p>

          <button
            type="submit"
            disabled={submitting}
            className="w-full border border-paper bg-paper px-6 py-4 text-center font-mono-data text-xs tracking-[0.15em] text-ink transition hover:bg-amber hover:border-amber hover:text-bg disabled:opacity-50"
          >
            {submitting ? t.checkout.submitting : t.checkout.confirm(formatPrice(totalCents))}
          </button>
        </form>

        <div className="h-fit border border-line-strong bg-bg-raised p-5">
          <p className="mb-4 font-mono-data text-[11px] tracking-[0.15em] text-ink/40">
            {t.checkout.orderSummary}
          </p>
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={`${item.productId}-${item.size}`}
                className="flex justify-between gap-2 font-mono-data text-xs text-ink/70"
              >
                <span className="min-w-0 truncate">
                  {item.name} — {item.size} × {item.quantity}
                </span>
                <span className="shrink-0">{formatPrice(item.unitPriceCents * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t border-dashed border-line-strong pt-4 font-mono-data text-xs text-ink">
            <div className="flex justify-between">
              <span className="text-ink/50">{t.cart.subtotal}</span>
              <span>{formatPrice(subtotalCents)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-ink/50">{t.cart.shipping}</span>
              <span>{shippingCents === 0 ? t.cart.freeShipping : formatPrice(shippingCents)}</span>
            </div>
          </div>
          <div className="mt-3 flex justify-between border-t border-dashed border-line-strong pt-3 font-mono-data text-sm font-bold text-ink">
            <span>{t.checkout.total}</span>
            <span>{formatPrice(totalCents)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
