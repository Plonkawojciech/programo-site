"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useI18n } from "@/lib/i18n";

function RollingText({ text }: { text: string }) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], [0, -500]);

  return (
    <div ref={container} className="whitespace-nowrap font-headline text-[15vw] font-bold uppercase tracking-tighter text-on-surface/10">
      <motion.div style={{ x }}>
        {text} {text} {text}
      </motion.div>
    </div>
  );
}

function FadeInText({ text }: { text: string }) {
  const container = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.9", "start 0.6"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0.1, 1]);

  return (
    <motion.p
      ref={container}
      style={{ opacity }}
      className="mb-12 text-3xl font-light leading-tight text-on-surface md:text-5xl lg:text-6xl"
    >
      {text}
    </motion.p>
  );
}

export default function About() {
  const { t } = useI18n();

  return (
    <section id="about" className="relative overflow-hidden bg-surface-container py-24 md:py-32 lg:py-56 rounded-t-[32px] 2xl:rounded-t-[64px]">
      <RollingText text="STRATEGY • DESIGN • CODE • " />

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

        <div className="flex flex-col gap-8 md:gap-16 2xl:gap-24 max-w-full md:max-w-4xl 2xl:max-w-6xl">
          <FadeInText text={t("about.p1")} />
          <FadeInText text={t("about.p2")} />
        </div>

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
              <span className="font-headline text-4xl md:text-5xl 2xl:text-[5vw] font-bold italic tracking-tighter text-primary">
                {stat.value}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="mt-32 md:mt-56 flex flex-col items-start md:items-center justify-between gap-16 md:gap-20 md:flex-row">
          <div className="flex flex-col gap-10 md:gap-10 2xl:gap-16">
            {[
              { name: "Wojciech Płonka", role: "Design & Product" },
              { name: "Bartosz Kolaj", role: "Engineering Lead" },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
              >
                <h3 className="font-headline text-3xl font-bold tracking-tighter text-on-surface md:text-6xl 2xl:text-8xl">
                  {f.name}
                </h3>
                <span className="mt-2 md:mt-4 block text-[10px] 2xl:text-xs font-bold uppercase tracking-[0.4em] text-primary">
                  {f.role}
                </span>
              </motion.div>
            ))}
          </div>
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="relative h-64 w-64 md:h-96 md:w-96"
          >
            <div className="absolute inset-0 animate-pulse rounded-full border border-primary/20" />
            <div className="absolute inset-10 animate-pulse rounded-full border border-primary/10 transition-transform duration-1000" style={{ animationDelay: "1s" }} />
            <div className="flex h-full w-full items-center justify-center">
              <span className="text-center font-headline text-xl italic tracking-tighter text-on-surface-variant">
                Independent <br /> Studio
              </span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
