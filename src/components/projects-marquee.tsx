"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { projects, type Project } from "@/lib/projects";

// Curated, ordered subset shown in the homepage strip. Order matters visually.
const MARQUEE_SLUGS = [
  "estalo",
  "baulx",
  "athlix",
  "learnai",
  "jedmar",
  "ks-posnania",
  "wks-poznan",
  "wsafefinanse",
];

function getMarqueeProjects(): Project[] {
  return MARQUEE_SLUGS.map((slug) => projects.find((p) => p.slug === slug))
    .filter((p): p is Project => Boolean(p));
}

function ProjectTile({ project }: { project: Project }) {
  const { lang } = useI18n();
  const screenshot = project.screenshots?.[0];

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group relative shrink-0 w-[80vw] sm:w-[360px] md:w-[380px] lg:w-[440px] aspect-[4/3] overflow-hidden rounded-2xl border border-outline-variant/30 bg-surface-container/40 transition-all duration-500 ease-out md:hover:scale-125 md:hover:z-20 md:hover:border-primary/60 md:hover:shadow-2xl md:hover:shadow-black/30 snap-center"
      aria-label={`${project.title} — ${project.subtitle[lang]}`}
    >
      {screenshot ? (
        <Image
          src={screenshot}
          alt={project.title}
          fill
          sizes="(max-width: 768px) 80vw, (max-width: 1024px) 380px, 440px"
          className="object-cover opacity-60 md:group-hover:opacity-100 transition-opacity duration-500 ease-out"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: project.bgColor }}
        />
      )}

      {/* Bottom gradient for readability */}
      <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* Accent line on top */}
      <div
        className="absolute top-0 left-0 right-0 h-1 opacity-80"
        style={{ backgroundColor: project.accentColor }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-7 text-white">
        <div className="flex items-center gap-2 mb-2">
          <span
            className="text-[10px] font-bold uppercase tracking-[0.3em]"
            style={{ color: project.accentColor }}
          >
            {project.tags[0] ?? project.category}
          </span>
          <span className="text-[10px] font-medium uppercase tracking-widest text-white/60">
            · {project.year}
          </span>
        </div>
        <h3 className="font-headline text-3xl md:text-4xl font-bold tracking-tighter text-white">
          {project.title}
        </h3>
        <p className="mt-2 text-sm md:text-base font-light text-white/80 leading-snug line-clamp-2">
          {project.subtitle[lang]}
        </p>
      </div>
    </Link>
  );
}

export default function ProjectsMarquee() {
  const { t } = useI18n();
  const items = getMarqueeProjects();

  const trackRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mqHover = window.matchMedia("(hover: hover) and (pointer: fine)");
    const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    // Touch devices use native horizontal scroll; respect reduced motion
    if (!mqHover.matches || mqReduced.matches) return;

    const NORMAL_MS_PER_CYCLE = 60000;
    const NORMAL_SPEED = 1 / NORMAL_MS_PER_CYCLE; // progress units / ms
    const HOVERED_SPEED = NORMAL_SPEED / 3; // 3× slower

    let raf = 0;
    let lastTime = performance.now();
    let progress = 0; // 0..1
    let currentSpeed = NORMAL_SPEED;
    // Time constant for speed interpolation (ms) — controls how fast the
    // marquee eases between fast and slow. Higher = smoother but slower to react.
    const TAU = 350;

    function step(now: number) {
      const dt = Math.min(now - lastTime, 64); // clamp big tab-switch jumps
      lastTime = now;

      const target = isHoveredRef.current ? HOVERED_SPEED : NORMAL_SPEED;
      const alpha = 1 - Math.exp(-dt / TAU);
      currentSpeed += (target - currentSpeed) * alpha;

      progress += dt * currentSpeed;
      if (progress >= 1) progress -= 1;

      if (trackRef.current) {
        const pct = -progress * 50; // 0% → -50% (half of duplicated track)
        trackRef.current.style.transform = `translate3d(${pct}%, 0, 0)`;
      }

      raf = requestAnimationFrame(step);
    }
    raf = requestAnimationFrame(step);

    function onVisibility() {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        lastTime = performance.now();
        raf = requestAnimationFrame(step);
      }
    }
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  if (items.length === 0) return null;

  return (
    <section
      id="realizacje"
      aria-labelledby="realizations-heading"
      className="relative bg-surface py-24 md:py-32 lg:py-40 border-t border-outline-variant/20 overflow-hidden"
    >
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16">
          <div>
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] text-primary"
            >
              {t("realizations.label")}
            </motion.span>
            <motion.h2
              id="realizations-heading"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-6 font-headline text-4xl md:text-6xl 2xl:text-7xl font-bold tracking-tighter text-on-surface"
            >
              {t("realizations.title")}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="mt-4 text-base md:text-lg font-light text-on-surface/70 max-w-xl"
            >
              {t("realizations.subtitle")}
            </motion.p>
          </div>

          <Link
            href="/projekty"
            className="hidden md:inline-flex items-center gap-3 text-sm uppercase tracking-widest font-medium text-on-surface hover:text-primary transition-all hover:gap-5"
          >
            {t("realizations.viewAll")} <span>→</span>
          </Link>
        </div>
      </div>

      {/* MOBILE: native swipeable horizontal scroll */}
      <div className="md:hidden">
        <div className="projects-marquee-mobile flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2 px-6">
          {items.map((project) => (
            <ProjectTile key={project.slug} project={project} />
          ))}
          {/* Trailing spacer so last tile can snap to centre */}
          <div className="shrink-0 w-2" aria-hidden="true" />
        </div>
      </div>

      {/* DESKTOP: rAF-driven auto-scroll marquee */}
      <div
        className="hidden md:block projects-marquee-desktop relative w-full"
        onMouseEnter={() => {
          isHoveredRef.current = true;
        }}
        onMouseLeave={() => {
          isHoveredRef.current = false;
        }}
        onFocusCapture={() => {
          isHoveredRef.current = true;
        }}
        onBlurCapture={() => {
          isHoveredRef.current = false;
        }}
      >
        {/* Side fades */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 md:w-32 z-10 bg-gradient-to-r from-surface to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 md:w-32 z-10 bg-gradient-to-l from-surface to-transparent" />

        <div
          ref={trackRef}
          className="flex gap-5 md:gap-7 py-2 will-change-transform"
          style={{ width: "max-content", transform: "translate3d(0,0,0)" }}
        >
          {/* Duplicated twice for seamless loop */}
          {[0, 1].map((dup) => (
            <div
              key={dup}
              className="flex gap-5 md:gap-7 shrink-0"
              aria-hidden={dup === 1}
            >
              {items.map((project) => (
                <ProjectTile
                  key={`${dup}-${project.slug}`}
                  project={project}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Mobile-only "view all" link */}
      <div className="mx-auto max-w-[1400px] px-6 md:hidden mt-10">
        <Link
          href="/projekty"
          className="inline-flex items-center gap-3 text-sm uppercase tracking-widest font-medium text-on-surface hover:text-primary transition-all"
        >
          {t("realizations.viewAll")} <span>→</span>
        </Link>
      </div>
    </section>
  );
}
