"use client";

import { useI18n } from "@/lib/i18n";

// Short page hero for /kontakt — sits above CompactLeadForm + QuickContact.
// Kept minimal on purpose: the forms below do the actual conversion work.
//
// `pt-section-tight` is not decoration. The route wrapper in page.tsx is the
// same on all six inner pages, but the other five open with a section that
// carries its own `py-section`; this one didn't carry anything, so the wrapper
// alone had to clear the fixed navbar (~76px) and it no longer can.
export default function ContactHero() {
  const { t } = useI18n();
  return (
    <section className="mx-auto w-full max-w-[1400px] px-6 pb-12 pt-section-tight md:px-12 md:pb-16 lg:px-24">
      <h1
        className="max-w-3xl font-headline text-4xl font-bold tracking-tight text-on-surface md:text-5xl lg:text-6xl"
      >
        {t("contactPage.title")}
      </h1>
      <p
        className="mt-5 max-w-xl text-lg font-light leading-relaxed text-on-surface/70"
      >
        {t("contactPage.subtitle")}
      </p>
    </section>
  );
}
