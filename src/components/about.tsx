"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useI18n } from "@/lib/i18n";

function ScrollRevealText({ text }: { text: string }) {
  const container = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.9", "start 0.4"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0.08, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [30, 0]);

  return (
    <motion.p
      ref={container}
      style={{ opacity, y }}
      className="mb-12 text-2xl font-light leading-snug text-on-surface md:text-4xl lg:text-5xl 2xl:text-6xl"
    >
      {text}
    </motion.p>
  );
}

function LetterRevealName({ name, role }: { name: string; role: string }) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.85", "start 0.5"],
  });

  const letters = name.split("");

  return (
    <div ref={container}>
      <h3 className="font-headline text-3xl font-bold tracking-tighter text-on-surface md:text-6xl 2xl:text-8xl flex flex-wrap">
        {letters.map((letter, i) => {
          const start = i / letters.length;
          const end = Math.min((i + 1) / letters.length + 0.1, 1);
          return (
            <LetterSpan key={i} letter={letter} scrollYProgress={scrollYProgress} start={start} end={end} />
          );
        })}
      </h3>
      <motion.span
        style={{
          opacity: useTransform(scrollYProgress, [0.5, 0.8], [0, 1]),
        }}
        className="mt-2 md:mt-4 block text-[10px] 2xl:text-xs font-bold uppercase tracking-[0.4em] text-primary"
      >
        {role}
      </motion.span>
    </div>
  );
}

function LetterSpan({
  letter,
  scrollYProgress,
  start,
  end,
}: {
  letter: string;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  start: number;
  end: number;
}) {
  const opacity = useTransform(scrollYProgress, [start, end], [0.1, 1]);

  return (
    <motion.span style={{ opacity }} className={letter === " " ? "w-[0.25em]" : ""}>
      {letter === " " ? "\u00A0" : letter}
    </motion.span>
  );
}

export default function About() {
  const { t } = useI18n();

  return (
    <section id="about" className="relative overflow-hidden bg-surface py-24 md:py-32 lg:py-56">
      <div className="mx-auto max-w-[2560px] px-6 md:px-24 2xl:px-40">
        <div className="mb-20 md:mb-32 flex flex-col gap-4">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-[10px] md:text-xs 2xl:text-sm font-bold uppercase tracking-[0.5em] text-primary"
          >
            {t("about.title1")}
          </motion.span>
          <h2 className="font-headline text-4xl font-bold tracking-tighter text-on-surface md:text-8xl 2xl:text-[8vw]">
            {t("about.title2")}
          </h2>
        </div>

        {/* Scroll-driven text paragraphs */}
        <div className="flex flex-col gap-8 md:gap-16 2xl:gap-24 max-w-full md:max-w-4xl 2xl:max-w-6xl">
          <ScrollRevealText text={t("about.p1")} />
          <ScrollRevealText text={t("about.p2")} />
        </div>

        {/* Stats — oversized numbers */}
        <div className="mt-24 md:mt-32 2xl:mt-48 grid grid-cols-2 gap-x-8 gap-y-16 md:gap-20 md:grid-cols-2 lg:grid-cols-4">
          {[
            { label: t("about.stat.products"), value: "04+" },
            { label: t("about.stat.founders"), value: "02" },
            { label: t("about.stat.founded"), value: "2026" },
            { label: t("about.stat.location"), value: "Poznań" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col gap-2 md:gap-4 border-l border-on-surface/10 pl-6 md:pl-8"
            >
              <span className="text-[10px] 2xl:text-xs font-bold uppercase tracking-[0.3em] text-on-surface-variant">
                {stat.label}
              </span>
              <span className="font-headline text-5xl md:text-7xl 2xl:text-[120px] font-bold italic tracking-tighter text-primary/80">
                {stat.value}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Founders — letter by letter reveal */}
        <div className="mt-32 md:mt-56 flex flex-col gap-16 md:gap-20 2xl:gap-28">
          {[
            { name: "Wojciech Płonka", role: "Design & Product" },
            { name: "Bartosz Kolaj", role: "Engineering Lead" },
          ].map((f, i) => (
            <LetterRevealName key={i} name={f.name} role={f.role} />
          ))}
        </div>
      </div>
    </section>
  );
}
