import { getAllSubscribers } from "@/lib/subscribers";

export default async function AdminSubscribersPage() {
  const subscribers = await getAllSubscribers();
  const activeCount = subscribers.filter((s) => s.subscribed).length;

  const dateFmt = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
      <p className="font-mono-data text-[11px] tracking-[0.2em] text-ink-muted">ADMIN</p>
      <h1 className="mt-1 font-display text-3xl font-extrabold uppercase tracking-tight text-ink">
        Subscribers
      </h1>
      <p className="mt-2 font-mono-data text-xs text-ink-muted">
        {activeCount} active · {subscribers.length - activeCount} unsubscribed
      </p>

      {subscribers.length === 0 ? (
        <p className="mt-10 border border-dashed border-line-strong px-6 py-10 text-center font-mono-data text-xs text-ink-muted">
          NO SUBSCRIBERS YET.
        </p>
      ) : (
        <div className="mt-8 divide-y divide-line border border-line">
          {subscribers.map((s) => (
            <div key={s.id} className="flex items-center justify-between gap-4 px-5 py-4">
              <p className="min-w-0 flex-1 truncate font-mono-data text-xs text-ink">{s.email}</p>
              <div className="flex shrink-0 items-center gap-3">
                <span className="font-mono-data text-[11px] text-ink-muted">
                  {dateFmt(s.createdAt)}
                </span>
                <span
                  className={`px-1.5 py-0.5 text-[9px] tracking-[0.1em] ${
                    s.subscribed ? "border border-amber text-amber" : "border border-line-strong text-ink-muted"
                  }`}
                >
                  {s.subscribed ? "ACTIVE" : "UNSUBSCRIBED"}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
