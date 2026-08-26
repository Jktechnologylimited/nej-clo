import Link from "next/link";

export function ComingSoon({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div className="mx-auto max-w-2xl px-5 py-24 text-center sm:px-8">
      <p className="font-mono-data text-[11px] tracking-[0.2em] text-ink-muted">
        {eyebrow}
      </p>
      <h1 className="mt-2 font-display text-3xl font-extrabold uppercase tracking-tight text-ink">
        {title}
      </h1>
      <p className="mx-auto mt-4 max-w-md font-body text-sm leading-relaxed text-ink-muted">
        {body}
      </p>
      <Link
        href="/shop"
        className="mt-8 inline-block border border-ink bg-ink px-6 py-3 font-mono-data text-xs tracking-[0.15em] text-paper transition hover:bg-amber hover:border-amber hover:text-ink"
      >
        VIEW STOCK
      </Link>
    </div>
  );
}
