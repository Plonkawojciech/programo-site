"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useMotionValue, animate } from "framer-motion";
import { useI18n } from "@/lib/i18n";

function WordByWordScroll({ text }: { text: string }) {
  const container = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.85", "end 0.5"],
  });

  const words = text.split(" ");

  return (
    <p
      ref={container}
      className="mb-12 text-2xl md:text-4xl lg:text-5xl 2xl:text-6xl font-headline font-light leading-tight tracking-tight flex flex-wrap gap-x-[0.3em] gap-y-[0.1em]"
    >
      {words.map((word, i) => {
        const start = i / words.length;
        const end = (i + 1) / words.length;
        return (
          <Word key={i} word={word} range={[start, end]} progress={scrollYProgress} />
        );
      })}
    </p>
  );
}

function Word({
  word,
  range,
  progress,
}: {
  word: string;
  range: [number, number];
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const opacity = useTransform(progress, range, [0.08, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block text-text transition-opacity will-change-[opacity]">
      {word}
    </motion.span>
  );
}

function AnimatedCounter({ target, suffix = "" }: { target: string; suffix?: string }) {
  const [displayValue, setDisplayValue] = useState("0");
  const containerRef = useRef<HTMLDivElement>(null);
  const hasAnimated = useRef(false);
  const motionValue = useMotionValue(0);

  // Determine if numeric
  const numericTarget = parseInt(target.replace(/[^0-9]/g, ""), 10);
  const isNumeric = !isNaN(numericTarget);

  useEffect(() => {
    if (!containerRef.current || !isNumeric) {
      setDisplayValue(target);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          animate(motionValue, numericTarget, {
            duration: 2,
            ease: [0.16, 1, 0.3, 1],
            onUpdate: (v) => {
              setDisplayValue(String(Math.round(v)).padStart(2, "0") + suffix);
            },
          });
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [motionValue, numericTarget, isNumeric, target, suffix]);

  return (
    <div ref={containerRef}>
      <span className="font-headline text-6xl md:text-8xl lg:text-[120px] font-bold italic tracking-tighter text-coral leading-none">
        {isNumeric ? displayValue : target}
      </span>
    </div>
  );
}

function LetterByLetterReveal({ text, delay = 0 }: { text: string; delay?: number }) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.85", "end 0.6"],
  });

  const letters = text.split("");

  return (
    <span ref={container} className="inline-flex flex-wrap">
      {letters.map((letter, i) => {
        const start = i / letters.length;
        const end = (i + 1) / letters.length;
        return (
          <LetterSpan key={i} letter={letter} range={[start, end]} progress={scrollYProgress} />
        );
      })}
    </span>
  );
}

function LetterSpan({
  letter,
  range,
  progress,
}: {
  letter: string;
  range: [number, number];
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
}) {
  const opacity = useTransform(progress, range, [0.1, 1]);
  return (
    <motion.span
      style={{ opacity }}
      className={`inline-block will-change-[opacity] ${letter === " " ? "w-[0.3em]" : ""}`}
    >
      {letter === " " ? "\u00A0" : letter}
    </motion.span>
  );
}

export default function About() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Giant decorative "P" rotation
  const pRotate = useTransform(scrollYProgress, [0, 1], [0, 45]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden bg-dark-surface py-32 md:py-48 lg:py-64"
    >
      {/* Section number */}
      <span className="absolute top-8 left-8 text-[11px] font-medium tracking-[0.2em] text-coral z-20">
        03
      </span>

      {/* Decorative giant "P" */}
      <motion.div
        style={{ rotate: pRotate }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
      >
        <span className="font-headline text-[50vw] font-bold italic text-text/[0.03] leading-none">
          P
        </span>
      </motion.div>

      <div className="mx-auto max-w-[2560px] px-6 md:px-24 2xl:px-40 relative z-10">
        {/* Section heading */}
        <div className="mb-20 md:mb-32 flex flex-col gap-4">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-[10px] md:text-xs font-medium uppercase tracking-[0.4em] text-coral"
          >
            {t("about.title1")}
          </motion.span>
          <h2 className="font-headline text-4xl font-bold tracking-tighter text-text md:text-8xl 2xl:text-[8vw]">
            {t("about.title2")}
          </h2>
        </div>

        {/* Word-by-word paragraphs */}
        <div className="flex flex-col gap-8 md:gap-16 2xl:gap-24 max-w-full md:max-w-4xl 2xl:max-w-6xl">
          <WordByWordScroll text={t("about.p1")} />
          <WordByWordScroll text={t("about.p2")} />
        </div>

        {/* Stats */}
        <div className="mt-24 md:mt-40 2xl:mt-56 grid grid-cols-2 gap-x-8 gap-y-16 md:gap-20 md:grid-cols-2 lg:grid-cols-4">
          {[
            { label: t("about.stat.products"), value: "04", suffix: "+" },
            { label: t("about.stat.founders"), value: "02", suffix: "" },
            { label: t("about.stat.founded"), value: "2026", suffix: "" },
            { label: t("about.stat.location"), value: "Pozna\u0144", suffix: "" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col gap-4 border-l border-white/10 pl-6 md:pl-8"
            >
              <span className="text-[10px] md:text-[11px] font-medium uppercase tracking-[0.3em] text-text-muted">
                {stat.label}
              </span>
              <AnimatedCounter target={stat.value} suffix={stat.suffix} />
            </motion.div>
          ))}
        </div>

        {/* Founders — letter by letter */}
        <div className="mt-32 md:mt-48 flex flex-col gap-12 md:gap-16">
          {[
            { name: "Wojciech P\u0142onka", role: "Design & Product" },
            { name: "Bartosz Kolaj", role: "Engineering Lead" },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
            >
              <h3 className="font-headline text-3xl md:text-6xl 2xl:text-8xl font-bold italic tracking-tight text-text">
                <LetterByLetterReveal text={f.name} delay={i * 0.3} />
              </h3>
              <motion.span
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + i * 0.3 }}
                className="mt-2 md:mt-4 block text-[10px] md:text-[11px] font-medium uppercase tracking-[0.4em] text-coral"
              >
                {f.role}
              </motion.span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
