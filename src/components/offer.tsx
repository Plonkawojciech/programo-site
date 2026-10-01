"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import Reveal from "@/components/ui/reveal";
import PhoneFrame from "@/components/ui/phone-frame";
import BrowserFrame from "@/components/ui/browser-frame";
import DeviceDuo from "@/components/ui/device-duo";
import { getProjectBySlug } from "@/lib/projects";
import { trackPortfolioClick } from "@/lib/tracking";

type TKey = Parameters<ReturnType<typeof useI18n>["t"]>[0];

// What each pillar shows instead of the old one-line "see example" link. Every
// screenshot below is already used on the matching project's own detail page
// (src/lib/projects.ts) - nothing invented for this card.
type PillarVisual =
  | { kind: "phones"; screenshots: [string, string]; ownStatusBar?: boolean }
  | { kind: "browser"; screenshot: string; tone?: "auto" | "dark" }
  | { kind: "duo"; desktop: string; mobile: string };

interface Pillar {
  titleKey: TKey;
  descKey: TKey;
  captionKey: TKey;
  bulletKeys: TKey[];
  href: string;
  projectSlug: string;
  visual: PillarVisual;
}

// Five pillars, 1:1 with the cennik.md categories so /oferta and /cennik list
// the same products. Project per pillar: whichever `.example` already named
// (Estalo, Jedmar, Jedmar, Skup Nieruchomości) - for the new AI pillar,
// ePortal Prawny is the only project with an honest AI example (a two-stage
// Claude pipeline classifying cases), so it gets no invented substitute.
const pillars: Pillar[] = [
  {
    titleKey: "offer.pillar1.title",
    descKey: "offer.pillar1.desc",
    captionKey: "offer.pillar1.example",
    bulletKeys: ["offer.pillar1.b1", "offer.pillar1.b2", "offer.pillar1.b3", "offer.pillar1.b4", "offer.pillar1.b5"],
    href: "/aplikacje-webowe-dla-firm",
    projectSlug: "estalo",
    visual: { kind: "browser", screenshot: "/screenshots/v2/estalo-enterprise-desktop.webp" },
  },
  {
    titleKey: "offer.pillar2.title",
    descKey: "offer.pillar2.desc",
    captionKey: "offer.pillar2.example",
    bulletKeys: ["offer.pillar2.b1", "offer.pillar2.b2", "offer.pillar2.b3", "offer.pillar2.b4", "offer.pillar2.b5"],
    href: "/aplikacje-mobilne-dla-firm",
    projectSlug: "jedmar",
    visual: {
      kind: "phones",
      screenshots: ["/screenshots/v2/jedmar-app-home.webp", "/screenshots/v2/jedmar-app-category.webp"],
      ownStatusBar: true,
    },
  },
  {
    titleKey: "offer.pillar3.title",
    descKey: "offer.pillar3.desc",
    captionKey: "offer.pillar3.example",
    bulletKeys: ["offer.pillar3.b1", "offer.pillar3.b2", "offer.pillar3.b3", "offer.pillar3.b4", "offer.pillar3.b5"],
    href: "/sklepy-internetowe",
    projectSlug: "jedmar",
    visual: { kind: "browser", screenshot: "/screenshots/v2/jedmar-schemat-tool-desktop.webp" },
  },
  {
    titleKey: "offer.pillar4.title",
    descKey: "offer.pillar4.desc",
    captionKey: "offer.pillar4.example",
    bulletKeys: ["offer.pillar4.b1", "offer.pillar4.b2", "offer.pillar4.b3", "offer.pillar4.b4", "offer.pillar4.b5"],
    href: "/strony-tracking-reklamy",
    projectSlug: "skup-nieruchomosci",
    visual: {
      kind: "duo",
      desktop: "/screenshots/v2/skup-nieruchomosci-desktop.webp",
      mobile: "/screenshots/v2/skup-nieruchomosci-mobile.webp",
    },
  },
  {
    titleKey: "offer.pillar5.title",
    descKey: "offer.pillar5.desc",
    captionKey: "offer.pillar5.example",
    bulletKeys: ["offer.pillar5.b1", "offer.pillar5.b2", "offer.pillar5.b3", "offer.pillar5.b4", "offer.pillar5.b5"],
    href: "/oferta",
    projectSlug: "eportal-prawny",
    visual: { kind: "browser", screenshot: "/screenshots/v2/eportal-prawny-desktop.webp" },
  },
];

