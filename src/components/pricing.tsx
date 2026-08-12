"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import Reveal from "@/components/ui/reveal";
import CtaButton from "@/components/ui/cta-button";
import { track } from "@/lib/analytics/client";

type TKey = Parameters<ReturnType<typeof useI18n>["t"]>[0];

interface Step {
  titleKey: TKey;
  descKey: TKey;
}

const steps: Step[] = [
  { titleKey: "pricing.step1.title", descKey: "pricing.step1.desc" },
  { titleKey: "pricing.step2.title", descKey: "pricing.step2.desc" },
  { titleKey: "pricing.step3.title", descKey: "pricing.step3.desc" },
];

interface Factor {
  nameKey: TKey;
  descKey: TKey;
}

const factors: Factor[] = [
  { nameKey: "pricing.factor1.name", descKey: "pricing.factor1.desc" },
  { nameKey: "pricing.factor2.name", descKey: "pricing.factor2.desc" },
  { nameKey: "pricing.factor3.name", descKey: "pricing.factor3.desc" },
  { nameKey: "pricing.factor4.name", descKey: "pricing.factor4.desc" },
  { nameKey: "pricing.factor5.name", descKey: "pricing.factor5.desc" },
];

// Price table — numbers copied 1:1 from cennik.md, nothing rounded. Only the
// Standard-Rozszerzony range is public (owner's rule: "Start" is a sales
// lever, shown only for a case study / testimonial / referral, never here).
interface PriceItem {
  nameKey: TKey;
  terminKey?: TKey;
  standard: number;
  extended: number;
  unit?: "month";
}

interface PriceCategory {
  key: string;
  labelKey: TKey;
  items: PriceItem[];
}

const priceCategories: PriceCategory[] = [
  {
    key: "projects",
    labelKey: "pricing.catProjects",
    items: [
      { nameKey: "pricing.itemLanding.name", terminKey: "pricing.itemLanding.termin", standard: 3000, extended: 6000 },
      { nameKey: "pricing.itemCorporate.name", terminKey: "pricing.itemCorporate.termin", standard: 6000, extended: 12000 },
      { nameKey: "pricing.itemStoreWoo.name", terminKey: "pricing.itemStoreWoo.termin", standard: 10000, extended: 18000 },
      { nameKey: "pricing.itemStoreCustom.name", terminKey: "pricing.itemStoreCustom.termin", standard: 18000, extended: 40000 },
      { nameKey: "pricing.itemWebapp.name", terminKey: "pricing.itemWebapp.termin", standard: 20000, extended: 50000 },
      { nameKey: "pricing.itemMobile.name", terminKey: "pricing.itemMobile.termin", standard: 18000, extended: 40000 },
    ],
  },
  {
    key: "monthly",
    labelKey: "pricing.catMonthly",
    items: [
      { nameKey: "pricing.itemCareSite.name", standard: 300, extended: 600, unit: "month" },
      { nameKey: "pricing.itemCareShop.name", standard: 800, extended: 1500, unit: "month" },
      { nameKey: "pricing.itemSeo.name", standard: 1800, extended: 3500, unit: "month" },
      { nameKey: "pricing.itemAds.name", standard: 1000, extended: 2000, unit: "month" },
      { nameKey: "pricing.itemGa4.name", terminKey: "pricing.itemGa4.termin", standard: 1500, extended: 3500 },
    ],
  },
  {
    key: "ai",
    labelKey: "pricing.catAi",
    items: [
      { nameKey: "pricing.itemAudit.name", terminKey: "pricing.itemAudit.termin", standard: 5000, extended: 9000 },
      { nameKey: "pricing.itemAutomation.name", terminKey: "pricing.itemAutomation.termin", standard: 9000, extended: 20000 },
      { nameKey: "pricing.itemAssistant.name", terminKey: "pricing.itemAssistant.termin", standard: 16000, extended: 40000 },
      { nameKey: "pricing.itemTraining.name", terminKey: "pricing.itemTraining.termin", standard: 4500, extended: 9000 },
      // "Opieka po wdrożeniu" has no fixed term in cennik.md (Termin: "—") — it
      // is an ongoing retainer like the "monthly collaboration" rows above.
      { nameKey: "pricing.itemAiCare.name", standard: 2000, extended: 4500, unit: "month" },
    ],
  },
];

