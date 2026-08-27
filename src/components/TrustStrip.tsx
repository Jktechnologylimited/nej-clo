import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { SiteContentMap } from "@/lib/site-content";

const ICONS = {
  box: (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M3 7.5 11 3l8 4.5-8 4.5-8-4.5Z" strokeLinejoin="round" />
      <path d="M3 7.5V15l8 4.5 8-4.5V7.5" strokeLinejoin="round" />
      <path d="M11 12v7.5" />
    </svg>
  ),
  lock: (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="4.5" y="10" width="13" height="9" rx="1.5" />
      <path d="M7 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  ),
  shield: (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M11 2.5 18 5v6c0 5-3 8.2-7 9.5C7 19.2 4 16 4 11V5l7-2.5Z" strokeLinejoin="round" />
      <path d="m7.8 11 2.2 2.2L14.5 8.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  truck: (
    <svg width="20" height="20" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="1.5" y="6" width="11" height="9" rx="1" />
      <path d="M12.5 9h4l3 3v3h-7V9Z" strokeLinejoin="round" />
      <circle cx="6" cy="17" r="1.6" />
      <circle cx="15.5" cy="17" r="1.6" />
    </svg>
  ),
};

export function TrustStrip({ t, content }: { t: Dictionary; content?: SiteContentMap }) {
  const items: [keyof typeof ICONS, string, string][] = [
    ["box", content?.trust_1_title || t.home.trustLimitedRunsTitle, content?.trust_1_body || t.home.trustLimitedRunsBody],
    ["lock", content?.trust_2_title || t.home.trustNoRestocksTitle, content?.trust_2_body || t.home.trustNoRestocksBody],
    ["shield", content?.trust_3_title || t.home.trustSecureTitle, content?.trust_3_body || t.home.trustSecureBody],
    ["truck", content?.trust_4_title || t.home.trustFastTitle, content?.trust_4_body || t.home.trustFastBody],
  ];

  return (
    <div className="grid grid-cols-2 gap-8 border-t border-line py-10 sm:grid-cols-4">
      {items.map(([icon, title, body]) => (
        <div key={title} className="text-ink">
          <div className="text-ink-muted">{ICONS[icon]}</div>
          <p className="mt-3 font-mono-data text-xs font-bold tracking-[0.05em]">{title}</p>
          <p className="mt-1 font-body text-xs leading-relaxed text-ink-muted">{body}</p>
        </div>
      ))}
    </div>
  );
}
