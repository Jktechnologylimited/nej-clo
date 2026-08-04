export function StampBadge({
  status,
  label,
}: {
  status: string;
  label: string;
}) {
  if (status === "available") return null;

  const color =
    status === "sold_out"
      ? "text-rust"
      : status === "restocked"
        ? "text-amber"
        : "text-paper";

  return (
    <span className={`stamp text-[10px] font-bold ${color}`}>
      {label.toUpperCase()}
    </span>
  );
}
