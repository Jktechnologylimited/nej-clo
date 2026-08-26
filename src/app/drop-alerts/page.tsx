import { NewsletterForm } from "@/components/NewsletterForm";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";

export const metadata = { title: "Drop Alerts — Nej Clothing" };

export default async function DropAlertsPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return (
    <div className="mx-auto max-w-2xl px-5 py-24 text-center sm:px-8">
      <p className="font-mono-data text-[11px] tracking-[0.2em] text-ink-muted">
        LIMITED RUNS
      </p>
      <h1 className="mt-2 font-display text-4xl font-black uppercase tracking-tight text-ink">
        Never miss a drop.
      </h1>
      <p className="mx-auto mt-4 max-w-md font-body text-sm leading-relaxed text-ink-muted">
        Be first in line for new collections, restocks, and exclusive
        releases. Full alert preferences (drop types, restocks, SMS/email
        channels) are coming soon — for now, join with your email.
      </p>
      <div className="mx-auto mt-8 max-w-sm">
        <NewsletterForm
          buttonLabel={t.home.dropAlertsCta}
          successLabel={t.home.dropAlertsSuccess}
        />
      </div>
    </div>
  );
}
