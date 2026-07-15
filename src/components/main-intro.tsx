"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import CompactLeadForm from "@/components/compact-lead-form";
import CtaButton from "@/components/ui/cta-button";
import { durationMedium, durationSlow, easeEntry, springGentle } from "@/lib/motion";

// Subtle magnetic pull for the primary hero CTA (motion-report.md premium
// addition #2). Follows the cursor within a small radius via springGentle —
// disabled under prefers-reduced-motion and on touch/coarse-pointer devices
// (no real hover there, and mousemove after tap would cause a visible jump).
function MagneticCta({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const [canHover, setCanHover] = useState(false);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, springGentle);
  const springY = useSpring(y, springGentle);

  useEffect(() => {
    setCanHover(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  const active = canHover && !reduce;
  const maxPull = 6;

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!active || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;
    x.set(Math.max(-maxPull, Math.min(maxPull, relX * 0.25)));
    y.set(Math.max(-maxPull, Math.min(maxPull, relY * 0.25)));
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={active ? { x: springX, y: springY } : undefined}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}

// Conversion-first homepage hero (redesign 2026-07). Two columns on desktop:
// editorial headline + dual CTA on the left, a short lead-catcher form on the
// right. On mobile the form drops below, but the headline and at least one CTA
// stay above the fold. Copy comes 1:1 from the content deck (home.hero.*).
//
// Above-the-fold content uses `initial={false}` throughout (not whileInView),
// so nothing renders as invisible opacity:0 in SSR HTML before hydration —
// see docs/audit-visual/motion-report.md P0.
export default function MainIntro() {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden bg-surface pt-28 pb-16 md:pt-36 md:pb-24">
      <div className="mx-auto max-w-[1400px] px-6 md:px-12 lg:px-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          {/* Left: headline + CTAs */}
          <div>
            <motion.span
              initial={false}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: durationMedium, ease: easeEntry }}
              className="text-[10px] md:text-xs font-bold uppercase tracking-[0.5em] text-primary"
            >
              {t("home.hero.eyebrow")}
            </motion.span>

            <motion.h1
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: durationSlow, ease: easeEntry }}
              className="mt-5 font-headline text-[2rem] leading-[1.08] font-bold tracking-tight text-on-surface md:text-5xl md:tracking-tighter lg:text-[3.4rem] xl:text-6xl 2xl:text-7xl"
            >
              {t("home.hero.h1")}
            </motion.h1>

            <motion.p
              initial={false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: durationSlow, delay: 0.1, ease: easeEntry }}
              className="mt-6 max-w-xl text-base md:text-xl font-light leading-relaxed text-on-surface/70"
            >
              {t("home.hero.sub")}
            </motion.p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <MagneticCta>
                <CtaButton href="tel:+48509123434" arrow={false}>
                  <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                    <path d="M6.5 3.5l3 1 1 4-2 1.5a11 11 0 005 5l1.5-2 4 1 1 3a2 2 0 01-2 2.3A16 16 0 014.2 6.5 2 2 0 016.5 3.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {t("home.hero.ctaCall")}
                </CtaButton>
              </MagneticCta>
              <CtaButton href="#kontakt" variant="secondary">
                {t("home.hero.ctaConsult")}
              </CtaButton>
            </div>

            <p className="mt-6 flex items-center gap-2.5 text-xs font-medium uppercase tracking-widest text-on-surface-variant">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/15 text-primary">
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" aria-hidden="true">
                  <path d="M4 12.5l5 5L20 6.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              {t("home.reply")}
            </p>
          </div>

          {/* Right: lead-catcher form (drops below on mobile) */}
          <CompactLeadForm
            bare
            formId="home-hero"
            anchorId="home-hero"
            heading={t("home.hero.formHeading")}
          />
        </div>
      </div>
    </section>
  );
}
