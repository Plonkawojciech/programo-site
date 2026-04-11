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

  const words = text.split(" ");

  return (
    <div ref={container} className="flex flex-wrap justify-center gap-x-[3vw] gap-y-[1vw] px-6 py-24 md:py-40">
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        const opacity = useTransform(scrollYProgress, [start, end], [0.1, 1]);
        const y = useTransform(scrollYProgress, [start, end], [50, 0]);
        return (
          <motion.span
            key={i}
            style={{ opacity, y }}
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
  const { t, lang } = useI18n();

  const revealTextContent = lang === "pl"
    ? "Dwoch builderow. Jedno studio. Budujemy cyfrowa przyszlosc."
    : "Two builders. One studio. Building the digital future.";

  return (
    <section id="about" className="relative overflow-hidden bg-[#0A2A28] py-24 md:py-32 lg:py-56 rounded-t-[32px] 2xl:rounded-t-[64px]">
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

        <div className="mt-24 md:mt-32 2xl:mt-48 grid grid-cols-2 gap-x-8 gap-y-16 md:gap-20 md:grid-cols-2 lg:grid-cols-4">
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

        {/* Future Vision Section */}
        <div className="mt-32 md:mt-48 py-20 border-y border-on-surface/10 relative">
          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ duration: 0.8 }}
             className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[30vw] font-headline font-black text-on-surface/5 pointer-events-none select-none"
          >
            FUTURE
          </motion.div>
          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <h3 className="text-2xl md:text-5xl font-serif italic text-on-surface font-light leading-relaxed">
              {lang === "pl"
                ? `"Planujemy ogromny rozwoj. Nowe systemy SaaS, miedzynarodowa ekspansja oraz wyznaczanie nowych standardow w cyfrowym designie. To dopiero poczatek naszej drogi."`
                : `"We are planning massive growth. New SaaS systems, international expansion, and setting new standards in digital design. This is just the beginning of our journey."`}
            </h3>
          </div>
        </div>

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
                <div className="absolute -inset-8 bg-primary/0 group-hover:bg-primary/5 transition-colors duration-500 rounded-3xl z-0" />
                <div className="relative z-10">
                  <span className="mb-4 block text-[10px] 2xl:text-xs font-bold uppercase tracking-[0.4em] text-primary">
                    {f.role}
                  </span>
                  <h3 className="font-headline text-4xl font-bold tracking-tighter text-on-surface md:text-6xl 2xl:text-7xl mb-4">
                    {f.name}
                  </h3>
                  <p className="text-lg md:text-xl font-light text-on-surface-variant max-w-sm">
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
            className="relative h-[400px] w-full md:w-1/2 rounded-[2rem] overflow-hidden bg-on-surface/5"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent mix-blend-overlay" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative w-64 h-64">
                <div className="absolute inset-0 animate-[spin_10s_linear_infinite] rounded-full border border-primary/30 border-t-primary" />
                <div className="absolute inset-4 animate-[spin_15s_linear_infinite_reverse] rounded-full border border-primary/20 border-b-primary" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-center font-serif text-3xl italic tracking-tighter text-on-surface">
                    Premium <br /> Agency
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
