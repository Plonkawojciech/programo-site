"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useI18n } from "@/lib/i18n";

function RevealText({ text }: { text: string }) {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.8", "end 0.2"],
  });

  const words = text.split(" ");

  return (
    <div ref={container} className="flex flex-wrap justify-center gap-x-[4vw] gap-y-[2vw] px-6 py-40 md:py-64">
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        const opacity = useTransform(scrollYProgress, [start, end], [0.05, 1]);
        const y = useTransform(scrollYProgress, [start, end], [30, 0]);
        return (
          <motion.span
            key={i}
            style={{ opacity, y }}
            className="font-sans text-[7vw] md:text-[9vw] font-bold uppercase tracking-tighter text-black leading-none"
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
      className="mb-16 text-2xl font-light leading-relaxed text-black md:text-5xl max-w-5xl"
    >
      {text}
    </motion.p>
  );
}

export default function About() {
  const { t, lang } = useI18n();

  const revealTextContent = lang === "pl" 
    ? "Czysta forma. Perfekcyjny kod. Cyfrowe rzemiosło." 
    : "Pure form. Perfect code. Digital craftsmanship.";

  return (
    <section id="about" className="relative overflow-hidden bg-white py-32 md:py-64">
      <div className="absolute top-0 left-0 w-full h-px bg-black/5" />
      
      <RevealText text={revealTextContent} />

      <div className="mx-auto max-w-[1400px] px-8 md:px-24">
        <div className="mb-32 flex flex-col gap-6">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-[11px] font-bold uppercase tracking-[0.5em] text-black/30"
          >
            {t("about.title1")}
          </motion.span>
          <h2 className="font-sans text-5xl font-bold tracking-tighter text-black md:text-8xl uppercase">
            {t("about.title2")}
          </h2>
        </div>

        <div className="flex flex-col gap-12 md:gap-20">
          <FadeInText text={t("about.p1")} />
          <FadeInText text={t("about.p2")} />
        </div>

        <div className="mt-48 grid grid-cols-2 gap-x-12 gap-y-24 md:grid-cols-4">
          {[
            { label: t("about.stat.products"), value: "04+" },
            { label: t("about.stat.founders"), value: "02" },
            { label: t("about.stat.founded"), value: "2026" },
            { label: t("about.stat.location"), value: "Poznań" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.8 }}
              className="flex flex-col gap-6 border-t border-black/5 pt-12"
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-black/30">
                {stat.label}
              </span>
              <span className="font-sans text-5xl md:text-7xl font-bold tracking-tighter text-black">
                {stat.value}
              </span>
            </motion.div>
          ))}
        </div>

        <div className="mt-64 flex flex-col gap-32">
          {[
            { name: "Wojciech Płonka", role: "Design & Product", desc: lang === "pl" ? "Odpowiada za wizję, interfejsy i doświadczenia użytkownika." : "Responsible for vision, interfaces, and user experience." },
            { name: "Bartosz Kolaj", role: "Engineering Lead", desc: lang === "pl" ? "Architekt systemów, dbający o perfekcję kodu i wydajność." : "Systems architect ensuring code perfection and performance." },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2, duration: 1 }}
              className="flex flex-col md:flex-row md:items-end justify-between border-b border-black/5 pb-16"
            >
              <div className="max-w-xl">
                <span className="mb-6 block text-[11px] font-bold uppercase tracking-[0.5em] text-black/30">
                  {f.role}
                </span>
                <h3 className="font-sans text-5xl md:text-8xl font-bold tracking-tighter text-black uppercase mb-8">
                  {f.name}
                </h3>
              </div>
              <p className="text-lg md:text-xl font-light text-black/60 max-w-sm uppercase tracking-widest leading-relaxed">
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
