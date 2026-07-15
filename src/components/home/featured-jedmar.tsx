"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { trackPortfolioClick } from "@/lib/tracking";
import Reveal from "@/components/ui/reveal";
import CountUp from "@/components/ui/count-up";
import DeviceDuo from "@/components/ui/device-duo";

type TKey = Parameters<ReturnType<typeof useI18n>["t"]>[0];

const STORY: { labelKey: TKey; bodyKey: TKey }[] = [
  { labelKey: "home.jedmar.challengeLabel", bodyKey: "home.jedmar.challenge" },
  { labelKey: "home.jedmar.solutionLabel", bodyKey: "home.jedmar.solution" },
  { labelKey: "home.jedmar.resultLabel", bodyKey: "home.jedmar.result" },
];

const METRICS: { valueKey: TKey; labelKey: TKey }[] = [
  { valueKey: "home.jedmar.m1.value", labelKey: "home.jedmar.m1.label" },
  { valueKey: "home.jedmar.m2.value", labelKey: "home.jedmar.m2.label" },
  { valueKey: "home.jedmar.m3.value", labelKey: "home.jedmar.m3.label" },
  { valueKey: "home.jedmar.m4.value", labelKey: "home.jedmar.m4.label" },
];

export default function FeaturedJedmar() {
  const { t } = useI18n();
  const href = "/projects/jedmar";

  return (
    <section className="relative bg-surface-container-low py-24 md:py-32">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24">
        <Reveal className="mb-14 max-w-3xl md:mb-16">
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] text-primary">
            {t("home.jedmar.eyebrow")}
          </p>
          <h2 className="mt-5 font-headline text-3xl md:text-5xl font-bold tracking-tight text-on-surface">
            {t("home.jedmar.title")}
          </h2>
        </Reveal>

        <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-start lg:gap-20">
          {/* Narrative + metrics + CTA */}
          <div className="flex flex-col gap-10">
            <div className="flex flex-col gap-8">
              {STORY.map((s, i) => (
                <Reveal key={s.labelKey} delay={i * 0.08} className="border-l-2 border-primary/40 pl-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                    {t(s.labelKey)}
                  </p>
                  <p className="mt-3 text-base md:text-lg font-light leading-relaxed text-on-surface/75">
                    {t(s.bodyKey)}
                  </p>
                </Reveal>
              ))}
            </div>

            <Reveal className="grid grid-cols-2 gap-x-8 gap-y-8 border-t border-outline-variant/30 pt-10">
              {METRICS.map((m) => (
                <div key={m.valueKey} className="flex flex-col gap-1.5">
                  <CountUp
                    value={t(m.valueKey)}
                    className="font-headline text-3xl md:text-4xl font-bold tracking-tighter text-on-surface"
                  />
                  <span className="text-[11px] md:text-xs font-medium uppercase tracking-widest leading-snug text-on-surface-variant">
                    {t(m.labelKey)}
                  </span>
                </div>
              ))}
            </Reveal>

            <Reveal>
              <Link
                href={href}
                onClick={() => trackPortfolioClick("jedmar", href)}
                className="inline-flex items-center gap-3 rounded-full bg-primary px-7 py-3.5 text-sm font-medium uppercase tracking-widest text-on-primary transition-all hover:gap-5 hover:bg-primary-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
              >
                {t("home.jedmar.cta")} <span aria-hidden="true">→</span>
              </Link>
            </Reveal>
          </div>

          {/* Device mockups */}
          <Reveal delay={0.1} className="lg:pt-4">
            <DeviceDuo
              url="https://jedmar.pl/pl/schematy-narzedzi"
              desktopSrc="/screenshots/v2/jedmar-schemat-tool-desktop.webp"
              desktopAlt="Jedmar — interaktywny schemat narzędzia na jedmar.pl"
              phoneSrc="/screenshots/jedmar-app1.webp"
              phoneAlt="Jedmar — natywna aplikacja mobilna"
            />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