function host(url: string | undefined, slug: string): string {
  if (!url) return `programo.pl/projects/${slug}`;
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

// The realization card's canvas: same per-project accent/dark treatment as
// the /projekty grid, so a pillar's example reads as the same project.
function PillarVisualFrame({ pillar }: { pillar: Pillar }) {
  const project = getProjectBySlug(pillar.projectSlug);
  if (!project) return null;
  const darkCanvas = project.presentation === "dark" || project.presentation === "mosaic";
  const canvasStyle = darkCanvas
    ? { backgroundColor: project.bgColor }
    : { background: `linear-gradient(150deg, ${project.accentColor}1f 0%, ${project.accentColor}0a 55%, transparent 100%)` };
  const url = host(project.liveUrl, project.slug);

  const visual = pillar.visual;

  return (
    <div
      className="relative flex min-h-[220px] items-center justify-center overflow-hidden rounded-t-3xl p-6 sm:min-h-[240px] md:min-h-[260px]"
      style={canvasStyle}
    >
      {visual.kind === "phones" && (
        <div className="flex items-end gap-4">
          {visual.screenshots.map((src, i) => (
            <div key={src} className={`w-[112px] shrink-0 sm:w-[124px] ${i === 1 ? "translate-y-3" : ""}`}>
              <PhoneFrame src={src} alt={project.title} ownStatusBar={visual.ownStatusBar} />
            </div>
          ))}
        </div>
      )}
      {visual.kind === "browser" && (
        <div className="w-full max-w-[360px]">
          <BrowserFrame url={url} src={visual.screenshot} alt={project.title} tone={visual.tone ?? "auto"} />
        </div>
      )}
      {visual.kind === "duo" && (
        <div className="w-full max-w-[300px] pt-3">
          <DeviceDuo
            url={url}
            desktopSrc={visual.desktop}
            desktopAlt={project.title}
            phoneSrc={visual.mobile}
            phoneAlt={project.title}
          />
        </div>
      )}
    </div>
  );
}

// The whole card is the link (plan requirement: every realization is
// clickable straight to /projects/[slug]) - visual on top, project name and
// the honest one-line caption underneath.
function PillarExample({ pillar, t }: { pillar: Pillar; t: ReturnType<typeof useI18n>["t"] }) {
  const project = getProjectBySlug(pillar.projectSlug);
  if (!project) return null;

  return (
    <Link
      href={`/projects/${project.slug}`}
      onClick={() => trackPortfolioClick(project.slug, `/projects/${project.slug}`)}
      aria-label={`${t("offer.seeExample")}: ${project.title}`}
      className="group flex h-full flex-col overflow-hidden rounded-3xl bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-card-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
    >
      <PillarVisualFrame pillar={pillar} />
      <div className="flex items-start justify-between gap-4 p-6 md:p-7">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary">{t("offer.seeExample")}</p>
          <p className="mt-1.5 font-headline text-lg font-bold text-on-surface">{project.title}</p>
          <p className="mt-1 text-sm font-light leading-snug text-on-surface-variant">{t(pillar.captionKey)}</p>
        </div>
        <span
          aria-hidden="true"
          className="mt-1 shrink-0 text-primary transition-transform duration-300 group-hover:translate-x-1"
        >
          →
        </span>
      </div>
    </Link>
  );
}

export default function Offer() {
  const { t } = useI18n();

  return (
    <section className="relative bg-surface py-section">
      <div className="mx-auto w-full max-w-[1400px] px-6 md:px-12 lg:px-24">
        <Reveal className="mb-12 max-w-3xl md:mb-16">
          <h1 className="font-headline text-4xl font-bold tracking-tighter text-on-surface md:text-7xl">
            {t("offer.title")}
          </h1>
          <p className="mt-6 text-lg font-light leading-relaxed text-on-surface/70 md:text-xl">
            {t("offer.lead")}
          </p>
        </Reveal>

        {/* Numbered list, so the numeral in the heading is decoration the
            screen reader can skip — the <ol> already carries the count. */}
        <ol role="list" className="flex flex-col gap-10 md:gap-14">
          {pillars.map((p, i) => (
            <li key={p.titleKey}>
              <Reveal
                delay={Math.min(i * 0.08, 0.3)}
                className="grid gap-8 border-t border-outline-variant/30 pt-10 md:pt-12 lg:grid-cols-[1.3fr_1fr] lg:gap-16"
              >
                <div>
                  {/* Owner-editable: an empty <h2> still occupies a line box
                      at 36-40px and breaks the heading outline for screen
                      readers, so drop the element rather than render it blank. */}
                  {t(p.titleKey).trim() && (
                    <h2 className="font-headline text-3xl font-bold tracking-tight text-on-surface md:text-4xl">
                      <span className="mr-2 text-on-surface-variant" aria-hidden="true">
                        {i + 1}.
                      </span>
                      {t(p.titleKey)}
                    </h2>
                  )}
                  <p className="mt-5 max-w-2xl text-base font-light leading-relaxed text-on-surface/70 md:text-lg">
                    {t(p.descKey)}
                  </p>
                  <ul className="mt-6 flex flex-col gap-3.5">
                    {p.bulletKeys.map((k) => (
                      <li key={k} className="flex items-start gap-3 text-sm leading-relaxed text-on-surface/80 md:text-base">
                        <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        {t(k)}
                      </li>
                    ))}
                  </ul>
                  {p.href !== "/oferta" && (
                    <Link
                      href={p.href}
                      className="mt-6 inline-flex items-center gap-3 text-sm font-medium uppercase tracking-widest text-primary transition-all hover:gap-5"
                    >
                      {t("offer.learnMore")}
                      <span aria-hidden="true">→</span>
                    </Link>
                  )}
                </div>
                <PillarExample pillar={p} t={t} />
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal className="mt-14 flex flex-col items-start gap-6 rounded-3xl bg-primary p-8 md:mt-20 md:flex-row md:items-center md:justify-between md:p-12">
          <h2 className="font-headline text-2xl font-bold tracking-tight text-on-primary md:text-4xl">
            {t("main.cta.primary")}
          </h2>
          <Link
            href="/kontakt#kontakt-main"
            className="inline-flex shrink-0 items-center gap-3 border-b border-on-primary/40 pb-1 text-sm font-medium uppercase tracking-widest text-on-primary transition-all hover:gap-5"
          >
            {t("nav.cta")} <span aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
