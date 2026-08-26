"use client";

import { useRef, useState } from "react";
import {
  downscaleImage,
  MAX_IMAGE_DATA_URL_LENGTH,
} from "@/lib/image-downscale";

const MAX_IMAGES = 6;

export function MultiImageUploadField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string[];
  onChange: (urls: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  async function handleFiles(files: FileList) {
    setError(null);
    const remaining = MAX_IMAGES - value.length;
    if (remaining <= 0) {
      setError(`Up to ${MAX_IMAGES} photos per product.`);
      return;
    }

    const toProcess = Array.from(files).slice(0, remaining);
    setProcessing(true);
    try {
      const results: string[] = [];
      for (const file of toProcess) {
        if (!file.type.startsWith("image/")) continue;
        const dataUrl = await downscaleImage(file);
        if (dataUrl.length > MAX_IMAGE_DATA_URL_LENGTH) {
          setError("One of those images was too large even after compression — skipped.");
          continue;
        }
        results.push(dataUrl);
      }
      if (results.length > 0) onChange([...value, ...results]);
    } catch {
      setError("Couldn't process one of those images — try again.");
    } finally {
      setProcessing(false);
    }
  }

  function remove(index: number) {
    onChange(value.filter((_, i) => i !== index));
  }

  function makePrimary(index: number) {
    if (index === 0) return;
    const next = [...value];
    const [item] = next.splice(index, 1);
    next.unshift(item);
    onChange(next);
  }

  return (
    <div>
      <span className="mb-1.5 block font-mono-data text-[11px] tracking-[0.1em] text-ink-muted">
        {label} ({value.length}/{MAX_IMAGES})
      </span>

      {value.length > 0 && (
        <div className="mb-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
          {value.map((url, i) => (
            <div key={i} className="group relative aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element -- arbitrary uploaded data: URL, not a static/remote asset next/image can optimize */}
              <img
                src={url}
                alt=""
                className={`h-full w-full border object-cover ${i === 0 ? "border-ink" : "border-line-strong"}`}
              />
              {i === 0 && (
                <span className="absolute left-1 top-1 bg-ink px-1 py-0.5 font-mono-data text-[8px] text-paper">
                  MAIN
                </span>
              )}
              <div className="absolute inset-0 flex items-center justify-center gap-1 bg-ink/0 opacity-0 transition group-hover:bg-ink/40 group-hover:opacity-100">
                {i !== 0 && (
                  <button
                    type="button"
                    onClick={() => makePrimary(i)}
                    title="Make main photo"
                    className="flex h-6 w-6 items-center justify-center bg-paper font-mono-data text-[10px] text-ink"
                  >
                    ★
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => remove(i)}
                  title="Remove"
                  className="flex h-6 w-6 items-center justify-center bg-paper font-mono-data text-[10px] text-rust"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {value.length < MAX_IMAGES && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={processing}
          className="w-full border border-dashed border-line-strong px-4 py-6 text-center font-mono-data text-xs tracking-[0.1em] text-ink-muted transition hover:border-ink hover:text-ink disabled:opacity-50"
        >
          {processing ? "PROCESSING…" : "+ ADD PHOTOS"}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files?.length) handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {error && (
        <p className="mt-1.5 font-mono-data text-[10px] text-rust">{error}</p>
      )}
    </div>
  );
}
