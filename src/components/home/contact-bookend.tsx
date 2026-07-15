"use client";

import { useI18n } from "@/lib/i18n";
import Reveal from "@/components/ui/reveal";
import QuickContact from "@/components/quick-contact";

// Contact bookend (deck 1.9). Provides the `#kontakt` scroll target used by the
// hero CTA, an editorial invitation header, and embeds QuickContact as-is (its
// visual redesign is owned elsewhere; props unchanged).
export default function ContactBookend() {
  const { t } = useI18n();

  return (
    <section id="kontakt" className="relative scroll-mt-24 bg-surface pt-24 md:pt-32 border-t border-outline-variant/20">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24">
        <Reveal className="max-w-3xl">
          <h2 className="font-headline text-3xl md:text-6xl font-bold tracking-tight text-on-surface">
            {t("home.contact.title")}
          </h2>
          <p className="mt-6 text-lg font-light leading-relaxed text-on-surface/70">
            {t("home.contact.sub")}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
            <a
              href="tel:+48509123434"
              className="font-headline text-2xl md:text-3xl font-bold tracking-tight text-on-surface transition-colors hover:text-primary"
            >
              509 123 434
            </a>
            <span className="flex items-center gap-2.5 text-xs font-medium uppercase tracking-widest text-on-surface-variant">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary">
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" aria-hidden="true">
                  <path d="M4 12.5l5 5L20 6.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {t("home.reply")}
            </span>
          </div>
        </Reveal>
      </div>

      {/* Full contact form (embedded as-is) */}
      <QuickContact formId="home-bookend" />
    </section>
  );
}
