"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import QuickContact from "@/components/quick-contact";
import ProjectsMarquee from "@/components/projects-marquee";
import TrustBar from "@/components/trust-bar";
import CaseStudies, { type CaseStudyItem } from "@/components/case-studies";
import CompactLeadForm from "@/components/compact-lead-form";
import CtaButton from "@/components/ui/cta-button";
import Reveal from "@/components/ui/reveal";

type TKey = Parameters<ReturnType<typeof useI18n>["t"]>[0];

const elements: { titleKey: TKey; descKey: TKey }[] = [
  { titleKey: "mkt.elements.1.title", descKey: "mkt.elements.1.desc" },
  { titleKey: "mkt.elements.2.title", descKey: "mkt.elements.2.desc" },
  { titleKey: "mkt.elements.3.title", descKey: "mkt.elements.3.desc" },
];

const faqs: { qKey: TKey; aKey: TKey }[] = [
  { qKey: "mkt.faq.q1", aKey: "mkt.faq.a1" },
  { qKey: "mkt.faq.q2", aKey: "mkt.faq.a2" },
  { qKey: "mkt.faq.q3", aKey: "mkt.faq.a3" },
];

const caseSlugs = ["skup-nieruchomosci", "domki-poznaniak", "wsafefinanse"] as const;
const caseAngleKeys: TKey[] = ["mkt.cases.1.angle", "mkt.cases.2.angle", "mkt.cases.3.angle"];

const H2 = "font-headline text-3xl font-bold tracking-tight text-on-surface md:text-5xl";
const CONTAINER = "mx-auto w-full max-w-[1400px] px-6 md:px-12 lg:px-24";
// Asymmetric on purpose. Every section on this page uses the same constant, so
// a symmetric value gets counted twice at every boundary — `py-24 md:py-32
// lg:py-40` produced a 320px void between each pair. Top-heavy keeps the space
// above a heading, where it separates, instead of below it, where it strands.
const SECTION = "relative bg-surface pt-section pb-section-tight";

