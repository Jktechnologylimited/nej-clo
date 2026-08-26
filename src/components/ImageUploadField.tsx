"use client";

import { useRef, useState } from "react";
import {
  downscaleImage,
  MAX_IMAGE_DATA_URL_LENGTH,
} from "@/lib/image-downscale";

export function ImageUploadField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string | null;
  onChange: (dataUrl: string | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  async function handleFile(file: File) {
    setError(null);
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file.");
      return;
    }
    setProcessing(true);
    try {
      const dataUrl = await downscaleImage(file);
      if (dataUrl.length > MAX_IMAGE_DATA_URL_LENGTH) {
        setError("Image is too large even after compression — try a smaller photo.");
        return;
      }
      onChange(dataUrl);
    } catch {
      setError("Couldn't process that image — try a different file.");
    } finally {
      setProcessing(false);
    }
  }

  return (
    <div>
      <span className="mb-1.5 block font-mono-data text-[11px] tracking-[0.1em] text-ink-muted">
        {label}
      </span>

      {value ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary uploaded data: URL, not a static/remote asset next/image can optimize */}
          <img
            src={value}
            alt=""
            className="max-h-56 w-full border border-line-strong object-cover"
          />
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute right-2 top-2 border border-line-strong bg-paper px-2 py-1 font-mono-data text-[10px] tracking-[0.05em] text-ink-muted transition hover:border-rust hover:text-rust"
          >
            REMOVE
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={processing}
          className="w-full border border-dashed border-line-strong px-4 py-10 text-center font-mono-data text-xs tracking-[0.1em] text-ink-muted transition hover:border-ink hover:text-ink disabled:opacity-50"
        >
          {processing ? "PROCESSING…" : "CLICK TO UPLOAD IMAGE"}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {error && (
        <p className="mt-1.5 font-mono-data text-[10px] text-rust">{error}</p>
      )}
    </div>
  );
}
