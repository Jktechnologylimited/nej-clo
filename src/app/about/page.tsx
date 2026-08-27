import Link from "next/link";
import { NewsletterForm } from "@/components/NewsletterForm";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getSiteContent } from "@/lib/site-content";

export const metadata = { title: "About — Nej Clothing" };

const ICONS = {
  target: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.2" fill="currentColor" stroke="none" />
    </svg>
  ),
  lock: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x="5" y="11" width="14" height="10" rx="1.5" />
      <path d="M7.5 11V7.5a4.5 4.5 0 0 1 9 0V11" />
    </svg>
  ),
  shield: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M12 3 20 6v6c0 5.5-3.3 9-8 10.5C7.3 21 4 17.5 4 12V6l8-3Z" />
      <path d="m8.5 12 2.5 2.5L16 9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  people: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.4" />
      <path d="M3 20c1-4 4-6 6-6s5 2 6 6" strokeLinecap="round" />
      <path d="M15 14c2 0 4.5 1.6 5.5 5.5" strokeLinecap="round" />
    </svg>
  ),
  globe: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.5 2.5 4 5.8 4 9s-1.5 6.5-4 9c-2.5-2.5-4-5.8-4-9s1.5-6.5 4-9Z" />
    </svg>
  ),
  shirt: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M8 4 4 7l2 4 2.5-1.5V21h7V9.5L18 11l2-4-4-3c-1 1.3-2.2 2-4 2s-3-.7-4-2Z" strokeLinejoin="round" />
    </svg>
  ),
  scissors: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="6" cy="6" r="2.2" />
      <circle cx="6" cy="18" r="2.2" />
      <path d="m20 5-12.5 13M7.5 6 20 19" strokeLinecap="round" />
    </svg>
  ),
  check: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <circle cx="12" cy="12" r="9" />
      <path d="m8 12 2.5 2.5L16 9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  box: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
      <path d="M3 8 12 3l9 5-9 5-9-5Z" strokeLinejoin="round" />
      <path d="M3 8v9l9 5 9-5V8" strokeLinejoin="round" />
      <path d="M12 13v9" />
    </svg>
  ),
};

