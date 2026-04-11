"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useI18n } from "@/lib/i18n";

function RevealText({ text }: { text: string }) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.9", "end 0.3"],
  });

  const words = text.split(" ");

  return (
    <div ref={container} className="flex flex-wrap justify-center gap-x-[3vw] gap-y-[1vw] px-6 py-24 md:py-40">
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        const opacity = useTransform(scrollYProgress, [start, end], [0.02, 1]);
        const y = useTransform(scrollYProgress, [start, end], [80, 0]);
        const scale = useTransform(scrollYProgress, [start, end], [0.9, 1]);
        return (
          <motion.span
            key={i}
            style={{ opacity, y, scale }}
            className="font-headline text-[8vw] md:text-[10vw] font-bold uppercase tracking-tighter text-on-surface"
          >
            {word}
          </motion.span>
        );
      })}
    </div>
  );
}

function FadeInText({ text }: { text: string }) {
  const container = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.95", "start 0.5"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0.0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [30, 0]);

  return (
    <motion.p
      ref={container}
      style={{ opacity, y }}
      className="mb-12 text-3xl font-light leading-tight text-on-surface/80 md:text-5xl lg:text-6xl"
    >
      {text}
    </motion.p>
  );
}

export default function About() {
  const { t, lang } = useI18n();

  const quoteRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: quoteProgress } = useScroll({
    target: quoteRef,
    offset: ["start 0.95", "end 0.4"],
  });
  const futureScale = useTransform(quoteProgress, [0, 0.4], [0.5, 1]);
  const futureOpacity = useTransform(quoteProgress, [0, 0.3], [0, 0.05]);
  const quoteOpacity = useTransform(quoteProgress, [0.1, 0.5], [0, 1]);
  const quoteY = useTransform(quoteProgress, [0.1, 0.5], [60, 0]);
  const borderScale = useTransform(quoteProgress, [0.05, 0.4], [0, 1]);

  const revealTextContent = lang === "pl"
    ? "Dwoch builderow. Jedno studio. Budujemy cyfrowa przyszlosc."
    : "Two builders. One studio. Building the digital future.";

  return (
    <section id="about" className="relative overflow-hidden">
      {/* TOP HALF — Dark */}
      <div className="bg-[#0A2A28] py-24 md:py-32 lg:py-56">
        <RevealText text={revealTextContent} />

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
        </div>
      </div>

      {/* BOTTOM HALF — Cream */}
      <div className="bg-[#FAF8F4] rounded-t-[32px] 2xl:rounded-t-[48px] px-6 md:px-24 2xl:px-40 py-24 md:py-32">
        <div className="mx-auto max-w-[2560px]">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-16 md:gap-20 md:grid-cols-2 lg:grid-cols-4">
            {[
              { label: t("about.stat.products"), value: "04+" },
              { label: t("about.stat.founders"), value: "02" },
              { label: t("about.stat.founded"), value: "2026" },
              { label: t("about.stat.location"), value: "Poznan" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex flex-col gap-2 md:gap-4 border-l border-[#1A1816]/10 pl-6 md:pl-8"
              >
                <span className="text-[10px] 2xl:text-xs font-bold uppercase tracking-[0.3em] text-[#6B6560]">
                  {stat.label}
                </span>
                <span className="font-headline text-4xl md:text-5xl 2xl:text-7xl font-bold italic tracking-tighter text-[#1A1816]">
                  {stat.value}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Animated Quote Section */}
          <div ref={quoteRef} className="mt-20 md:mt-48 py-16 md:py-20 relative overflow-hidden">
            {/* Animated top border */}
            <motion.div style={{ scaleX: borderScale }} className="absolute top-0 left-0 right-0 h-px bg-[#1A1816]/10 origin-center" />

            {/* FUTURE ghost text */}
            <motion.div style={{ scale: futureScale, opacity: futureOpacity }} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] font-headline font-black text-[#1A1816] pointer-events-none select-none">
              FUTURE
            </motion.div>

            {/* Quote */}
            <motion.div style={{ opacity: quoteOpacity, y: quoteY }} className="relative z-10 max-w-5xl mx-auto text-center">
              <h3 className="text-2xl md:text-5xl font-serif italic text-[#1A1816] font-light leading-relaxed">
                {lang === "pl"
                  ? `"Planujemy ogromny rozwoj. Nowe systemy SaaS, miedzynarodowa ekspansja oraz wyznaczanie nowych standardow w cyfrowym designie. To dopiero poczatek naszej drogi."`
                  : `"We are planning massive growth. New SaaS systems, international expansion, and setting new standards in digital design. This is just the beginning of our journey."`}
              </h3>
            </motion.div>

            {/* Animated bottom border */}
            <motion.div style={{ scaleX: borderScale }} className="absolute bottom-0 left-0 right-0 h-px bg-[#1A1816]/10 origin-center" />
          </div>

          {/* Founders */}
          <div className="mt-20 md:mt-48 flex flex-col items-start md:items-center justify-between gap-16 md:gap-20 md:flex-row">
            <div className="flex flex-col gap-16 md:gap-24 w-full md:w-1/2">
              {[
                { name: "Wojciech Plonka", role: "Design & Product", desc: lang === "pl" ? "Odpowiada za wizje, interfejsy i doswiadczenia uzytkownika." : "Responsible for vision, interfaces, and user experience." },
                { name: "Bartosz Kolaj", role: "Engineering Lead", desc: lang === "pl" ? "Architekt systemow, dbajacy o perfekcje kodu i wydajnosc." : "Systems architect ensuring code perfection and performance." },
              ].map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="group relative"
                >
                  <div className="absolute -inset-8 bg-[#8EB69B]/0 group-hover:bg-[#8EB69B]/5 transition-colors duration-500 rounded-3xl z-0" />
                  <div className="relative z-10">
                    <span className="mb-4 block text-[10px] 2xl:text-xs font-bold uppercase tracking-[0.4em] text-[#8EB69B]">
                      {f.role}
                    </span>
                    <h3 className="font-headline text-4xl font-bold tracking-tighter text-[#1A1816] md:text-6xl 2xl:text-7xl mb-4">
                      {f.name}
                    </h3>
                    <p className="text-lg md:text-xl font-light text-[#6B6560] max-w-sm">
                      {f.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="relative h-[400px] w-full md:w-1/2 rounded-[2rem] overflow-hidden bg-[#1A1816]/5"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#8EB69B]/20 to-transparent mix-blend-overlay" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-64 h-64">
                  <div className="absolute inset-0 animate-[spin_10s_linear_infinite] rounded-full border border-[#8EB69B]/30 border-t-[#8EB69B]" />
                  <div className="absolute inset-4 animate-[spin_15s_linear_infinite_reverse] rounded-full border border-[#8EB69B]/20 border-b-[#8EB69B]" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-center font-serif text-3xl italic tracking-tighter text-[#1A1816]">
                      Premium <br /> Agency
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
