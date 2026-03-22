"use client";

import { useRef, useMemo } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { useI18n } from "@/lib/i18n";
import {
  easeEntry,
  easeDefault,
  staggerChar,
  staggerWord,
  durationMedium,
  durationSlow,
} from "@/lib/motion";
import MagneticWrapper from "@/components/magnetic";

/* ------------------------------------------------------------------ */
/*  Variants                                                          */
/* ------------------------------------------------------------------ */

/** Single character sliding up from behind its overflow-hidden mask */
const charReveal = {
  hidden: { y: "100%" },
  visible: (i: number) => ({
    y: "0%",
    transition: {
      delay: 0.3 + i * staggerChar,
      duration: durationMedium,
      ease: easeEntry,
    },
  }),
};

/** Word fade-in with slight translateY */
const wordReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.6 + i * staggerWord,
      duration: durationMedium,
      ease: easeDefault,
    },
  }),
};

/** Generic fade-up for label, buttons, etc. */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.15 + i * 0.12,
      duration: durationSlow,
      ease: easeDefault,
    },
  }),
};

/* ------------------------------------------------------------------ */
/*  Sub-components                                                    */
/* ------------------------------------------------------------------ */

/** Character-by-character split-text reveal for the heading */
function SplitHeading({ text, reduced }: { text: string; reduced: boolean }) {
  const chars = text.split("");

  if (reduced) {
    return (
      <motion.h1
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="font-headline text-7xl md:text-9xl lg:text-[10rem] leading-[0.9] tracking-tighter text-on-surface"
      >
        {text}
      </motion.h1>
    );
  }

  return (
    <h1
      aria-label={text}
      className="font-headline text-7xl md:text-9xl lg:text-[10rem] leading-[0.9] tracking-tighter text-on-surface"
    >
      {chars.map((char, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden"
        >
          <motion.span
            custom={i}
            variants={charReveal}
            initial="hidden"
            animate="visible"
            className="inline-block"
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        </span>
      ))}
    </h1>
  );
}

/** Word-by-word reveal for the description paragraph */
function SplitDescription({
  text,
  reduced,
}: {
  text: string;
  reduced: boolean;
}) {
  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);

  if (reduced) {
    return (
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mt-8 max-w-xl text-xl md:text-2xl leading-relaxed text-on-surface-variant"
      >
        {text}
      </motion.p>
    );
  }

  return (
    <p className="mt-8 max-w-xl text-xl md:text-2xl leading-relaxed text-on-surface-variant">
      {words.map((word, i) => (
        <motion.span
          key={i}
          custom={i}
          variants={wordReveal}
          initial="hidden"
          animate="visible"
          className="inline-block mr-[0.3em]"
        >
          {word}
        </motion.span>
      ))}
    </p>
  );
}

/* ------------------------------------------------------------------ */
/*  Hero                                                              */
/* ------------------------------------------------------------------ */

export default function Hero() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion() ?? false;

  /* Parallax on scroll -------------------------------------------- */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // h1 moves up faster (-80px at scroll end), description slower (-40px)
  const headingY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const descY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const scrollIndicatorY = useTransform(scrollYProgress, [0, 1], [0, 30]);
  const scrollIndicatorOpacity = useTransform(
    scrollYProgress,
    [0, 0.3],
    [1, 0]
  );

  // If user prefers reduced motion, zero out parallax values
  const safeHeadingY = reduced ? 0 : headingY;
  const safeDescY = reduced ? 0 : descY;
  const safeScrollY = reduced ? 0 : scrollIndicatorY;
  const safeScrollOpacity = reduced ? 1 : scrollIndicatorOpacity;

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100svh] flex-col justify-center px-8 pt-28 pb-32 md:px-24 max-w-[1920px] mx-auto"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end">
        <div className="lg:col-span-8">
          {/* Label */}
          <motion.p
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mb-6 text-xs tracking-[0.2em] uppercase text-primary font-bold"
          >
            {t("hero.label")}
          </motion.p>

          {/* Heading — split-text char reveal + parallax */}
          <motion.div style={{ y: safeHeadingY }}>
            <SplitHeading text="Programo" reduced={reduced} />
          </motion.div>

          {/* Description — word-by-word reveal + parallax */}
          <motion.div style={{ y: safeDescY }}>
            <SplitDescription text={t("hero.desc")} reduced={reduced} />
          </motion.div>

          {/* CTA buttons */}
          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="mt-12 flex flex-wrap gap-6"
          >
            <MagneticWrapper>
              <a
                href="#work"
                className="group flex items-center gap-3 border border-primary/20 px-8 py-4 rounded-full text-primary text-sm uppercase tracking-widest font-bold hover:bg-primary hover:text-on-primary transition-all duration-500"
              >
                <span>{t("hero.browse")}</span>
                <svg
                  className="h-4 w-4 transition-transform group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                  />
                </svg>
              </a>
            </MagneticWrapper>
            <a
              href="#about"
              className="flex items-center gap-3 px-8 py-4 text-on-surface-variant text-sm uppercase tracking-widest font-bold hover:text-primary transition-colors"
            >
              <span>{t("hero.about")}</span>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Subtle bottom line */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-outline-variant/10" />

      {/* Scroll indicator — with parallax */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        style={{ y: safeScrollY, opacity: safeScrollOpacity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="h-10 w-[1px] bg-primary/20"
        />
      </motion.div>
    </section>
  );
}
