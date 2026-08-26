export function StampBadge({
  status,
  label,
}: {
  status: string;
  label: string;
}) {
  const styles =
    status === "sold_out"
      ? "bg-ink text-paper"
      : status === "restocked" || status === "limited"
        ? "bg-amber text-ink"
        : "bg-paper text-ink";

  return (
    <span
      className={`inline-block px-2 py-1 font-mono-data text-[10px] font-bold tracking-[0.05em] ${styles}`}
    >
      {label.toUpperCase()}
    </span>
  );
}
