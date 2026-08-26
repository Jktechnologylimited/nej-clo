"use client";

import { useState } from "react";

export function ProductTabs({
  tabs,
}: {
  tabs: { label: string; content: string }[];
}) {
  const [active, setActive] = useState(0);

  return (
    <div>
      <div className="flex gap-6 overflow-x-auto border-b border-line">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            type="button"
            onClick={() => setActive(i)}
            className={`shrink-0 whitespace-nowrap border-b-2 pb-3 font-mono-data text-xs tracking-[0.1em] transition ${
              active === i
                ? "border-ink text-ink"
                : "border-transparent text-ink-muted hover:text-ink"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <p className="max-w-2xl pt-6 font-body text-sm leading-relaxed text-ink-muted">
        {tabs[active].content}
      </p>
    </div>
  );
}