// /strony-tracking-reklamy — website + conversion tracking + Google Ads as one
// package. Content: content-deck-2026-07.md section 3.
export default function MarketingTrackingLanding() {
  const { t } = useI18n();

  const caseItems: CaseStudyItem[] = caseSlugs.map((slug, i) => ({
    slug,
    angle: t(caseAngleKeys[i]),
  }));

  return (
    <div className="bg-surface text-on-surface">
      {/* HERO — 2-column: copy + lead form above the fold */}
      <section className="relative pt-28 pb-section-tight md:pt-32">
        <div className={CONTAINER}>
          <nav aria-label="breadcrumb" className="mb-8 text-xs uppercase tracking-widest text-on-surface-variant">
            <Link href="/" className="transition-colors hover:text-on-surface">Programo</Link>
            <span className="mx-2">/</span>
            <span>{t("nav.marketing")}</span>
          </nav>

          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
            <div>
              <h1 className="font-headline text-4xl font-bold leading-[1.05] tracking-tighter text-on-surface md:text-6xl 2xl:text-7xl">
                {t("mkt.hero.title")}
              </h1>
              <p className="mt-6 max-w-xl text-lg font-light leading-relaxed text-on-surface/70 md:text-xl">
                {t("mkt.hero.desc")}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <CtaButton href="tel:+48509123434" variant="secondary">{t("mkt.hero.ctaCall")}</CtaButton>
                <a href="#realizacje" className="text-sm font-medium text-on-surface-variant underline underline-offset-4 transition-colors hover:text-on-surface">
                  {t("mkt.cases.title")} ↓
                </a>
              </div>
              {/* The rule belongs to this line; without it the border floats
                  under the CTA row with nothing beneath it. */}
              {t("footer.reply").trim() && (
                <p className="mt-8 border-t border-outline-variant/30 pt-6 text-xs font-medium uppercase tracking-widest text-on-surface-variant">
                  {t("footer.reply")}
                </p>
              )}
            </div>

            <CompactLeadForm
              bare
              formId="marketing-hero"
              anchorId="szybki-kontakt"
              projectType="Strona + reklamy"
              heading={t("mkt.hero.form.heading")}
            />
          </div>
        </div>
      </section>

      {/* PROBLEM → SOLUTION */}
      <section className={SECTION}>
        <div className={CONTAINER}>
          <div className="grid gap-12 md:grid-cols-2 md:gap-16">
            <Reveal>
              <h2 className={H2}>{t("mkt.problem.title")}</h2>
              <p className="mt-6 text-base font-light leading-relaxed text-on-surface/70 md:text-lg">
                {t("mkt.problem.body")}
              </p>
            </Reveal>
            <Reveal delay={0.1} className="rounded-3xl border border-primary/30 bg-primary/5 p-8 md:p-10">
              <h3 className="font-headline text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
                {t("mkt.solution.title")}
              </h3>
              <p className="mt-5 text-base font-light leading-relaxed text-on-surface/70">
                {t("mkt.solution.body")}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* 3 ELEMENTS OF THE PACKAGE */}
      <section className={SECTION}>
        <div className={CONTAINER}>
          <Reveal className="mb-10 max-w-3xl md:mb-14">
            <h2 className={H2}>{t("mkt.elements.title")}</h2>
          </Reveal>
          {/* The package is sold as "these three, in this order" — an <ol>
              says that, and lets the numeral in the heading stay decorative. */}
          <ol role="list" className="grid gap-x-10 gap-y-10 md:grid-cols-3">
            {elements.map((el, i) => (
              <li key={el.titleKey}>
                <Reveal delay={i * 0.1} className="flex flex-col gap-3 border-t border-outline-variant/30 pt-8">
                  <h3 className="font-headline text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
                    <span className="mr-2 text-on-surface-variant" aria-hidden="true">
                      {i + 1}.
                    </span>
                    {t(el.titleKey)}
                  </h3>
                  <p className="text-base font-light leading-relaxed text-on-surface/70">{t(el.descKey)}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* THREE CASE STUDIES */}
      <div id="realizacje" className="scroll-mt-28" />
      <CaseStudies
        heading={t("mkt.cases.title")}
        items={caseItems}
      />

      {/* Repeated compact form for scrollers */}
      <CompactLeadForm
        formId="marketing-compact"
        projectType="Strona + reklamy"
        heading={t("mkt.repeat.heading")}
      />

      {/* FAQ */}
      <section className={SECTION}>
        <div className={CONTAINER}>
          <Reveal className="mb-10 max-w-3xl md:mb-14">
            <h2 className={H2}>{t("mkt.faq.title")}</h2>
          </Reveal>
          <div className="grid gap-x-16 gap-y-10 md:grid-cols-3">
            {faqs.map((f, i) => (
              <Reveal key={f.qKey} delay={(i % 3) * 0.1} className="border-t border-outline-variant/30 pt-6">
                <h3 className="font-headline text-xl font-bold tracking-tight text-on-surface">{t(f.qKey)}</h3>
                <p className="mt-3 font-light leading-relaxed text-on-surface/70">{t(f.aKey)}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className={SECTION}>
        <div className={CONTAINER}>
          <Reveal className="overflow-hidden rounded-3xl border border-primary/30 bg-primary/5 p-8 text-center md:p-16">
            <h2 className={H2}>{t("mkt.cta.title")}</h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg font-light leading-relaxed text-on-surface/70">
              {t("mkt.cta.desc")}
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <CtaButton href="tel:+48509123434">{t("mkt.hero.ctaCall")}</CtaButton>
              <CtaButton href="#marketing-hero" variant="secondary">{t("mkt.hero.ctaConsult")}</CtaButton>
            </div>
          </Reveal>
        </div>
      </section>

      <TrustBar />
      <ProjectsMarquee />
      <QuickContact formId="marketing-full" />
    </div>
  );
}
