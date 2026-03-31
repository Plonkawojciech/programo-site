"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useI18n } from "@/lib/i18n";

function WordReveal({ text }: { text: string }) {
  const container = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.9", "start 0.3"],
  });

  const words = text.split(" ");

  return (
    <p ref={container} className="flex flex-wrap text-3xl font-light leading-snug text-[#F0F0EC] md:text-5xl lg:text-6xl">
      {words.map((word, i) => {
        const start = i / words.length;
        const end = start + 1 / words.length;
        return <Word key={i} word={word} range={[start, end]} progress={scrollYProgress} />;
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
  const opacity = useTransform(progress, range, [0.15, 1]);
  return (
    <motion.span style={{ opacity }} className="mr-[0.3em] inline-block will-change-[opacity]">
      {word}
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

  // Decorative "P" rotation based on scroll
  const decorRotate = useTransform(scrollYProgress, [0, 1], [0, 45]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden bg-[#0A0A0A] py-32 md:py-48 lg:py-64"
    >
      <div className="mx-auto max-w-[2560px] px-6 md:px-16 lg:px-24 2xl:px-40">
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-12 lg:gap-0">
          {/* Left side — text content */}
          <div className="lg:col-span-7">
            {/* Label */}
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="mb-12 block text-[11px] font-bold uppercase tracking-[0.5em] text-primary md:mb-16"
            >
              {t("about.title1")}
            </motion.span>

            {/* Paragraph 1 — word-by-word reveal */}
            <div className="mb-16 md:mb-24">
              <WordReveal text={t("about.p1")} />
            </div>

            {/* Paragraph 2 */}
            <div className="mb-24 md:mb-40">
              <WordReveal text={t("about.p2")} />
            </div>

            {/* Founders */}
            <div className="flex flex-col gap-12 md:gap-16">
              {[
                { name: "Wojciech Plonka", role: "DESIGN & PRODUCT" },
                { name: "Bartosz Kolaj", role: "ENGINEERING LEAD" },
              ].map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                >
                  <h3 className="font-headline text-4xl font-medium italic tracking-tight text-[#F0F0EC] md:text-6xl lg:text-7xl">
                    {f.name}
                  </h3>
                  <span className="mt-3 block text-[10px] font-bold uppercase tracking-[0.5em] text-primary">
                    {f.role}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right side — decorative */}
          <div className="relative hidden lg:col-span-5 lg:flex lg:items-center lg:justify-center">
            {/* Giant decorative "P" */}
            <motion.span
              style={{ rotate: decorRotate }}
              className="select-none font-headline text-[60vw] font-bold italic leading-none text-[#F0F0EC]/[0.03] will-change-transform lg:text-[40vw]"
            >
              P
            </motion.span>

            {/* Stats overlay */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
              {[
                `04+ ${t("about.stat.products")}`,
                `02 ${t("about.stat.founders")}`,
                "Poznan",
              ].map((stat, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="text-[11px] font-medium uppercase tracking-[0.4em] text-[#F0F0EC]/40"
                >
                  {stat}
                </motion.span>
              ))}
            </div>
          </div>

          {/* Mobile stats — shown only on small screens */}
          <div className="mt-16 flex flex-wrap gap-8 lg:hidden">
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
                className="flex flex-col gap-2 border-l border-[#F0F0EC]/10 pl-6"
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#F0F0EC]/40">
                  {stat.label}
                </span>
                <span className="font-headline text-3xl font-bold italic tracking-tighter text-primary">
                  {stat.value}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
