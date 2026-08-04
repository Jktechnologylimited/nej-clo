"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteCollectionButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    if (!confirm(`Delete "${name}"? This can't be undone.`)) return;
    setPending(true);
    try {
      const res = await fetch(`/api/admin/collections?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      router.refresh();
    } catch {
      alert("Couldn't delete that collection.");
      setPending(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={pending}
      className="font-mono-data text-[11px] tracking-[0.1em] text-rust hover:underline disabled:opacity-50"
    >
      {pending ? "…" : "DELETE"}
    </button>
  );
}
