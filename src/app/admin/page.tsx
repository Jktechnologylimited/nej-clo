import Link from "next/link";
import { getSession } from "@/lib/auth/session";

export default async function AdminHome() {
  const session = await getSession();

  return (
    <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
      <p className="font-mono-data text-[11px] tracking-[0.2em] text-paper/40">
        ADMIN — {session?.email.toUpperCase()}
      </p>
      <h1 className="mt-1 font-display text-3xl font-extrabold uppercase tracking-tight text-paper">
        Control room
      </h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/products"
          className="border border-line-strong bg-bg-raised p-6 transition hover:border-amber"
        >
          <p className="font-mono-data text-[11px] tracking-[0.15em] text-paper/40">
            MANAGE
          </p>
          <h2 className="mt-2 font-display text-xl font-extrabold uppercase text-paper">
            Products
          </h2>
          <p className="mt-2 text-sm text-paper/50">
            Edit price (in Naira), stock, status, and details for every product.
          </p>
        </Link>

        <Link
          href="/admin/collections"
          className="border border-line-strong bg-bg-raised p-6 transition hover:border-amber"
        >
          <p className="font-mono-data text-[11px] tracking-[0.15em] text-paper/40">
            MANAGE
          </p>
          <h2 className="mt-2 font-display text-xl font-extrabold uppercase text-paper">
            Collections
          </h2>
          <p className="mt-2 text-sm text-paper/50">
            Create collections and choose which products sit in each one.
          </p>
        </Link>

        <Link
          href="/admin/content"
          className="border border-line-strong bg-bg-raised p-6 transition hover:border-amber"
        >
          <p className="font-mono-data text-[11px] tracking-[0.15em] text-paper/40">
            MANAGE
          </p>
          <h2 className="mt-2 font-display text-xl font-extrabold uppercase text-paper">
            Site content
          </h2>
          <p className="mt-2 text-sm text-paper/50">
            Edit the hero copy, manifesto blurbs, and footer description shown on the site.
          </p>
        </Link>
      </div>
    </div>
  );
}
