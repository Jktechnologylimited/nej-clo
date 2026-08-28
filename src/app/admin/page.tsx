import Link from "next/link";
import { getSession } from "@/lib/auth/session";
import { isPaystackConfigured } from "@/lib/paystack";

export default async function AdminHome() {
  const session = await getSession();
  const paystackOn = isPaystackConfigured();
  const resendOn = !!process.env.RESEND_API_KEY;
  const orderNotifyOn = !!(process.env.ORDER_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL);

  return (
    <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
      <p className="font-mono-data text-[11px] tracking-[0.2em] text-ink/40">
        ADMIN — {session?.email.toUpperCase()}
      </p>
      <h1 className="mt-1 font-display text-3xl font-extrabold uppercase tracking-tight text-ink">
        Control room
      </h1>

      {(!paystackOn || !resendOn) && (
        <div className="mt-6 border border-rust bg-rust/10 p-4">
          <p className="font-mono-data text-xs font-bold tracking-[0.1em] text-rust">
            ⚠ SETUP NEEDED
          </p>
          <ul className="mt-2 space-y-1 font-mono-data text-xs text-ink">
            {!paystackOn && (
              <li>
                <strong className="text-rust">Payments are OFF.</strong> No <code>PAYSTACK_SECRET_KEY</code> set —
                checkout just logs orders with no way to actually pay. Get a key from{" "}
                <a
                  href="https://dashboard.paystack.com/#/settings/developer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  dashboard.paystack.com
                </a>{" "}
                and set it in your hosting provider&apos;s environment variables, then redeploy.
              </li>
            )}
            {!resendOn && (
              <li>
                <strong className="text-rust">Emails are OFF.</strong> No <code>RESEND_API_KEY</code> set — order
                confirmations, new-order alerts, and welcome emails aren&apos;t sending.
              </li>
            )}
          </ul>
        </div>
      )}

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="border border-line-strong p-3">
          <p className="font-mono-data text-[10px] tracking-[0.1em] text-ink/40">PAYMENTS</p>
          <p className={`mt-1 font-mono-data text-xs font-bold ${paystackOn ? "text-amber" : "text-rust"}`}>
            {paystackOn ? "● PAYSTACK CONNECTED" : "○ NOT CONNECTED"}
          </p>
        </div>
        <div className="border border-line-strong p-3">
          <p className="font-mono-data text-[10px] tracking-[0.1em] text-ink/40">EMAIL</p>
          <p className={`mt-1 font-mono-data text-xs font-bold ${resendOn ? "text-amber" : "text-rust"}`}>
            {resendOn ? "● RESEND CONNECTED" : "○ NOT CONNECTED"}
          </p>
        </div>
        <div className="border border-line-strong p-3">
          <p className="font-mono-data text-[10px] tracking-[0.1em] text-ink/40">ORDER ALERTS</p>
          <p className={`mt-1 font-mono-data text-xs font-bold ${orderNotifyOn && resendOn ? "text-amber" : "text-rust"}`}>
            {orderNotifyOn && resendOn ? "● GOING TO " + (process.env.ORDER_NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL) : "○ NOT SET UP"}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/products"
          className="border border-line-strong bg-bg-raised p-6 transition hover:border-amber"
        >
          <p className="font-mono-data text-[11px] tracking-[0.15em] text-ink/40">
            MANAGE
          </p>
          <h2 className="mt-2 font-display text-xl font-extrabold uppercase text-ink">
            Products
          </h2>
          <p className="mt-2 text-sm text-ink/50">
            Edit price (in Naira), stock, status, and details for every product.
          </p>
        </Link>

        <Link
          href="/admin/orders"
          className="border border-line-strong bg-bg-raised p-6 transition hover:border-amber"
        >
          <p className="font-mono-data text-[11px] tracking-[0.15em] text-ink/40">
            MANAGE
          </p>
          <h2 className="mt-2 font-display text-xl font-extrabold uppercase text-ink">
            Orders
          </h2>
          <p className="mt-2 text-sm text-ink/50">
            Update fulfillment status, carrier, and tracking number for every order.
          </p>
        </Link>

        <Link
          href="/admin/customers"
          className="border border-line-strong bg-bg-raised p-6 transition hover:border-amber"
        >
          <p className="font-mono-data text-[11px] tracking-[0.15em] text-ink/40">
            VIEW
          </p>
          <h2 className="mt-2 font-display text-xl font-extrabold uppercase text-ink">
            Customers
          </h2>
          <p className="mt-2 text-sm text-ink/50">
            Everyone who&apos;s created an account, with their order count.
          </p>
        </Link>

        <Link
          href="/admin/subscribers"
          className="border border-line-strong bg-bg-raised p-6 transition hover:border-amber"
        >
          <p className="font-mono-data text-[11px] tracking-[0.15em] text-ink/40">
            VIEW
          </p>
          <h2 className="mt-2 font-display text-xl font-extrabold uppercase text-ink">
            Subscribers
          </h2>
          <p className="mt-2 text-sm text-ink/50">
            Everyone signed up for drop alerts and newsletter emails.
          </p>
        </Link>

        <Link
          href="/admin/collections"
          className="border border-line-strong bg-bg-raised p-6 transition hover:border-amber"
        >
          <p className="font-mono-data text-[11px] tracking-[0.15em] text-ink/40">
            MANAGE
          </p>
          <h2 className="mt-2 font-display text-xl font-extrabold uppercase text-ink">
            Collections
          </h2>
          <p className="mt-2 text-sm text-ink/50">
            Create collections and choose which products sit in each one.
          </p>
        </Link>

        <Link
          href="/admin/content"
          className="border border-line-strong bg-bg-raised p-6 transition hover:border-amber"
        >
          <p className="font-mono-data text-[11px] tracking-[0.15em] text-ink/40">
            MANAGE
          </p>
          <h2 className="mt-2 font-display text-xl font-extrabold uppercase text-ink">
            Site content
          </h2>
          <p className="mt-2 text-sm text-ink/50">
            Edit the hero copy, manifesto blurbs, and footer description shown on the site.
          </p>
        </Link>
      </div>
    </div>
  );
}
