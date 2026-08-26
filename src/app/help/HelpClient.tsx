"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { useI18n } from "@/components/I18nProvider";
import { SHIPPING_FLAT_CENTS, FREE_SHIPPING_THRESHOLD_CENTS } from "@/lib/shipping";

// TODO: replace with the real support inbox before relying on this in production.
const SUPPORT_EMAIL = "support@nejclothing.com";

type TabKey = "size-guide" | "shipping" | "returns" | "care";

const TOPS_CHART = [
  { size: "XS", chest: 48, shoulder: 44, length: 68, sleeve: 20 },
  { size: "S", chest: 51, shoulder: 46, length: 70, sleeve: 21 },
  { size: "M", chest: 54, shoulder: 48, length: 72, sleeve: 22 },
  { size: "L", chest: 57, shoulder: 50, length: 74, sleeve: 23 },
  { size: "XL", chest: 60, shoulder: 52, length: 76, sleeve: 24 },
  { size: "XXL", chest: 63, shoulder: 54, length: 78, sleeve: 25 },
];

const BOTTOMS_CHART = [
  { size: "28", waist: 71, hip: 96, length: 104, inseam: 76 },
  { size: "30", waist: 76, hip: 101, length: 105, inseam: 77 },
  { size: "32", waist: 81, hip: 106, length: 106, inseam: 78 },
  { size: "34", waist: 86, hip: 111, length: 107, inseam: 79 },
  { size: "36", waist: 91, hip: 116, length: 108, inseam: 80 },
];

const CARE_ITEMS = [
  { title: "Wash cold", body: "Use cold water to preserve fabric and color." },
  { title: "Turn inside out", body: "Protect prints and embroidery before washing." },
  { title: "Do not bleach", body: "Avoid bleach and harsh chemicals." },
  { title: "Hang dry", body: "Air dry for best results. Avoid direct sunlight." },
  { title: "Iron low", body: "If needed, iron on low heat. Do not iron directly on prints." },
  { title: "Store well", body: "Fold or hang pieces in a cool, dry place." },
];

function isTabKey(v: string | null): v is TabKey {
  return v === "size-guide" || v === "shipping" || v === "returns" || v === "care";
}

