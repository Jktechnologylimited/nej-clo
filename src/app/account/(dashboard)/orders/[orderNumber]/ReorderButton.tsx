"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartProvider";

export type ReorderLine = {
  productId: string;
  slug: string;
  name: string;
  colorway: string;
  size: string;
  quantity: number;
  unitPriceCents: number;
};

export function ReorderButton({
  lines,
  label,
  addedLabel,
}: {
  lines: ReorderLine[];
  label: string;
  addedLabel: string;
}) {
  const { addItem } = useCart();
  const router = useRouter();
  const [added, setAdded] = useState(false);

  function handleClick() {
    for (const line of lines) addItem(line);
    setAdded(true);
    router.push("/cart");
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={lines.length === 0}
      className="border border-line-strong px-5 py-2.5 font-mono-data text-xs tracking-[0.1em] text-ink transition hover:border-ink disabled:opacity-40"
    >
      {added ? addedLabel : label}
    </button>
  );
}
