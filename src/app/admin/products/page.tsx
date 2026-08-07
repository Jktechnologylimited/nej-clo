import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { formatPrice } from "@/lib/currency";

export default async function AdminProductsPage() {
  const productList = await getAllProducts();

  return (
    <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
      <p className="font-mono-data text-[11px] tracking-[0.2em] text-paper/40">
        ADMIN
      </p>
      <h1 className="mt-1 font-display text-3xl font-extrabold uppercase tracking-tight text-paper">
        Products
      </h1>

      <div className="mt-8 divide-y divide-line border border-line">
        {productList.map((p) => (
          <Link
            key={p.id}
            href={`/admin/products/${p.id}/edit`}
            className="flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-bg-raised"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate font-display text-sm font-bold uppercase text-paper">
                {p.name} <span className="text-paper/40">— {p.colorway}</span>
              </p>
              <p className="mt-1 truncate font-mono-data text-[11px] text-paper/40">
                {p.sku} · {p.dropCode} · {p.stock} in stock · {p.status.toUpperCase()}
              </p>
            </div>
            <p className="shrink-0 font-mono-data text-sm text-paper">
              {formatPrice(p.priceCents)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
