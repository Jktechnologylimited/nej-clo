const MESSAGE =
  "NO FIXED SCHEDULE — DROPS ARE ANNOUNCED, NOT ADVERTISED — LIMITED RUN, NO RESTOCK GUARANTEED — MADE FOR THE DOCK, NOT THE SHOWROOM — ";

export function Ticker() {
  const track = MESSAGE.repeat(2);
  return (
    <div className="overflow-hidden border-b border-line bg-amber text-ink">
      <div className="ticker-track flex w-max whitespace-nowrap py-1.5 font-mono-data text-[11px] tracking-[0.15em]">
        <span className="px-4">{track}</span>
        <span className="px-4" aria-hidden="true">
          {track}
        </span>
      </div>
    </div>
  );
}