// Groups digits in threes with a space (PL) or comma (EN) — deterministic,
// unlike Intl.NumberFormat which depends on the ICU data bundled at runtime.
function formatAmount(n: number, lang: Lang): string {
  const separator = lang === "pl" ? " " : ",";
  return Math.trunc(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}

function priceRange(standard: number, extended: number, lang: Lang): string {
  const s = formatAmount(standard, lang);
  const e = formatAmount(extended, lang);
  const currency = lang === "pl" ? "zł" : "PLN";
  return lang === "pl" ? `od ${s} do ${e} ${currency}` : `from ${s} to ${e} ${currency}`;
}

// /cennik — the quoting process (call → range in 24 h → fixed quote). No
// invented amounts: content-deck-2026-07.md section 6.
export default function Pricing() {
  const { t, lang } = useI18n();
  const [activeCategory, setActiveCategory] = useState(0);

  // Someone reading the pricing is the strongest pre-lead signal a B2B services
  // site has — stronger than any scroll depth. Fires once, after a real dwell,
  // and mirrors to Meta as ViewContent so it can seed a remarketing audience.
  const ref = useRef<HTMLElement>(null);
  const fired = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let timer = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !fired.current) {
          timer = window.setTimeout(() => {
            fired.current = true;
            observer.disconnect();
            track("pricing_view", { page_path: window.location.pathname });
          }, 1500);
        } else {
          window.clearTimeout(timer);
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(el);
    return () => {
      window.clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <section ref={ref} className="relative bg-surface py-section">
      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12 lg:px-24">
        <Reveal className="mb-12 max-w-3xl md:mb-16">
          <h1 className="font-headline text-4xl font-bold tracking-tighter text-on-surface md:text-7xl">
            {t("pricing.title")}
          </h1>
          <p className="mt-6 text-lg font-light leading-relaxed text-on-surface/70 md:text-xl">
            {t("pricing.lead")}
          </p>
        </Reveal>

        {/* Process — 3 steps. Ordered list: the sequence is the point, and it
            lets the screen reader announce the count instead of the numeral
            baked into the heading. */}
        <ol role="list" className="grid gap-x-10 gap-y-10 md:grid-cols-3">
          {steps.map((s, i) => (
            <li key={s.titleKey}>
              <Reveal delay={i * 0.1} className="flex flex-col gap-3 border-t border-outline-variant/30 pt-8">
                <h2 className="font-headline text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
                  <span className="mr-2 text-on-surface-variant" aria-hidden="true">
                    {i + 1}.
                  </span>
                  {t(s.titleKey)}
                </h2>
                <p className="text-base font-light leading-relaxed text-on-surface/70">{t(s.descKey)}</p>
              </Reveal>
            </li>
          ))}
        </ol>

        {/* Price table - three switchable categories, 1:1 with cennik.md.
            Tabs instead of three stacked tables so the page stays scannable
            in ~10 seconds instead of turning into a wall of numbers. */}
        <div className="mt-16 md:mt-20">
          <Reveal className="max-w-2xl">
            <h2 className="font-headline text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
              {t("pricing.tableLabel")}
            </h2>
            <p className="mt-3 text-base font-light leading-relaxed text-on-surface/70">
              {t("pricing.tableLead")}
            </p>
          </Reveal>

          <Reveal delay={0.05} className="mt-8">
            <div role="tablist" aria-label={t("pricing.tableLabel")} className="flex flex-wrap gap-2">
              {priceCategories.map((cat, i) => (
                <button
                  key={cat.key}
                  id={`pricing-tab-${cat.key}`}
                  type="button"
                  role="tab"
                  aria-selected={activeCategory === i}
                  aria-controls={`pricing-panel-${cat.key}`}
                  onClick={() => setActiveCategory(i)}
                  className={`min-h-[40px] cursor-pointer rounded-full px-4 py-2 text-[11px] font-medium uppercase tracking-widest transition-colors ${
                    activeCategory === i
                      ? "bg-primary text-on-primary"
                      : "border border-outline-variant/40 text-on-surface-variant hover:border-primary hover:text-on-surface"
                  }`}
                >
                  {t(cat.labelKey)}
                </button>
              ))}
            </div>

            {/* All three categories render into the HTML unconditionally - the
                tab only toggles visibility (CSS `hidden`), never what reaches
                the DOM. An index-only render would ship just the active tab's
                prices in the server HTML, invisible to AI crawlers that never
                click - the exact `{open && <Content/>}` pattern the repo's
                ssr-content rule forbids. */}
            {priceCategories.map((cat, i) => (
              <div
                key={cat.key}
                id={`pricing-panel-${cat.key}`}
                role="tabpanel"
                aria-labelledby={`pricing-tab-${cat.key}`}
                hidden={activeCategory !== i}
                aria-hidden={activeCategory !== i}
                className="mt-6 overflow-hidden rounded-3xl bg-card shadow-card"
              >
                <ul role="list" className="divide-y divide-outline-variant/20 px-6 md:px-8">
                  {cat.items.map((item) => (
                    <li
                      key={item.nameKey}
                      className="flex flex-col gap-1 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
                    >
                      <div>
                        <p className="font-medium text-on-surface">{t(item.nameKey)}</p>
                        {item.terminKey && (
                          <p className="mt-0.5 text-xs uppercase tracking-wide text-on-surface-variant">
                            {t(item.terminKey)}
                          </p>
                        )}
                      </div>
                      <p className="shrink-0 font-headline text-lg font-bold text-primary md:text-xl">
                        {priceRange(item.standard, item.extended, lang)}
                        {item.unit === "month" && (
                          <span className="ml-1 text-sm font-medium text-on-surface-variant">
                            {t("pricing.unitMonth")}
                          </span>
                        )}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <p className="mt-4 text-xs font-light leading-relaxed text-on-surface-variant">
              {t("pricing.disclaimer")}
            </p>
          </Reveal>
        </div>

        {/* What drives the cost - the block's own top spacing, previously
            carried by the label above it. */}
        <div className="mt-16 grid gap-x-10 gap-y-10 md:mt-20 md:grid-cols-2 lg:grid-cols-3">
          {factors.map((f, i) => (
            <Reveal
              key={f.nameKey}
              delay={(i % 3) * 0.1}
              className="rounded-3xl bg-card p-7 shadow-card"
            >
              <h3 className="font-headline text-xl font-bold tracking-tight text-on-surface">{t(f.nameKey)}</h3>
              <p className="mt-3 text-sm font-light leading-relaxed text-on-surface-variant">{t(f.descKey)}</p>
            </Reveal>
          ))}
        </div>

        {/* CTA band */}
        <Reveal className="mt-14 overflow-hidden rounded-3xl bg-card p-8 text-center shadow-card md:mt-20 md:p-16">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-on-surface md:text-5xl">
            {t("pricing.ctaTitle")}
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-lg font-light leading-relaxed text-on-surface/70">
            {t("pricing.ctaDesc")}
          </p>
          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <CtaButton href="tel:+48509123434">{t("pricing.cta")}</CtaButton>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
