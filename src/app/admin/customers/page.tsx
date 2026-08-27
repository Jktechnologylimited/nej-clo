import { getAllUsers, getUserOrderCounts } from "@/lib/users";

export default async function AdminCustomersPage() {
  const [users, orderCounts] = await Promise.all([getAllUsers(), getUserOrderCounts()]);

  const dateFmt = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="mx-auto max-w-4xl px-5 py-14 sm:px-8 sm:py-20">
      <p className="font-mono-data text-[11px] tracking-[0.2em] text-ink-muted">ADMIN</p>
      <h1 className="mt-1 font-display text-3xl font-extrabold uppercase tracking-tight text-ink">
        Customers
      </h1>
      <p className="mt-2 font-mono-data text-xs text-ink-muted">
        {users.length} registered account{users.length === 1 ? "" : "s"}
      </p>

      {users.length === 0 ? (
        <p className="mt-10 border border-dashed border-line-strong px-6 py-10 text-center font-mono-data text-xs text-ink-muted">
          NO ACCOUNTS YET.
        </p>
      ) : (
        <div className="mt-8 divide-y divide-line border border-line">
          {users.map((u) => (
            <div key={u.id} className="flex items-center justify-between gap-4 px-5 py-4">
              <div className="min-w-0 flex-1">
                <p className="truncate font-mono-data text-xs text-ink">
                  {u.name}
                  {u.role === "admin" && (
                    <span className="ml-2 border border-amber px-1.5 py-0.5 text-[9px] tracking-[0.1em] text-amber">
                      ADMIN
                    </span>
                  )}
                </p>
                <p className="mt-1 truncate font-mono-data text-[11px] text-ink-muted">
                  {u.email} · joined {dateFmt(u.createdAt)}
                </p>
              </div>
              <p className="shrink-0 font-mono-data text-xs text-ink-muted">
                {orderCounts.get(u.id) ?? 0} order{(orderCounts.get(u.id) ?? 0) === 1 ? "" : "s"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
