import Link from "next/link";
import { getSession } from "@/lib/auth/session";

export default async function AdminHome() {
  const session = await getSession();

  return (
    <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
      <p className="font-mono-data text-[11px] tracking-[0.2em] text-ink/40">
        ADMIN — {session?.email.toUpperCase()}
      </p>
      <h1 className="mt-1 font-display text-3xl font-extrabold uppercase tracking-tight text-ink">
        Control room
      </h1>

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
