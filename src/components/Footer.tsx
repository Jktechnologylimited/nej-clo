import Link from "next/link";
import { getLocale } from "@/lib/i18n/get-locale";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getSiteContent } from "@/lib/site-content";

export async function Footer() {
  const [locale, content] = await Promise.all([getLocale(), getSiteContent()]);
  const t = getDictionary(locale);
  const footerDesc = content.footer_desc || t.footer.desc;

  const linkClass = "transition hover:text-ink";

  return (
    <footer className="border-t border-line bg-bg">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <div className="font-display text-xl font-black text-ink">NEJ</div>
            <p className="mt-3 max-w-xs font-mono-data text-[11px] leading-relaxed text-ink-muted">
              {footerDesc}
            </p>
          </div>

          <div className="font-mono-data text-xs tracking-[0.05em] text-ink-muted">
            <div className="mb-3 font-bold tracking-[0.1em] text-ink/40">
              {t.footer.shopHeading}
            </div>
            <ul className="space-y-2">
              <li><Link href="/shop" className={linkClass}>{t.footer.shopAll}</Link></li>
              <li><Link href="/shop?category=tee" className={linkClass}>{t.footer.tshirts}</Link></li>
              <li><Link href="/shop?category=cap" className={linkClass}>{t.footer.caps}</Link></li>
              <li><Link href="/shop?category=tracksuit" className={linkClass}>{t.footer.tracksuits}</Link></li>
              <li><Link href="/shop" className={linkClass}>{t.footer.allProducts}</Link></li>
            </ul>
          </div>

          <div className="font-mono-data text-xs tracking-[0.05em] text-ink-muted">
            <div className="mb-3 font-bold tracking-[0.1em] text-ink/40">
              {t.footer.collectionsHeading}
            </div>
            <ul className="space-y-2">
              <li><Link href="/collections" className={linkClass}>{t.footer.currentCollection}</Link></li>
              <li><Link href="/collections" className={linkClass}>{t.footer.pastCollections}</Link></li>
            </ul>
          </div>

          <div className="font-mono-data text-xs tracking-[0.05em] text-ink-muted">
            <div className="mb-3 font-bold tracking-[0.1em] text-ink/40">
              {t.footer.careHeading}
            </div>
            <ul className="space-y-2">
              <li><Link href="/help?tab=size-guide" className={linkClass}>{t.footer.sizeGuide}</Link></li>
              <li><Link href="/help?tab=shipping" className={linkClass}>{t.footer.shipping}</Link></li>
              <li><Link href="/help?tab=returns" className={linkClass}>{t.footer.returns}</Link></li>
              <li><Link href="/help" className={linkClass}>{t.footer.faqs}</Link></li>
              <li><Link href="/help#contact" className={linkClass}>{t.footer.contactUs}</Link></li>
            </ul>
          </div>

          <div className="font-mono-data text-xs tracking-[0.05em] text-ink-muted">
            <div className="mb-3 font-bold tracking-[0.1em] text-ink/40">
              {t.footer.companyHeading}
            </div>
            <ul className="space-y-2">
              <li><Link href="/about" className={linkClass}>{t.footer.aboutNej}</Link></li>
              <li><Link href="/about#manifest" className={linkClass}>{t.footer.ourManifest}</Link></li>
              <li><Link href="/legal/privacy" className={linkClass}>{t.footer.privacyPolicy}</Link></li>
              <li><Link href="/legal/terms" className={linkClass}>{t.footer.terms}</Link></li>
            </ul>
            <div className="mt-6">
              <div className="mb-3 font-bold tracking-[0.1em] text-ink/40">
                {t.footer.followHeading}
              </div>
              <div className="flex gap-3">
                <a
                  href="https://instagram.com/nejclothing"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-ink-muted transition hover:text-ink"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <rect x="1.5" y="1.5" width="15" height="15" rx="4" />
                    <circle cx="9" cy="9" r="3.6" />
                    <circle cx="13.2" cy="4.8" r="0.9" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                <a
                  href="https://x.com/nejclothing"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="X"
                  className="text-ink-muted transition hover:text-ink"
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <path d="M2 2l14 14M16 2 2 16" strokeLinecap="round" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="dashed-line mt-12 flex flex-col gap-2 pt-6 font-mono-data text-[10px] tracking-[0.1em] text-ink-muted/70 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} NEJ CLOTHING. ALL RIGHTS RESERVED.</span>
          <span>{t.footer.regNote}</span>
        </div>

        <div className="mt-4 text-center sm:text-left">
          <a
            href="https://jktl.com.ng"
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono-data text-[10px] tracking-[0.1em] text-ink-muted/50 transition hover:text-ink"
          >
            Powered by NEJ.
          </a>
        </div>
      </div>
    </footer>
  );
}