export default async function AboutPage() {
  const [locale, content] = await Promise.all([getLocale(), getSiteContent()]);
  const t = getDictionary(locale);

  const heroLede =
    content.about_hero_lede ||
    "NEJ is an independent streetwear label built on purpose, culture, and craftsmanship. We create in limited runs so every piece carries meaning, not mass.";
  const storyParagraph1 =
    content.about_story_paragraph_1 ||
    "NEJ was born from the idea that clothing can be more than what you wear — it can be what you stand for. From the streets to the world, we represent a new era of streetwear rooted in authenticity, self-expression, and community.";
  const storyParagraph2 = content.about_story_paragraph_2 || "This is NEJ. This is for the culture.";

  const values = [
    { icon: "target" as const, title: "Purpose", body: "We create with intention. Every drop has a reason." },
    { icon: "lock" as const, title: "Exclusivity", body: "Limited runs. Never restocked. Once it's gone, it's gone." },
    { icon: "shield" as const, title: "Quality", body: "Premium fabrics. Thoughtful details. Built to last." },
    { icon: "people" as const, title: "Culture", body: "Inspired by the streets. Made for the real ones." },
    { icon: "globe" as const, title: "Impact", body: "We move with responsibility and respect." },
  ];

  const differentiators = [
    { icon: "shirt" as const, title: "Premium Materials", body: "Carefully sourced fabrics for comfort, durability, and feel." },
    { icon: "scissors" as const, title: "Limited Production", body: "Small-batch production ensures exclusivity and quality control." },
    { icon: "check" as const, title: "Attention to Detail", body: "From fit to finish, every detail is intentionally crafted." },
    { icon: "box" as const, title: "Secure & Reliable", body: "Trusted checkout. Discreet packaging. On time, every time." },
  ];

  return (
    <div>
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="font-mono-data text-xs tracking-[0.2em] text-ink-muted">
                {t.about.eyebrow}
              </p>
              <h1 className="mt-3 font-display text-4xl font-black uppercase leading-[0.95] tracking-tight text-ink sm:text-5xl">
                More than fashion.
                <br />A movement.
              </h1>
              <p className="mt-5 max-w-md font-body text-sm leading-relaxed text-ink-muted">
                {heroLede}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#manifest"
                  className="border border-ink bg-ink px-6 py-3 font-mono-data text-xs tracking-[0.15em] text-paper transition hover:bg-amber hover:border-amber hover:text-bg"
                >
                  {t.about.ourStoryCta}
                </a>
                <Link
                  href="/shop"
                  className="border border-line-strong px-6 py-3 font-mono-data text-xs tracking-[0.15em] text-ink transition hover:border-ink"
                >
                  {t.about.shopCollectionsCta}
                </Link>
              </div>
            </div>
            <div className="flex aspect-[4/3] items-center justify-center border border-line-strong bg-bg-raised">
              <span className="font-display text-3xl font-black tracking-tight text-ink/15">NEJ</span>
            </div>
          </div>
        </div>
      </section>

      <section id="manifest" className="scroll-mt-20 border-b border-line bg-bg-raised">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-ink">
            {t.about.manifestoHeading}
          </h2>
          <p className="mt-2 max-w-lg font-body text-sm leading-relaxed text-ink-muted">
            The Manifest is our promise — a set of principles that guide everything we
            create and stand for.
          </p>
          <div className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
            {values.map((v) => (
              <div key={v.title}>
                <div className="text-ink-muted">{ICONS[v.icon]}</div>
                <p className="mt-3 font-mono-data text-xs font-bold tracking-[0.05em] text-ink">
                  {v.title.toUpperCase()}
                </p>
                <p className="mt-1 font-body text-xs leading-relaxed text-ink-muted">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <h2 className="font-display text-2xl font-extrabold uppercase tracking-tight text-ink">
            {t.about.storyHeading}
          </h2>
          <div className="mt-4 max-w-2xl space-y-4 font-body text-sm leading-relaxed text-ink-muted">
            <p>{storyParagraph1}</p>
            <p>{storyParagraph2}</p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { title: "Born from the streets", body: "Rooted in real culture. Built on experience." },
              { title: "Crafted with intention", body: "Every detail considered. No compromises." },
              { title: "Made for the real ones", body: "For the dreamers, the doers, the difference makers." },
            ].map((block) => (
              <div key={block.title} className="border border-line-strong bg-bg-raised p-6">
                <p className="font-display text-sm font-bold uppercase text-ink">{block.title}</p>
                <p className="mt-2 font-body text-xs leading-relaxed text-ink-muted">{block.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-bg-raised">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-20">
          <h2 className="font-display text-lg font-extrabold uppercase tracking-tight text-ink">
            {t.about.whatMakesDifferent}
          </h2>
          <div className="mt-6 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {differentiators.map((d) => (
              <div key={d.title}>
                <div className="text-ink-muted">{ICONS[d.icon]}</div>
                <p className="mt-3 font-mono-data text-xs font-bold tracking-[0.05em] text-ink">
                  {d.title.toUpperCase()}
                </p>
                <p className="mt-1 font-body text-xs leading-relaxed text-ink-muted">{d.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-14 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div>
            <h2 className="font-display text-lg font-extrabold uppercase tracking-tight text-ink">
              {t.about.stayInKnowTitle}
            </h2>
            <p className="mt-1 max-w-sm font-body text-sm text-ink-muted">{t.about.stayInKnowBody}</p>
          </div>
          <div className="w-full sm:w-80">
            <NewsletterForm buttonLabel={t.home.dropAlertsCta} successLabel={t.home.dropAlertsSuccess} />
          </div>
        </div>
      </section>
    </div>
  );
}
