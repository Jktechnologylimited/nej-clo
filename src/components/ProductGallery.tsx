"use client";

import { useState } from "react";
import { GarmentIcon } from "./GarmentIcon";
import { StampBadge } from "./StampBadge";

export function ProductGallery({
  images,
  category,
  colorway,
  swatchColor,
  productName,
  status,
  statusLabel,
}: {
  images: string[];
  category: string;
  colorway: string;
  swatchColor: string;
  productName: string;
  status: string;
  statusLabel: string;
}) {
  const [active, setActive] = useState(0);
  const soldOut = status === "sold_out";
  const hasImages = images.length > 0;
  const hasMultiple = images.length > 1;

  function prev() {
    setActive((i) => (i - 1 + images.length) % images.length);
  }
  function next() {
    setActive((i) => (i + 1) % images.length);
  }

  return (
    <div className="flex gap-3">
      {hasMultiple && (
        <div className="hidden flex-col gap-2 sm:flex">
          {images.map((src, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={`h-16 w-16 shrink-0 overflow-hidden border transition ${
                active === i ? "border-ink" : "border-line-strong hover:border-ink/50"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- stored as a data: URL, next/image doesn't optimize those */}
              <img src={src} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <div
        className="relative flex aspect-[4/5] flex-1 items-center justify-center overflow-hidden border border-line-strong"
        style={{ backgroundColor: swatchColor }}
      >
        {status !== "available" && (
          <div className="absolute left-4 top-4 z-10">
            <StampBadge status={status} label={statusLabel} />
          </div>
        )}

        {hasMultiple && (
          <span className="absolute right-3 top-3 z-10 bg-ink/80 px-2 py-1 font-mono-data text-[10px] text-paper sm:hidden">
            {active + 1}/{images.length}
          </span>
        )}

        {hasImages ? (
          // eslint-disable-next-line @next/next/no-img-element -- stored as a data: URL, next/image doesn't optimize those
          <img
            src={images[active]}
            alt={productName}
            className={`h-full w-full object-cover ${soldOut ? "opacity-40" : ""}`}
          />
        ) : (
          <GarmentIcon
            category={category}
            className={`h-40 w-40 ${
              colorway === "Bone" || colorway === "Amber" ? "text-ink/70" : "text-ink/85"
            } ${soldOut ? "opacity-40" : ""}`}
          />
        )}

        {hasMultiple && (
          <div className="sm:hidden">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous image"
              className="absolute left-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center bg-paper/90 text-ink"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M9 2 4 7l5 5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next image"
              className="absolute right-2 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center bg-paper/90 text-ink"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M5 2l5 5-5 5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
