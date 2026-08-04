"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="border border-line-strong px-4 py-2 font-mono-data text-xs tracking-[0.1em] text-paper/70 transition hover:border-amber hover:text-amber disabled:opacity-50"
    >
      {loading ? "LOGGING OUT…" : "LOG OUT"}
    </button>
  );
}
