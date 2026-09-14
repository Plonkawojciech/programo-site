"use client";

import Image from "next/image";
import { useState } from "react";
import CompactLeadForm from "@/components/compact-lead-form";
import { useI18n } from "@/lib/i18n";
import type { Demo, DemoIndustry } from "@/lib/demos";
import { DEMO_INDUSTRIES } from "@/lib/demos";
import { trackPortfolioClick } from "@/lib/tracking";

type DemoWithScreenshot = Demo & { hasDesktopScreenshot: boolean };
type Filter = DemoIndustry | "all";

const CONTAINER = "mx-auto w-full max-w-[1400px] px-6 md:px-12 lg:px-24";

function DomainPill({ host }: { host: string }) {
  return (
    <span className="pointer-events-none absolute bottom-3 left-3 z-10 flex items-center gap-1.5 rounded-full bg-black/70 px-3 py-1.5 text-[10px] font-medium tracking-wide text-white backdrop-blur-sm">
      <svg viewBox="0 0 24 24" className="h-2.5 w-2.5 opacity-70" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
        <rect x="5" y="11" width="14" height="9" rx="2" />
        <path d="M8 11V7a4 4 0 018 0v4" />
      </svg>
      {host}
    </span>
  );
}

function canvasTextColor(hex: string): "#051F20" | "#FFFFFF" {
  const [r, g, b] = [1, 3, 5].map((offset) => Number.parseInt(hex.slice(offset, offset + 2), 16));
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.58 ? "#051F20" : "#FFFFFF";
}

function DemoCard({ demo, lang, screenshotAlt }: { demo: DemoWithScreenshot; lang: "pl" | "en"; screenshotAlt: string }) {
  const meta = [demo.sector[lang], demo.city].filter(Boolean).join(" · ");

  return (
    <article
      data-industry={demo.industry}
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-card shadow-card transition duration-300 motion-reduce:transition-none hover:-translate-y-1 hover:shadow-card-hover motion-reduce:hover:translate-y-0"
    >
      <a
        href={demo.url}
        target="_blank"
        rel="nofollow noopener noreferrer"
        onClick={() => trackPortfolioClick(demo.slug, demo.url)}
        aria-label={`${demo.name}: ${demo.sector[lang]}`}
        className="flex flex-1 flex-col focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-[-2px]"
      >
        <span className="h-1 w-full shrink-0" style={{ backgroundColor: demo.accentColor }} aria-hidden="true" />
        <div
          className="relative h-[230px] overflow-hidden sm:h-[250px] md:h-[270px]"
          style={
            demo.hasDesktopScreenshot
              ? { background: `linear-gradient(150deg, ${demo.accentColor}33 0%, ${demo.accentColor}12 58%, transparent 100%)` }
              : { backgroundColor: demo.accentColor }
          }
        >
          {demo.hasDesktopScreenshot ? (
            <div className="absolute left-[7%] right-[-5%] top-[13%] overflow-hidden rounded-lg border border-black/10 shadow-[0_10px_30px_-8px_rgba(5,31,32,0.35)] transition-transform duration-500 ease-out motion-reduce:transition-none group-hover:-translate-y-2 motion-reduce:group-hover:translate-y-0">
              <Image
                src={`/screenshots/demos/${demo.slug}-desktop.webp`}
                alt={screenshotAlt.replace("{name}", demo.name)}
                width={2400}
                height={1500}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 430px"
                className="h-auto w-full"
              />
            </div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center px-8">
              <span
                className="max-w-full text-center font-headline text-4xl font-bold leading-tight drop-shadow-sm md:text-5xl"
                style={{ color: canvasTextColor(demo.accentColor) }}
              >
                {demo.name}
              </span>
            </div>
          )}
          <DomainPill host={demo.host} />
        </div>

        <div className="flex flex-1 flex-col p-5 md:p-6">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-on-surface-variant">{meta}</p>
          <h3 className="mt-2 font-headline text-2xl font-bold leading-tight tracking-tight text-on-surface">{demo.name}</h3>
          <p className="mt-3 flex-1 text-sm font-light leading-relaxed text-on-surface/70">{demo.summary[lang]}</p>
          {demo.pages && (
            <div className="mt-5 flex flex-wrap gap-2">
              {demo.pages[lang].map((page) => (
                <span key={page} className="rounded-full border border-outline-variant/50 px-3 py-1 text-[11px] text-on-surface-variant">
                  {page}
                </span>
              ))}
            </div>
          )}
        </div>
      </a>

      {demo.variant && (
        <a
          href={demo.variant.url}
          target="_blank"
          rel="nofollow noopener noreferrer"
          onClick={() => trackPortfolioClick(`${demo.slug}-variant`, demo.variant!.url)}
          className="mx-5 mb-5 inline-flex min-h-11 items-center self-start text-sm font-medium text-primary underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 md:mx-6 md:mb-6"
        >
          {demo.variant.label[lang]}
        </a>
      )}
    </article>
  );
}

