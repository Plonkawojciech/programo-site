"use client";

import { useI18n } from "@/lib/i18n";
import Reveal from "@/components/ui/reveal";
import CtaButton from "@/components/ui/cta-button";
import FounderCards from "@/components/founder-cards";

// /o-nas — rewritten from zero (content-deck-2026-07.md section 5). No
// "digital future", no "international expansion", no "builders" — just the
// company, how the two of us work, and the two founders. Portrety założycieli
// (realne zdjęcia, nie stock) siedzą we wspólnym `FounderCards` — ten sam
// komponent renderuje /kontakt, żeby jedna zmiana zdjęcia szła w oba miejsca.
export default function About() {
  const { t } = useI18n();

  return (
    <section id="about" className="relative bg-surface py-section">
      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12 lg:px-24">
        <Reveal className="max-w-3xl">
          <h1 className="font-headline text-4xl font-bold leading-[1.05] tracking-tighter text-on-surface md:text-7xl">
            {t("about.title")}
          </h1>
          <p className="mt-6 text-lg font-light leading-relaxed text-on-surface/70 md:text-xl">
            {t("about.intro")}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-14 border-t border-outline-variant/30 pt-10 md:mt-20 md:grid-cols-2 md:gap-16 md:pt-14">
          <Reveal className="flex flex-col gap-4">
            <h2 className="font-headline text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
              {t("about.how.title")}
            </h2>
            <p className="text-base font-light leading-relaxed text-on-surface/70">{t("about.how.body")}</p>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-col gap-4">
            <h2 className="font-headline text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
              {t("about.proof.title")}
            </h2>
            <p className="text-base font-light leading-relaxed text-on-surface/70">{t("about.proof.body")}</p>
          </Reveal>
        </div>

        {/* Founders */}
        <div className="mt-14 border-t border-outline-variant/30 pt-10 md:mt-20 md:pt-14">
          <Reveal className="mb-12 max-w-2xl md:mb-16">
            <h2 className="font-headline text-3xl font-bold tracking-tight text-on-surface md:text-5xl">
              {t("about.people.title")}
            </h2>
          </Reveal>
          <FounderCards />
        </div>

        {/* Company data + CTA */}
        <Reveal className="mt-14 flex flex-col items-start gap-8 rounded-3xl bg-card p-8 shadow-card md:mt-20 md:flex-row md:items-center md:justify-between md:p-12">
          <div>
            <p className="font-headline text-xl font-medium tracking-tight text-on-surface md:text-2xl">
              {t("about.company.line")}
            </p>
          </div>
          <CtaButton href="/kontakt#kontakt-main" className="shrink-0">
            {t("nav.cta")}
          </CtaButton>
        </Reveal>
      </div>
    </section>
  );
}
