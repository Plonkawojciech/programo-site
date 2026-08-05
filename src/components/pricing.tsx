"use client";

import { useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n";
import Reveal from "@/components/ui/reveal";
import CtaButton from "@/components/ui/cta-button";
import { track } from "@/lib/analytics/client";

type TKey = Parameters<ReturnType<typeof useI18n>["t"]>[0];

interface Step {
  n: string;
  titleKey: TKey;
  descKey: TKey;
}

const steps: Step[] = [
  { n: "01", titleKey: "pricing.step1.title", descKey: "pricing.step1.desc" },
  { n: "02", titleKey: "pricing.step2.title", descKey: "pricing.step2.desc" },
  { n: "03", titleKey: "pricing.step3.title", descKey: "pricing.step3.desc" },
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

// /cennik — the quoting process (call → range in 24 h → fixed quote). No
// invented amounts: content-deck-2026-07.md section 6.
export default function Pricing() {
  const { t } = useI18n();

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
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] text-primary">
            {t("pricing.label")}
          </p>
          <h1 className="mt-5 font-headline text-4xl font-bold tracking-tighter text-on-surface md:text-7xl">
            {t("pricing.title")}
          </h1>
          <p className="mt-6 text-lg font-light leading-relaxed text-on-surface/70 md:text-xl">
            {t("pricing.lead")}
          </p>
        </Reveal>

        {/* Process — 3 steps */}
        <Reveal className="mb-6 max-w-2xl">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-on-surface-variant">
            {t("pricing.processLabel")}
          </p>
        </Reveal>
        <div className="grid gap-x-10 gap-y-12 md:grid-cols-3">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1} className="flex flex-col gap-4 border-t border-outline-variant/30 pt-8">
              <span className="font-mono text-xs uppercase tracking-widest text-primary">{s.n}</span>
              <h2 className="font-headline text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
                {t(s.titleKey)}
              </h2>
              <p className="text-base font-light leading-relaxed text-on-surface/70">{t(s.descKey)}</p>
            </Reveal>
          ))}
        </div>

        {/* What drives the cost */}
        <Reveal className="mb-6 mt-16 max-w-2xl md:mt-20">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-on-surface-variant">
            {t("pricing.factorsLabel")}
          </p>
        </Reveal>
        <div className="grid gap-x-10 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
          {factors.map((f, i) => (
            <Reveal
              key={f.nameKey}
              delay={(i % 3) * 0.1}
              className="rounded-3xl border border-outline-variant/30 bg-surface-container-low p-7"
            >
              <h3 className="font-headline text-xl font-bold tracking-tight text-on-surface">{t(f.nameKey)}</h3>
              <p className="mt-3 text-sm font-light leading-relaxed text-on-surface-variant">{t(f.descKey)}</p>
            </Reveal>
          ))}
        </div>

        {/* CTA band */}
        <Reveal className="mt-14 overflow-hidden rounded-3xl border border-primary/30 bg-primary/5 p-8 text-center md:mt-20 md:p-16">
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
