"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import MagneticWrapper from "@/components/magnetic";

export default function Hero() {
  const { t } = useI18n();
  const container = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const smoothY = useSpring(y, { damping: 20, stiffness: 100 });

  return (
    <section
      ref={container}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-20"
    >
      {/* Grid pattern background */}
      <div className="absolute inset-0 grid-pattern grid-pattern-fade pointer-events-none" />

      {/* Subtle gradient blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/[0.04] blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/3 w-[400px] h-[400px] rounded-full bg-secondary/[0.03] blur-[100px] pointer-events-none" />

      <motion.div
        style={{ y: smoothY, opacity }}
        className="relative z-10 flex flex-col items-center text-center w-full max-w-4xl px-6"
      >
        {/* Animated badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mb-10"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-outline-variant px-4 py-1.5 text-xs font-medium tracking-wider text-on-surface-variant uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{t("hero.label")}</span> — Pozna&#324;
          </span>
        </motion.div>

        {/* Headline with gradient MO - rendered as single h1 for a11y, with clamp sizing */}
        <h1 className="relative font-headline font-bold leading-[0.85] tracking-tighter text-on-surface clamp-hero-title">
          <span className="overflow-hidden w-full text-center block">
            <motion.span
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
              className="block clamp-hero-title"
            >
              Programo
            </motion.span>
          </span>
        </h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1.2 }}
          className="mt-8 md:mt-10 max-w-lg text-base font-light leading-relaxed text-on-surface-variant md:text-lg"
        >
          {t("hero.desc")}
        </motion.p>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
          className="mt-10 flex flex-col md:flex-row items-center gap-4"
        >
          <MagneticWrapper strength={0.5}>
            <a
              href="#work"
              className="gradient-border inline-flex items-center gap-2 px-8 py-3 text-sm font-medium tracking-wide text-on-surface transition-all hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.3)]"
            >
              {t("hero.browse")}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="ml-1">
                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </MagneticWrapper>
          <a href="#about" className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors px-4 py-2">
            {t("hero.about")}
          </a>
          <a href="#contact" className="text-sm font-medium text-on-surface-variant hover:text-on-surface transition-colors px-4 py-2">
            {t("hero.contact")}
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll Hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-on-surface-variant/40">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="h-8 w-[1px] bg-gradient-to-b from-primary/60 to-transparent"
          />
        </div>
      </motion.div>
    </section>
  );
}