export function HelpClient() {
  const { t, formatPrice } = useI18n();
  const searchParams = useSearchParams();
  const initialTab = searchParams.get("tab");
  const [tab, setTab] = useState<TabKey>(isTabKey(initialTab) ? initialTab : "size-guide");
  const [sizeCategory, setSizeCategory] = useState<"tops" | "bottoms">("tops");

  const tabs: { key: TabKey; label: string }[] = [
    { key: "size-guide", label: t.help.tabSizeGuide },
    { key: "shipping", label: t.help.tabShipping },
    { key: "returns", label: t.help.tabReturns },
    { key: "care", label: t.help.tabCare },
  ];

  const cellClass = "px-3 py-2 text-left font-mono-data text-xs";

  return (
    <div className="mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
      <h1 className="font-display text-2xl font-black uppercase tracking-tight text-ink sm:text-3xl">
        {t.help.title}
      </h1>
      <p className="mt-1 max-w-lg font-body text-sm text-ink-muted">{t.help.subtitle}</p>

      <div className="mt-8 flex gap-6 overflow-x-auto border-b border-line">
        {tabs.map((tb) => (
          <button
            key={tb.key}
            type="button"
            onClick={() => setTab(tb.key)}
            className={`shrink-0 whitespace-nowrap border-b-2 pb-3 font-mono-data text-xs tracking-[0.1em] transition ${
              tab === tb.key ? "border-ink text-ink" : "border-transparent text-ink-muted hover:text-ink"
            }`}
          >
            {tb.label}
          </button>
        ))}
      </div>

      <div className="mt-8">
        {tab === "size-guide" && (
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="font-mono-data text-[11px] tracking-[0.1em] text-ink-muted">
                {t.help.category}
              </span>
              <select
                value={sizeCategory}
                onChange={(e) => setSizeCategory(e.target.value as "tops" | "bottoms")}
                className="border border-line-strong bg-paper px-2.5 py-1.5 font-mono-data text-xs text-ink focus:border-ink focus:outline-none"
              >
                <option value="tops">Hoodies, Tees, Tracksuits, Jackets</option>
                <option value="bottoms">Cargo Pants</option>
              </select>
            </div>

            <p className="mb-3 font-mono-data text-[11px] text-ink-muted">
              All measurements in centimeters, laid flat.
            </p>

            <div className="overflow-x-auto border border-line-strong">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-line-strong bg-bg-raised">
                    <th className={cellClass}>SIZE</th>
                    {sizeCategory === "tops" ? (
                      <>
                        <th className={cellClass}>CHEST</th>
                        <th className={cellClass}>SHOULDER</th>
                        <th className={cellClass}>LENGTH</th>
                        <th className={cellClass}>SLEEVE</th>
                      </>
                    ) : (
                      <>
                        <th className={cellClass}>WAIST</th>
                        <th className={cellClass}>HIP</th>
                        <th className={cellClass}>LENGTH</th>
                        <th className={cellClass}>INSEAM</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {sizeCategory === "tops"
                    ? TOPS_CHART.map((row) => (
                        <tr key={row.size} className="border-b border-line last:border-b-0">
                          <td className={`${cellClass} font-bold text-ink`}>{row.size}</td>
                          <td className={`${cellClass} text-ink-muted`}>{row.chest}</td>
                          <td className={`${cellClass} text-ink-muted`}>{row.shoulder}</td>
                          <td className={`${cellClass} text-ink-muted`}>{row.length}</td>
                          <td className={`${cellClass} text-ink-muted`}>{row.sleeve}</td>
                        </tr>
                      ))
                    : BOTTOMS_CHART.map((row) => (
                        <tr key={row.size} className="border-b border-line last:border-b-0">
                          <td className={`${cellClass} font-bold text-ink`}>{row.size}</td>
                          <td className={`${cellClass} text-ink-muted`}>{row.waist}</td>
                          <td className={`${cellClass} text-ink-muted`}>{row.hip}</td>
                          <td className={`${cellClass} text-ink-muted`}>{row.length}</td>
                          <td className={`${cellClass} text-ink-muted`}>{row.inseam}</td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 border border-dashed border-line-strong p-4">
              <p className="font-mono-data text-[11px] font-bold tracking-[0.1em] text-ink">
                {t.help.howToMeasure}
              </p>
              <ul className="mt-2 space-y-1.5 font-body text-xs leading-relaxed text-ink-muted">
                <li>
                  <strong className="text-ink">Chest/Waist</strong> — measure around the fullest part, keeping the tape level.
                </li>
                <li>
                  <strong className="text-ink">Shoulder/Hip</strong> — measure straight across from edge to edge.
                </li>
                <li>
                  <strong className="text-ink">Length</strong> — measure from the highest point of the shoulder (or waistband) to the hem.
                </li>
                <li>
                  <strong className="text-ink">Sleeve/Inseam</strong> — measure from the shoulder seam to the cuff, or from the crotch seam to the hem.
                </li>
              </ul>
            </div>
          </div>
        )}

        {tab === "shipping" && (
          <div className="max-w-lg space-y-6 font-body text-sm leading-relaxed text-ink-muted">
            <div>
              <p className="font-mono-data text-xs font-bold tracking-[0.1em] text-ink">PROCESSING TIME</p>
              <p className="mt-1">Orders are processed within 1–2 business days before dispatch.</p>
            </div>
            <div>
              <p className="font-mono-data text-xs font-bold tracking-[0.1em] text-ink">DELIVERY TIME</p>
              <p className="mt-1">Within Nigeria: 1–3 business days after dispatch.</p>
              <p className="mt-1 font-mono-data text-[11px] text-ink-muted/70">
                We currently ship within Nigeria only.
              </p>
            </div>
            <div>
              <p className="font-mono-data text-xs font-bold tracking-[0.1em] text-ink">SHIPPING RATES</p>
              <p className="mt-1">
                Flat rate: {formatPrice(SHIPPING_FLAT_CENTS)}. Free on orders over{" "}
                {formatPrice(FREE_SHIPPING_THRESHOLD_CENTS)}.
              </p>
            </div>
          </div>
        )}

        {tab === "returns" && (
          <div className="max-w-lg space-y-6 font-body text-sm leading-relaxed text-ink-muted">
            <div>
              <p className="font-mono-data text-xs font-bold tracking-[0.1em] text-ink">14-DAY RETURN WINDOW</p>
              <p className="mt-1">
                You have 14 days from delivery to request a return or exchange.
              </p>
            </div>
            <div>
              <p className="font-mono-data text-xs font-bold tracking-[0.1em] text-ink">ELIGIBLE ITEMS</p>
              <p className="mt-1">Items must be unworn, unwashed, and with all original tags attached.</p>
            </div>
            <div>
              <p className="font-mono-data text-xs font-bold tracking-[0.1em] text-ink">HOW IT WORKS</p>
              <p className="mt-1">
                Email {SUPPORT_EMAIL} with your order number and we&apos;ll guide you through
                the next steps.
              </p>
            </div>
            <div>
              <p className="font-mono-data text-xs font-bold tracking-[0.1em] text-ink">REFUNDS</p>
              <p className="mt-1">
                Refunds are processed within 5–7 business days after we receive your
                returned item.
              </p>
            </div>
            <p className="border border-dashed border-line-strong p-4 font-mono-data text-[11px]">
              Exchanges are subject to availability — since every run is limited, a refund
              is issued if your preferred size or colour is no longer in stock.
            </p>
          </div>
        )}

        {tab === "care" && (
          <div>
            <p className="mb-6 max-w-lg font-body text-sm text-ink-muted">
              Care well. Wear longer. A few minutes of care after every wash keeps a
              piece looking right for years, not months.
            </p>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
              {CARE_ITEMS.map((item) => (
                <div key={item.title}>
                  <p className="font-mono-data text-xs font-bold tracking-[0.05em] text-ink">
                    {item.title.toUpperCase()}
                  </p>
                  <p className="mt-1 font-body text-xs leading-relaxed text-ink-muted">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div id="contact" className="scroll-mt-20 mt-14 border border-line-strong bg-bg-raised p-6">
        <p className="font-display text-base font-extrabold uppercase text-ink">
          {t.help.contactHeading}
        </p>
        <p className="mt-1 max-w-sm font-body text-sm text-ink-muted">{t.help.contactBody}</p>
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="mt-4 inline-block border border-ink bg-ink px-6 py-3 font-mono-data text-xs tracking-[0.15em] text-paper transition hover:bg-amber hover:border-amber hover:text-ink"
        >
          {t.help.contactCta}
        </a>
      </div>
    </div>
  );
}
