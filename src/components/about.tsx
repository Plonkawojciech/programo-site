"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useI18n } from "@/lib/i18n";

function RevealText({ text }: { text: string }) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.8", "end 0.4"],
  });

  // Limit to max 6 words to reduce hooks
  const words = text.split(" ").slice(0, 6);

  // Create transforms at top level for each word (max 6)
  const o0 = useTransform(scrollYProgress, [0 / 6, 1 / 6], [0.1, 1]);
  const y0 = useTransform(scrollYProgress, [0 / 6, 1 / 6], [40, 0]);
  const o1 = useTransform(scrollYProgress, [1 / 6, 2 / 6], [0.1, 1]);
  const y1 = useTransform(scrollYProgress, [1 / 6, 2 / 6], [40, 0]);
  const o2 = useTransform(scrollYProgress, [2 / 6, 3 / 6], [0.1, 1]);
  const y2 = useTransform(scrollYProgress, [2 / 6, 3 / 6], [40, 0]);
  const o3 = useTransform(scrollYProgress, [3 / 6, 4 / 6], [0.1, 1]);
  const y3 = useTransform(scrollYProgress, [3 / 6, 4 / 6], [40, 0]);
  const o4 = useTransform(scrollYProgress, [4 / 6, 5 / 6], [0.1, 1]);
  const y4 = useTransform(scrollYProgress, [4 / 6, 5 / 6], [40, 0]);
  const o5 = useTransform(scrollYProgress, [5 / 6, 1], [0.1, 1]);
  const y5 = useTransform(scrollYProgress, [5 / 6, 1], [40, 0]);

  const opacities = [o0, o1, o2, o3, o4, o5];
  const ys = [y0, y1, y2, y3, y4, y5];

  return (
    <div ref={container} className="flex flex-wrap justify-center gap-x-[3vw] gap-y-[1vw] px-6 py-24 md:py-40">
      {words.map((word, i) => (
        <motion.span
          key={i}
          style={{ opacity: opacities[i], y: ys[i] }}
          className="font-headline text-[8vw] md:text-[10vw] 2xl:text-[8vw] font-bold uppercase tracking-tighter text-[#1A1816]"
        >
          {word}
        </motion.span>
      ))}
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
      className="mb-12 text-3xl font-light leading-tight text-[#1A1816] md:text-5xl lg:text-6xl 2xl:text-7xl"
    >
      {text}
    </motion.p>
  );
}

export default function About() {
  const { t, lang } = useI18n();

  const revealTextContent = lang === "pl"
    ? "Budujemy cyfrowa przyszlosc."
    : "Building the digital future.";

  return (
    <section id="about" className="relative overflow-hidden bg-[#F5F2EB] py-24 md:py-32 lg:py-56 rounded-t-[32px] 2xl:rounded-t-[64px]">
      {/* Subtle orb */}
      <div className="absolute top-[20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#8EB69B]/8 blur-[40px] pointer-events-none" />

      <RevealText text={revealTextContent} />

      <div className="mx-auto max-w-[2560px] px-6 md:px-24 2xl:px-40">
        {/* Section label + title */}
        <div className="mb-20 md:mb-32 flex flex-col gap-4">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-[10px] md:text-xs 2xl:text-sm font-bold uppercase tracking-[0.5em] text-[#8EB69B]"
          >
            {t("about.title1")}
          </motion.span>
          <h2 className="font-headline text-4xl font-bold tracking-tighter text-[#1A1816] md:text-8xl 2xl:text-[8vw]">
            {t("about.title2")}
          </h2>
        </div>

        {/* Description paragraphs */}
        <div className="flex flex-col gap-8 md:gap-16 2xl:gap-24 max-w-full md:max-w-4xl 2xl:max-w-6xl">
          <FadeInText text={t("about.p1")} />
          <FadeInText text={t("about.p2")} />
        </div>

        {/* Stats — border-top separator style */}
        <div className="mt-24 md:mt-32 2xl:mt-48 pt-12 border-t border-[#E5E0D5]">
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
                className="flex flex-col gap-2 md:gap-4"
              >
                <span className="text-[10px] 2xl:text-xs font-bold uppercase tracking-[0.3em] text-[#6B6560]">
                  {stat.label}
                </span>
                <span className="font-headline text-4xl md:text-5xl 2xl:text-[5vw] font-bold italic tracking-tighter text-[#8EB69B]">
                  {stat.value}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Founders */}
        <div className="mt-32 md:mt-48 flex flex-col items-start md:items-center justify-between gap-16 md:gap-20 md:flex-row">
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
                  <p className="text-lg md:text-xl 2xl:text-2xl font-light text-[#6B6560] max-w-sm 2xl:max-w-md">
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
            className="relative h-[400px] w-full md:w-1/2 rounded-[2rem] overflow-hidden bg-[#E5E0D5]/50"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#8EB69B]/15 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-64 h-64">
                <div className="absolute inset-0 animate-[spin_10s_linear_infinite] rounded-full border border-[#8EB69B]/30 border-t-[#8EB69B]" />
                <div className="absolute inset-4 animate-[spin_15s_linear_infinite_reverse] rounded-full border border-[#8EB69B]/20 border-b-[#8EB69B]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-center font-serif text-3xl italic tracking-tighter text-[#1A1816]">
                    Premium <br /> Studio
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
