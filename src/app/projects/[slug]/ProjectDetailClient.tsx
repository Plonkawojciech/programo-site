"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";
import { getProjectBySlug, getAdjacentProjects, type Project } from "@/lib/projects";
import BrowserFrame from "@/components/ui/browser-frame";
import PhoneFrame from "@/components/ui/phone-frame";
import DeviceDuo from "@/components/ui/device-duo";
import CountUp from "@/components/ui/count-up";
import Reveal from "@/components/ui/reveal";
import { trackPortfolioClick } from "@/lib/tracking";

const CATEGORY_LABELS: Record<Project["category"], { pl: string; en: string }> = {
  produkty: { pl: "Produkt Programo", en: "Programo product" },
  "dla-klientow": { pl: "Dla klienta", en: "Client work" },
  marketing: { pl: "Tracking i reklamy", en: "Tracking & ads" },
};

const isDesktopShot = (s: string) => /desktop/.test(s);
// App screens use either an "-app-<name>" or "-app<n>" filename convention.
const isAppShot = (s: string) => /-app[-\d]/.test(s);
const isPhoneShot = (s: string) => /mobile/.test(s) || isAppShot(s);
// Screenshots that are themselves dark-UI captures — their browser chrome should
// switch to the dark tone so the frame matches the product inside.
const isDarkShot = (s: string) => /cockpit|enterprise|wsafe/.test(s);

// Effective hero variant: falls back to "phones" for mobile-app projects, else "light".
function presentation(project: Project): NonNullable<Project["presentation"]> {
  return project.presentation ?? (project.kind === "mobile-app" ? "phones" : "light");
}

// The screenshots consumed by the hero — kept in sync between HeroDevices and the
// Gallery so the gallery never repeats what the hero already shows.
function heroShots(project: Project): string[] {
  const shots = project.screenshots ?? [];
  switch (presentation(project)) {
    case "phones": {
      const phones = shots.filter(isAppShot).slice(0, 3);
      return phones.length > 0 ? phones : shots.filter(isPhoneShot).slice(0, 3);
    }
    case "mosaic":
      return shots.filter(isDesktopShot).slice(0, 2);
    case "dark": {
      const desktop = shots.find(isDesktopShot) ?? shots[0];
      return desktop ? [desktop] : [];
    }
    default: {
      const desktop = shots.find(isDesktopShot) ?? shots[0];
      const phone = shots.find((s) => /mobile/.test(s)) ?? shots[1];
      return [desktop, phone].filter(Boolean) as string[];
    }
  }
}

