"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { prepareBranding, type Branding } from "@/lib/branding-image";

export function BrandingForm({ initial }: { initial: Branding | null }) {
  const router = useRouter();
  const [branding, setBranding] = useState(initial);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  async function upload(file: File) {
    setBusy(true);
    setMessage("");
    try {
      const images = await prepareBranding(file);
      const response = await fetch("/api/admin/branding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logo: images.logo }),
      });
      if (!response.ok) throw new Error("Couldn't save your logo. Please try again.");
      const saved: Branding & { faviconUrl: string } = await response.json();
      setBranding(saved);
      // Refresh the current tab immediately; metadata supplies the same icon
      // for subsequent page loads and visitors, without a stale favicon URL.
      document.querySelectorAll('link[rel="icon"]').forEach((link) => link.remove());
      const icon = document.createElement("link");
      icon.rel = "icon";
      icon.type = "image/png";
      icon.href = saved.faviconUrl;
      document.head.appendChild(icon);
      setMessage("Logo and favicon updated.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Couldn't process that image.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="mt-8 space-y-4 border border-line-strong p-5" aria-labelledby="branding-heading">
      <h2 id="branding-heading" className="font-mono-data text-sm tracking-wider">LOGO &amp; FAVICON</h2>
      <p className="text-sm text-ink/60">Upload a logo to update the site and browser tab immediately. PNG, JPEG, or WebP, up to 10 MB. Transparent, square logos work best for the favicon.</p>
      {branding && (
        <div className="flex items-center gap-6">
          {/* eslint-disable-next-line @next/next/no-img-element -- uploaded PNG data URL */}
          <img src={branding.logo} alt="Current site logo" className="max-h-20 max-w-48 object-contain" />
          {/* eslint-disable-next-line @next/next/no-img-element -- favicon preview */}
          <img src={branding.favicon} alt="Browser tab icon preview" width={32} height={32} />
        </div>
      )}
      <label className="block text-sm">
        <span className="mb-2 block">{busy ? "Uploading…" : "Choose a logo (saves automatically)"}</span>
        <input type="file" accept="image/png,image/jpeg,image/webp" disabled={busy}
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) void upload(file);
            event.target.value = "";
          }} className="block w-full text-sm disabled:opacity-50" />
      </label>
      <p role="status" aria-live="polite" className="text-sm text-amber">{message}</p>
    </section>
  );
}
