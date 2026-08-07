"use client";

import { useRef, useState } from "react";

const MAX_DIMENSION = 1200;
const JPEG_QUALITY = 0.82;
const MAX_DATA_URL_LENGTH = 2_000_000; // ~1.5MB of actual image data after base64 overhead

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
      const dataUrl = await downscaleImage(file, MAX_DIMENSION, JPEG_QUALITY);
      if (dataUrl.length > MAX_DATA_URL_LENGTH) {
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
      <span className="mb-1.5 block font-mono-data text-[11px] tracking-[0.1em] text-paper/40">
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
            className="absolute right-2 top-2 border border-line-strong bg-bg px-2 py-1 font-mono-data text-[10px] tracking-[0.05em] text-paper/70 transition hover:border-rust hover:text-rust"
          >
            REMOVE
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={processing}
          className="w-full border border-dashed border-line-strong px-4 py-10 text-center font-mono-data text-xs tracking-[0.1em] text-paper/40 transition hover:border-amber hover:text-amber disabled:opacity-50"
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
          e.target.value = ""; // allow re-selecting the same file later
        }}
      />

      {error && (
        <p className="mt-1.5 font-mono-data text-[10px] text-rust">{error}</p>
      )}
    </div>
  );
}

function downscaleImage(
  file: File,
  maxDimension: number,
  quality: number,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Couldn't read the file."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Couldn't decode that image."));
      img.onload = () => {
        let { width, height } = img;
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height / width) * maxDimension);
            width = maxDimension;
          } else {
            width = Math.round((width / height) * maxDimension);
            height = maxDimension;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas isn't supported here."));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