export default function DemoPageContent({ demos }: { demos: DemoWithScreenshot[] }) {
  const { lang, t } = useI18n();
  const [filter, setFilter] = useState<Filter>("all");
  const process = ["talk", "demo", "decision"] as const;

  return (
    <main className="bg-surface text-on-surface">
      <section className="pt-32 pb-20 md:pt-40 md:pb-28">
        <div className={`${CONTAINER} grid gap-14 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.6fr)] lg:items-end lg:gap-20`}>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">{t("demos.hero.eyebrow")}</p>
            <h1 className="mt-5 max-w-4xl font-headline text-4xl font-bold leading-[1.04] tracking-tighter md:text-6xl 2xl:text-7xl">
              {t("demos.hero.title")}
            </h1>
            <p className="mt-7 max-w-3xl text-lg font-light leading-relaxed text-on-surface/70 md:text-xl">
              {t("demos.hero.lead")}
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a href="#kontakt" className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-6 py-3.5 text-sm font-medium text-on-primary transition-colors hover:bg-primary-container focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2">
                {t("demos.hero.primaryCta")}
              </a>
              <a href="#jak-to-dziala" className="inline-flex min-h-12 items-center justify-center rounded-full border border-outline-variant/70 px-6 py-3.5 text-sm font-medium text-on-surface transition-colors hover:border-primary hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2">
                {t("demos.hero.secondaryCta")}
              </a>
            </div>
          </div>

          <dl className="grid grid-cols-3 gap-4 lg:grid-cols-1">
            {[
              [String(demos.length), t("demos.stats.online")],
              ["0 zł", t("demos.stats.free")],
              ["2–4", t("demos.stats.pages")],
            ].map(([value, label]) => (
              <div key={label} className="border-t border-outline-variant/50 pt-4 lg:grid lg:grid-cols-[100px_1fr] lg:items-baseline lg:gap-4">
                <dt className="font-headline text-3xl font-bold tracking-tight md:text-4xl">{value}</dt>
                <dd className="mt-1 text-xs leading-snug text-on-surface-variant lg:mt-0">{label}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section id="jak-to-dziala" className="scroll-mt-24 bg-surface-container-low py-20 md:py-24">
        <div className={CONTAINER}>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-primary">{t("demos.process.eyebrow")}</p>
          <ol role="list" className="mt-8 grid gap-5 md:grid-cols-3">
            {process.map((step, index) => (
              <li key={step} className="rounded-2xl bg-card p-6 shadow-card md:p-7">
                <div className="border-t border-outline-variant/50 pt-5">
                <p className="text-xs font-medium tracking-[0.16em] text-on-surface-variant">
                  {String(index + 1).padStart(2, "0")} · {t(`demos.process.${step}.label`)}
                </p>
                <h2 className="mt-5 font-headline text-2xl font-bold leading-tight tracking-tight md:text-3xl">
                  {t(`demos.process.${step}.title`)}
                </h2>
                <p className="mt-4 text-sm font-light leading-relaxed text-on-surface/70 md:text-base">
                  {t(`demos.process.${step}.body`)}
                </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className={CONTAINER}>
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="max-w-3xl">
              <h2 className="font-headline text-4xl font-bold tracking-tight md:text-5xl">{t("demos.grid.title")}</h2>
              <p className="mt-5 text-base font-light leading-relaxed text-on-surface/70 md:text-lg">{t("demos.grid.lead")}</p>
            </div>
            <div role="group" aria-label={t("demos.filter.label")} className="flex flex-wrap gap-2">
              {([{ key: "all", label: { pl: t("demos.filter.all"), en: t("demos.filter.all") } }, ...DEMO_INDUSTRIES] as const).map((item) => (
                <button
                  key={item.key}
                  type="button"
                  aria-pressed={filter === item.key}
                  onClick={() => setFilter(item.key)}
                  className={`min-h-11 rounded-full px-4 py-2 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2 ${filter === item.key ? "bg-primary text-on-primary" : "border border-outline-variant/50 text-on-surface-variant hover:border-primary hover:text-on-surface"}`}
                >
                  {item.key === "all" ? t("demos.filter.all") : item.label[lang]}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {demos.map((demo) => (
              <div key={demo.slug} hidden={filter !== "all" && filter !== demo.industry}>
                <DemoCard demo={demo} lang={lang} screenshotAlt={t("demos.card.screenshotAlt")} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="kontakt" className="scroll-mt-24 bg-[#051F20] py-20 text-[#DAF1DE] md:py-24">
        <div className={`${CONTAINER} grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(460px,1.1fr)] lg:items-center lg:gap-16`}>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#8EB69B]">{t("demos.cta.eyebrow")}</p>
            <h2 className="mt-5 max-w-2xl font-headline text-4xl font-bold leading-tight tracking-tight md:text-5xl">{t("demos.cta.title")}</h2>
            <p className="mt-5 max-w-xl text-base font-light leading-relaxed text-[#DAF1DE]/75 md:text-lg">{t("demos.cta.lead")}</p>
          </div>
          <CompactLeadForm bare formId="dema" projectType={t("demos.form.projectType")} heading={t("demos.hero.primaryCta")} />
        </div>
      </section>
    </main>
  );
}
