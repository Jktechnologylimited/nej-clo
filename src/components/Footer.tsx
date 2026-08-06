import Link from "next/link";
import { NewsletterForm } from "./NewsletterForm";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getSiteContent } from "@/lib/site-content";

export async function Footer() {
  const [locale, content] = await Promise.all([getLocale(), getSiteContent()]);
  const t = getDictionary(locale);
  const footerDesc = content.footer_desc || t.footer.desc;

  return (
    <footer className="border-t border-line bg-bg">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <div className="font-display text-xl font-black text-paper">
              NEJ<span className="text-amber">.</span>
            </div>
            <p className="mt-3 max-w-xs font-mono-data text-[11px] leading-relaxed text-paper/50">
              {footerDesc}
            </p>
          </div>

          <div className="font-mono-data text-xs tracking-[0.1em] text-paper/60">
            <div className="mb-3 text-paper/30">{t.footer.index}</div>
            <ul className="space-y-2">
              <li>
                <Link href="/shop" className="transition hover:text-amber">
                  {t.footer.shopAll}
                </Link>
              </li>
              <li>
                <Link href="/collections" className="transition hover:text-amber">
                  {t.nav.collections}
                </Link>
              </li>
              <li>
                <Link href="/cart" className="transition hover:text-amber">
                  {t.footer.cart}
                </Link>
              </li>
              <li>
                <Link href="/account" className="transition hover:text-amber">
                  {t.footer.account}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="mb-3 font-mono-data text-xs tracking-[0.1em] text-paper/30">
              {t.footer.newsletterLabel}
            </div>
            <NewsletterForm />
          </div>
        </div>

        <div className="dashed-line mt-12 flex flex-col gap-2 pt-6 font-mono-data text-[10px] tracking-[0.1em] text-paper/30 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} NEJ CLOTHING — ALL PIECES LIMITED</span>
          <span>{t.footer.regNote}</span>
        </div>

        <div className="mt-4 text-center sm:text-left">
          <a
            href="https://jktl.com.ng"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono-data text-[10px] tracking-[0.1em] text-paper/20 transition hover:text-amber"
          >
            Powered by NEJ.
          </a>
        </div>
      </div>
    </footer>
  );
}
