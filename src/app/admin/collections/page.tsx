import Link from "next/link";
import { getAllCollections, getCollectionProductCounts } from "@/lib/collections";
import { DeleteCollectionButton } from "./DeleteCollectionButton";

export default async function AdminCollectionsPage() {
  const [collectionList, counts] = await Promise.all([
    getAllCollections(),
    getCollectionProductCounts(),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono-data text-[11px] tracking-[0.2em] text-paper/40">
            ADMIN
          </p>
          <h1 className="mt-1 font-display text-3xl font-extrabold uppercase tracking-tight text-paper">
            Collections
          </h1>
        </div>
        <Link
          href="/admin/collections/new"
          className="border border-paper bg-paper px-5 py-2.5 font-mono-data text-xs tracking-[0.15em] text-ink transition hover:bg-amber hover:border-amber"
        >
          + NEW COLLECTION
        </Link>
      </div>

      {collectionList.length === 0 ? (
        <p className="mt-10 border border-dashed border-line-strong px-6 py-10 text-center font-mono-data text-xs text-paper/50">
          NO COLLECTIONS YET.
        </p>
      ) : (
        <div className="mt-8 divide-y divide-line border border-line">
          {collectionList.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between gap-4 px-5 py-4"
            >
              <div>
                <p className="font-display text-sm font-bold uppercase text-paper">
                  {c.name}
                </p>
                <p className="mt-1 font-mono-data text-[11px] text-paper/40">
                  /{c.slug} — {counts.get(c.id) ?? 0} products
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  href={`/collections/${c.slug}`}
                  target="_blank"
                  className="font-mono-data text-[11px] tracking-[0.1em] text-paper/60 hover:text-amber"
                >
                  VIEW
                </Link>
                <Link
                  href={`/admin/collections/${c.id}/edit`}
                  className="font-mono-data text-[11px] tracking-[0.1em] text-paper/60 hover:text-amber"
                >
                  EDIT
                </Link>
                <DeleteCollectionButton id={c.id} name={c.name} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
