"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { getProjectBySlug } from "@/lib/projects";
import { trackPortfolioClick } from "@/lib/tracking";
import Reveal from "@/components/ui/reveal";
import CountUp from "@/components/ui/count-up";
import BrowserFrame from "@/components/ui/browser-frame";
import PhoneFrame from "@/components/ui/phone-frame";

type TKey = Parameters<ReturnType<typeof useI18n>["t"]>[0];

// The six featured slugs, in display order, with their device-frame presentation.
// Jedmar is a native app → PhoneFrame; the rest are web → BrowserFrame (v2 shots).
const CARDS: {
  slug: string;
  frame: "phone" | "browser";
  src: string;
}[] = [
  { slug: "jedmar", frame: "phone", src: "/screenshots/v2/jedmar-app-home.webp" },
  { slug: "estalo", frame: "browser", src: "/screenshots/v2/estalo-desktop.webp" },
  { slug: "eportal-prawny", frame: "browser", src: "/screenshots/v2/eportalprawny-desktop.webp" },
  { slug: "wks-poznan", frame: "browser", src: "/screenshots/v2/wks-desktop.webp" },
  { slug: "skup-nieruchomosci", frame: "browser", src: "/screenshots/v2/skup-desktop.webp" },
  { slug: "rejestr-pro", frame: "browser", src: "/screenshots/v2/rejestr-pro-desktop.webp" },
];

const CATEGORY_KEY: Record<string, TKey> = {
  produkty: "home.cat.produkty",
  "dla-klientow": "home.cat.klienci",
  marketing: "home.cat.marketing",
};

export default function PortfolioGrid() {
  const { t, lang } = useI18n();

  return (
    <section className="relative bg-surface py-24 md:py-32 border-t border-outline-variant/20">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24">
        <Reveal className="mb-14 max-w-3xl md:mb-20">
          <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] text-primary">
            {t("home.portfolio.eyebrow")}
          </p>
          <h2 className="mt-5 font-headline text-3xl md:text-5xl font-bold tracking-tight text-on-surface">
            {t("home.portfolio.title")}
          </h2>
          <p className="mt-6 text-lg font-light leading-relaxed text-on-surface/70">
            {t("home.portfolio.sub")}
          </p>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-2 md:gap-10">
          {CARDS.map((card, i) => {
            const project = getProjectBySlug(card.slug);
            if (!project) return null;
            const href = `/projects/${project.slug}`;
            const metric = project.metrics?.[0];
            const statusLabel = project.statusLabel?.[lang];
            const liveHost = project.liveUrl
              ? project.liveUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")
              : "programo.pl";
            // Domain only for the compact label / browser address (drop any path).
            const domain = liveHost.split("/")[0];

            return (
              <Reveal key={card.slug} delay={(i % 2) * 0.1} className="h-full">
                <Link
                  href={href}
                  onClick={() => trackPortfolioClick(card.slug, href)}
                  className="group flex h-full flex-col overflow-hidden rounded-3xl border border-outline-variant/40 bg-surface transition-all duration-300 hover:border-primary/50 hover:shadow-[0_24px_60px_-32px_rgba(0,0,0,0.45)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
                >
                  {/* Media — frames render as a top-anchored "peek": their own
                      radius/border/shadow are stripped (browser) or the lower edge is
                      faded (phone) so nothing is ever cut off on a hard, flat line.
                      The card's rounded top clips the frame; a bottom gradient softens
                      the crop. Pattern mirrors featured-work.tsx. */}
                  <div className="relative h-[280px] overflow-hidden bg-gradient-to-b from-surface-container-low to-surface md:h-[320px]">
                    {card.frame === "phone" ? (
                      <div className="absolute inset-x-0 top-8 flex justify-center px-6 md:px-8">
                        <div className="w-[44%] max-w-[172px] transition-transform duration-500 group-hover:-translate-y-1">
                          <PhoneFrame
                            src={card.src}
                            alt={`${project.title} — aplikacja mobilna`}
                            fadeBottom
                            ownStatusBar
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="absolute inset-x-0 top-0 transition-transform duration-500 group-hover:-translate-y-1">
                        <BrowserFrame
                          url={domain}
                          src={card.src}
                          alt={`${project.title} — ${domain}`}
                          className="rounded-none border-0 shadow-none"
                        />
                      </div>
                    )}
                    {/* Soft bottom fade — the intentional edge of the peek */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-surface via-surface/70 to-transparent"
                    />
                  </div>

                  {/* Body */}
                  <div className="flex flex-1 flex-col gap-4 p-6 md:p-8">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                        {t(CATEGORY_KEY[project.category])}
                      </span>
                      <span className="font-mono text-xs uppercase tracking-widest text-on-surface-variant/70">
                        {domain}
                      </span>
                    </div>

                    <h3 className="font-headline text-2xl md:text-3xl font-bold tracking-tight text-on-surface transition-colors group-hover:text-primary">
                      {project.title}
                    </h3>

                    {metric && (
                      <div className="flex items-baseline gap-3 border-t border-outline-variant/30 pt-4">
                        <CountUp
                          value={metric.value}
                          className="font-headline text-2xl md:text-3xl font-bold tracking-tight text-primary"
                        />
                        <span className="text-sm font-light leading-snug text-on-surface/70">
                          {metric.label[lang]}
                        </span>
                      </div>
                    )}

                    {statusLabel && (
                      <p className="flex items-start gap-2 text-xs leading-relaxed text-on-surface-variant">
                        <span
                          aria-hidden="true"
                          className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${
                            project.status === "live" ? "bg-primary" : "bg-on-surface-variant/60"
                          }`}
                        />
                        {statusLabel}
                      </p>
                    )}

                    <div className="mt-auto flex flex-wrap gap-2 pt-2">
                      {project.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full border border-outline-variant/50 px-3 py-1 text-[11px] font-medium text-on-surface-variant"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <span className="mt-2 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-on-surface transition-all group-hover:gap-3.5 group-hover:text-primary">
                      {t("home.portfolio.view")} <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>

        <Reveal className="mt-14 flex justify-center md:mt-16">
          <Link
            href="/projekty"
            className="inline-flex items-center gap-3 rounded-full border border-on-surface/30 px-7 py-3.5 text-sm font-medium uppercase tracking-widest text-on-surface transition-all hover:gap-5 hover:border-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
          >
            {t("home.portfolio.all")} <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
