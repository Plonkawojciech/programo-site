"use client";

import { useState } from "react";
import CompactLeadForm from "@/components/compact-lead-form";
import { useI18n } from "@/lib/i18n";
import { DEMO_INDUSTRIES, type DemoIndustry, type DemoView } from "@/lib/demos";
import { DemoCard } from "@/components/demos/demo-card";

type Filter = DemoIndustry | "all";

// Two rows on desktop, six cards on a phone. The rest stays in the HTML
// (`hidden`, not unmounted) so crawlers that do not click still read it.
const INITIAL = 6;

/**
 * The demos half of /projekty (the old /dema route redirects here, to #dema).
 * Header, filter pills and grid mirror FeaturedWork on purpose, so the page
 * reads as one long portfolio: our work first, then the demos below it.
 * Ends with the dark lead block that used to close /dema — same formId, so
 * the demo-request funnel keeps its history.
 */
export default function DemosSection({ demos }: { demos: DemoView[] }) {
  const { lang, t } = useI18n();
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState(false);

  const present = new Set(demos.map((demo) => demo.industry));
  const pills = [
    { key: "all" as const, label: { pl: t("demos.filter.all"), en: t("demos.filter.all") } },
    ...DEMO_INDUSTRIES.filter((industry) => present.has(industry.key)),
  ];
  const anyConcept = demos.some((demo) => demo.concept);
  const allNamed = demos.every((demo) => !demo.concept);
  const hiddenCount = demos.length - INITIAL;

  const isVisible = (demo: DemoView, index: number) =>
    filter === "all" ? expanded || index < INITIAL : demo.industry === filter;

  return (
    <>
      <section id="dema" className="relative w-full scroll-mt-24 bg-card-band">
        <div className="mx-auto max-w-[1400px] px-6 pb-section md:px-12 lg:px-24">
          <div className="mb-10 flex flex-col gap-8 border-t border-outline-variant/30 pt-section md:mb-14 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="font-headline text-4xl font-bold leading-[1.05] tracking-tight text-on-surface md:text-6xl 2xl:text-7xl">
                {t("demos.section.title")}
              </h2>
              <p className="mt-5 text-base font-light leading-relaxed text-on-surface/70 text-pretty md:text-lg">
                {t(allNamed ? "demos.section.lead" : "demos.section.leadConcept")}
              </p>
            </div>

            <div role="group" aria-label={t("demos.filter.label")} className="flex flex-wrap gap-2 lg:max-w-md lg:justify-end">
              {pills.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  aria-pressed={filter === item.key}
                  onClick={() => setFilter(item.key)}
                  className={`min-h-11 cursor-pointer rounded-full px-4 py-2 text-[11px] font-medium uppercase tracking-widest transition-colors ${
                    filter === item.key
                      ? "bg-primary text-on-primary"
                      : "border border-outline-variant/40 text-on-surface-variant hover:border-primary hover:text-on-surface"
                  }`}
                >
                  {item.label[lang]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {demos.map((demo, index) => (
              <div key={demo.slug} hidden={!isVisible(demo, index)}>
                <DemoCard
                  demo={demo}
                  lang={lang}
                  alt={t(demo.concept ? "demos.card.conceptAlt" : "demos.card.screenshotAlt").replace("{name}", demo.title[lang])}
                />
              </div>
            ))}
          </div>

          {filter === "all" && !expanded && hiddenCount > 0 && (
            <div className="mt-10 flex justify-center md:mt-12">
              <button
                type="button"
                onClick={() => setExpanded(true)}
                className="inline-flex min-h-12 cursor-pointer items-center gap-3 rounded-full border border-on-surface/30 px-7 py-3 text-xs font-medium uppercase tracking-[0.18em] text-on-surface transition-colors hover:border-primary hover:bg-primary hover:text-on-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              >
                {t("demos.section.showAll").replace("{count}", String(hiddenCount))}
                <span aria-hidden="true">↓</span>
              </button>
            </div>
          )}

          <p className="mx-auto mt-10 max-w-3xl text-center text-xs leading-relaxed text-on-surface-variant md:mt-12">
            {t(anyConcept ? "demos.section.noteConcept" : "demos.section.note")}
          </p>
        </div>
      </section>

      <section id="kontakt" className="scroll-mt-24 bg-[#051F20] py-20 text-[#DAF1DE] md:py-24">
        <div className="mx-auto grid w-full max-w-[1400px] gap-10 px-6 md:px-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(460px,1.1fr)] lg:items-center lg:gap-16 lg:px-24">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#8EB69B]">{t("demos.cta.eyebrow")}</p>
            <h2 className="mt-5 max-w-2xl font-headline text-4xl font-bold leading-tight tracking-tight md:text-5xl">{t("demos.cta.title")}</h2>
            <p className="mt-5 max-w-xl text-base font-light leading-relaxed text-[#DAF1DE]/75 md:text-lg">{t("demos.cta.lead")}</p>
          </div>
          <CompactLeadForm bare formId="dema" anchorId="dema-formularz" projectType={t("demos.form.projectType")} heading={t("demos.hero.primaryCta")} />
        </div>
      </section>
    </>
  );
}