function host(url?: string, slug?: string) {
  if (!url) return `programo.pl/projects/${slug}`;
  return url.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

// Small labelled fact used in the meta strip below the hero.
function Fact({
  label,
  dark = false,
  children,
}: {
  label: string;
  dark?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <dt
        className={`text-[10px] font-bold uppercase tracking-[0.25em] ${
          dark ? "text-white/50" : "text-on-surface-variant/70"
        }`}
      >
        {label}
      </dt>
      <dd
        className={`mt-1.5 text-sm font-medium leading-snug ${dark ? "text-white/85" : "text-on-surface"}`}
      >
        {children}
      </dd>
    </div>
  );
}

function HeroDevices({ project, lang }: { project: Project; lang: Lang }) {
  const url = host(project.liveUrl, project.slug);
  const desktopAlt = `${project.title} — ${lang === "pl" ? "widok desktop" : "desktop view"}`;
  const pres = presentation(project);

  // Variant C — a row of phone frames for mobile-first products.
  if (pres === "phones") {
    const list = heroShots(project);
    // On small screens the three phones are wider than the column, so they live
    // in a self-contained horizontal scroll-snap track — the document itself
    // never gains a horizontal scrollbar. From md up they fit and center.
    return (
      <div className="-mx-6 overflow-x-auto px-6 [-ms-overflow-style:none] [scrollbar-width:none] md:mx-0 md:overflow-x-visible md:px-0 [&::-webkit-scrollbar]:hidden">
        <div className="flex snap-x snap-mandatory items-end gap-4 py-2 sm:gap-6 md:justify-center md:gap-8">
          {list.map((src, i) => (
            <div
              key={src}
              className={`w-[150px] shrink-0 snap-center sm:w-[160px] md:w-[168px] ${i === 1 ? "md:-translate-y-6" : ""}`}
            >
              <PhoneFrame
                src={src}
                alt={`${project.title} — ${lang === "pl" ? "ekran aplikacji" : "app screen"} ${i + 1}`}
                priority={i === 0}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Variant D — two overlapping browser frames for a multi-surface ecosystem.
  if (pres === "mosaic") {
    const [primary, secondary] = heroShots(project);
    if (!primary) return null;
    return (
      <div className="relative">
        <div className="md:pr-[14%]">
          <BrowserFrame
            url={url}
            src={primary}
            alt={desktopAlt}
            tone={isDarkShot(primary) ? "dark" : "auto"}
            priority
          />
        </div>
        {secondary && (
          <div className="mt-4 md:-mt-6 md:pl-[14%]">
            <BrowserFrame
              url={url}
              src={secondary}
              alt={`${project.title} — ${lang === "pl" ? "drugi widok" : "second view"}`}
              tone={isDarkShot(secondary) ? "dark" : "auto"}
            />
          </div>
        )}
      </div>
    );
  }

  // Variant B — a single browser frame floating on the dark canvas.
  if (pres === "dark") {
    const [desktop] = heroShots(project);
    if (!desktop) return null;
    return (
      <BrowserFrame
        url={url}
        src={desktop}
        alt={desktopAlt}
        tone={isDarkShot(desktop) ? "dark" : "auto"}
        priority
      />
    );
  }

  // Variant A — DeviceDuo (desktop browser + overlapping phone) on the page surface.
  const [desktop, phone] = heroShots(project);
  if (desktop && phone) {
    return (
      <DeviceDuo
        url={url}
        desktopSrc={desktop}
        desktopAlt={desktopAlt}
        phoneSrc={phone}
        phoneAlt={`${project.title} — ${lang === "pl" ? "widok mobilny" : "mobile view"}`}
        priority
      />
    );
  }
  if (desktop) {
    return <BrowserFrame url={url} src={desktop} alt={desktopAlt} priority />;
  }
  return null;
}

function Gallery({ project, lang }: { project: Project; lang: Lang }) {
  const shots = project.screenshots ?? [];
  // Screenshots already shown in the hero — never repeat them here.
  const used = new Set(heroShots(project));
  const rest = shots.filter((s) => !used.has(s));
  if (rest.length === 0) return null;

  return (
    <section className="bg-surface px-6 py-20 sm:px-8 md:px-12 md:py-28 lg:px-24">
      <div className="mx-auto max-w-[1200px]">
        <Reveal>
          <h2 className="mb-10 font-headline text-3xl font-bold tracking-tight text-on-surface md:mb-14 md:text-5xl">
            {lang === "pl" ? "Galeria" : "Gallery"}
          </h2>
        </Reveal>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8">
          {rest.map((src, i) => (
            <Reveal key={src} delay={i * 0.08}>
              {isPhoneShot(src) && !isDesktopShot(src) ? (
                <div className="mx-auto w-[200px]">
                  <PhoneFrame src={src} alt={`${project.title} — ${i + 1}`} />
                </div>
              ) : (
                <BrowserFrame
                  url={host(project.liveUrl, project.slug)}
                  src={src}
                  alt={`${project.title} — ${i + 1}`}
                />
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectContent({ slug }: { slug: string }) {
  const { t, lang } = useI18n();
  const project = getProjectBySlug(slug);
  const { prev, next } = getAdjacentProjects(slug);

  if (!project) return null;

  const paragraphs = project.longDescription[lang]
    .split("\n")
    .map((p) => p.trim())
    .filter(Boolean);

  const liveLabel =
    project.status === "live"
      ? lang === "pl"
        ? "Zobacz na żywo"
        : "Visit site"
      : lang === "pl"
        ? "Zobacz podgląd"
        : "See preview";

  // Variants B (dark) and D (mosaic) render the hero as a full-bleed dark canvas
  // tinted with the project's own bgColor, with the accent driving the eyebrow.
  const darkHero = presentation(project) === "dark" || presentation(project) === "mosaic";

  return (
    <div className="min-h-screen overflow-x-clip bg-surface text-on-surface">
      {/* Hero */}
      <section
        className="px-6 pt-28 pb-16 sm:px-8 md:px-12 md:pt-36 md:pb-24 lg:px-24"
        style={darkHero ? { backgroundColor: project.bgColor } : undefined}
      >
        <div className="mx-auto max-w-[1200px]">
          <Link
            href="/projekty"
            className={`inline-flex items-center gap-2 text-xs font-medium uppercase tracking-widest transition-colors ${
              darkHero
                ? "text-white/60 hover:text-white"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            {t("project.backToProjects")}
          </Link>

          <div className="mt-8 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
            {/* Left: title + intro */}
            <div className="lg:col-span-5">
              <span
                className="text-[11px] font-bold uppercase tracking-[0.3em]"
                style={darkHero ? { color: project.accentColor } : undefined}
              >
                <span className={darkHero ? undefined : "text-primary"}>
                  {CATEGORY_LABELS[project.category][lang]}
                </span>
                <span className={darkHero ? "text-white/40" : "text-on-surface-variant/60"}>
                  {" · "}
                  {project.year}
                </span>
              </span>
              <h1
                className={`mt-5 font-headline text-5xl font-bold leading-[1.02] tracking-tight md:text-7xl ${
                  darkHero ? "text-white" : "text-on-surface"
                }`}
              >
                {project.title}
              </h1>
              <p
                className={`mt-6 text-lg font-light leading-relaxed md:text-xl ${
                  darkHero ? "text-white/70" : "text-on-surface/75"
                }`}
              >
                {project.subtitle[lang]}
              </p>

              {project.statusLabel && (
                <p
                  className={`mt-8 inline-flex items-center gap-2.5 rounded-full border px-4 py-2 text-sm font-medium ${
                    darkHero
                      ? "border-white/15 bg-white/[0.06] text-white/90"
                      : "border-outline-variant/50 bg-surface-container-low text-on-surface"
                  }`}
                >
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: project.accentColor }}
                    aria-hidden="true"
                  />
                  {project.statusLabel[lang]}
                </p>
              )}

              {project.liveUrl && (
                <div className="mt-8">
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackPortfolioClick(project.slug, project.liveUrl!)}
                    className={`inline-flex items-center gap-3 rounded-full px-6 py-3.5 text-sm font-medium uppercase tracking-widest transition-all hover:gap-5 ${
                      darkHero
                        ? "bg-white text-[#0a0a0a] hover:bg-white/90"
                        : "bg-primary text-on-primary hover:bg-primary-container"
                    }`}
                  >
                    {liveLabel} <span aria-hidden="true">↗</span>
                  </a>
                </div>
              )}
            </div>

            {/* Right: device hero */}
            <div className="lg:col-span-7">
              <HeroDevices project={project} lang={lang} />
            </div>
          </div>

          {/* Meta strip */}
          <dl
            className={`mt-16 grid grid-cols-2 gap-8 border-t pt-10 sm:grid-cols-3 lg:grid-cols-4 ${
              darkHero ? "border-white/10" : "border-outline-variant/30"
            }`}
          >
            <Fact label={t("project.role")} dark={darkHero}>
              {project.role[lang]}
            </Fact>
            {project.client && (
              <Fact label={lang === "pl" ? "Klient" : "Client"} dark={darkHero}>
                {project.client[lang]}
              </Fact>
            )}
            {project.scope && (
              <Fact label={lang === "pl" ? "Zakres" : "Scope"} dark={darkHero}>
                {project.scope[lang]}
              </Fact>
            )}
            {project.partner && (
              <Fact label={lang === "pl" ? "Współpraca" : "Collaboration"} dark={darkHero}>
                {lang === "pl" ? "We współpracy z " : "In collaboration with "}
                {project.partner}
              </Fact>
            )}
          </dl>
        </div>
      </section>

      {/* Metrics bar */}
      {project.metrics && project.metrics.length > 0 && (
        <section className="border-y border-outline-variant/30 bg-surface-container-low px-6 py-16 sm:px-8 md:px-12 md:py-20 lg:px-24">
          <div className="mx-auto max-w-[1200px]">
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-6">
              {project.metrics.map((m) => (
                <Reveal key={m.label[lang]}>
                  {/* In dark variants the metric strip takes the project accent. */}
                  <div style={darkHero ? { color: project.accentColor } : undefined}>
                    <CountUp
                      value={m.value}
                      className={`font-headline text-4xl font-bold tracking-tight md:text-5xl ${
                        darkHero ? "" : "text-primary"
                      }`}
                    />
                    <p className="mt-2 text-xs font-medium uppercase tracking-wide leading-snug text-on-surface-variant md:text-sm">
                      {m.label[lang]}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Story */}
      <section className="bg-surface px-6 py-20 sm:px-8 md:px-12 md:py-28 lg:px-24">
        <div className="mx-auto grid max-w-[1200px] grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <div className="lg:sticky lg:top-32">
              <h2 className="font-headline text-3xl font-bold tracking-tight text-on-surface md:text-4xl">
                {lang === "pl" ? "Historia projektu" : "The story"}
              </h2>
              <div className="mt-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-on-surface-variant/70">
                  {t("project.techStack")}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-full border border-outline-variant/50 bg-surface-container-low px-3 py-1.5 text-[11px] font-medium tracking-wide text-on-surface-variant"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8">
            <div className="max-w-[68ch] space-y-6">
              {paragraphs.map((p, i) => (
                <Reveal key={i} delay={Math.min(i, 3) * 0.05}>
                  <p className="text-base font-light leading-relaxed text-on-surface/80 md:text-lg md:leading-relaxed">
                    {p}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="border-t border-outline-variant/30 bg-surface px-6 py-20 sm:px-8 md:px-12 md:py-28 lg:px-24">
        <div className="mx-auto max-w-[1200px]">
          <Reveal>
            <h2 className="mb-10 font-headline text-3xl font-bold tracking-tight text-on-surface md:mb-14 md:text-5xl">
              {t("project.whatWeBuilt")}
            </h2>
          </Reveal>
          <div className="grid gap-x-12 gap-y-8 sm:grid-cols-2">
            {project.features[lang].map((f, i) => (
              <Reveal key={i} delay={Math.min(i, 4) * 0.05}>
                <div className="flex gap-4 border-t border-outline-variant/40 pt-5">
                  <span className="font-headline text-lg font-bold text-primary/50">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <p className="text-base font-light leading-relaxed text-on-surface/80">{f}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <Gallery project={project} lang={lang} />

      {/* CTA */}
      <section className="border-t border-outline-variant/30 bg-surface-container-low px-6 py-24 sm:px-8 md:px-12 md:py-32 lg:px-24">
        <div className="mx-auto max-w-[900px] text-center">
          <h2 className="font-headline text-3xl font-bold tracking-tight text-on-surface md:text-5xl">
            {t("project.interestedCta")}
          </h2>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/kontakt"
              className="inline-flex items-center gap-3 rounded-full bg-primary px-7 py-4 text-sm font-medium uppercase tracking-widest text-on-primary transition-all hover:gap-5 hover:bg-primary-container"
            >
              {t("project.letsTalk")} <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/projekty"
              className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-widest text-on-surface-variant transition-colors hover:text-primary"
            >
              {t("project.backToProjects")}
            </Link>
          </div>
        </div>
      </section>

      {/* Prev / Next */}
      {(prev || next) && (
        <nav className="grid grid-cols-1 border-t border-outline-variant/30 sm:grid-cols-2">
          {prev ? (
            <Link
              href={`/projects/${prev.slug}`}
              className="group flex flex-col gap-2 border-b border-outline-variant/30 px-6 py-10 transition-colors hover:bg-surface-container-low sm:border-b-0 sm:border-r sm:px-10 md:px-12 md:py-14"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-on-surface-variant/70">
                {t("project.prevProject")}
              </span>
              <span className="font-headline text-2xl font-bold tracking-tight text-on-surface transition-colors group-hover:text-primary md:text-3xl">
                {prev.title}
              </span>
            </Link>
          ) : (
            <span aria-hidden="true" />
          )}
          {next && (
            <Link
              href={`/projects/${next.slug}`}
              className="group flex flex-col items-start gap-2 px-6 py-10 transition-colors hover:bg-surface-container-low sm:items-end sm:px-10 sm:text-right md:px-12 md:py-14"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-on-surface-variant/70">
                {t("project.nextProject")}
              </span>
              <span className="font-headline text-2xl font-bold tracking-tight text-on-surface transition-colors group-hover:text-primary md:text-3xl">
                {next.title}
              </span>
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}

export default function ProjectDetailClient({ slug }: { slug: string }) {
  return <ProjectContent slug={slug} />;
}
