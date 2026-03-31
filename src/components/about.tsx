"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useInView, type MotionValue } from "framer-motion";
import { useI18n } from "@/lib/i18n";

/** Word-by-word "reading spotlight" — each word tracks scroll for opacity */
function ScrollRevealText({ text }: { text: string }) {
  const container = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.9", "end 0.5"],
  });

  const words = text.split(" ");

  return (
    <p
      ref={container}
      className="mb-12 text-2xl font-light leading-snug md:text-4xl lg:text-5xl font-headline"
      style={{ color: "#E8E0D0" }}
    >
      {words.map((word, i) => (
        <Word key={i} word={word} index={i} total={words.length} scrollYProgress={scrollYProgress} />
      ))}
    </p>
  );
}

function Word({
  word,
  index,
  total,
  scrollYProgress,
}: {
  word: string;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const start = index / total;
  const end = start + 1 / total;
  const opacity = useTransform(scrollYProgress, [start, end], [0.1, 1]);

  return (
    <motion.span
      className="inline-block mr-[0.3em]"
      style={{ opacity }}
    >
      {word}
    </motion.span>
  );
}

/** Animated counter that counts up when entering viewport */
function AnimatedCounter({ value, suffix = "" }: { value: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!isInView) return;

    const numericPart = value.replace(/[^0-9]/g, "");
    const target = parseInt(numericPart, 10);
    if (isNaN(target)) {
      setDisplay(value);
      return;
    }

    const duration = 1500;
    const startTime = performance.now();

    function animate(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);

      const prefix = value.startsWith("0") && value.length > String(target).length
        ? value.slice(0, value.length - String(target).length)
        : "";

      setDisplay(prefix + String(current).padStart(String(target).length, "0") + suffix);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplay(value);
      }
    }

    requestAnimationFrame(animate);
  }, [isInView, value, suffix]);

  return <span ref={ref}>{display}</span>;
}

export default function About() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Parallax layers — horizontal movement
  const bgX = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const midX = useTransform(scrollYProgress, [0, 1], [50, -50]);

  return (
    <section
      id="about"
      ref={sectionRef}
      className="relative overflow-hidden py-32 md:py-48 lg:py-64"
      style={{ backgroundColor: "#0A0808" }}
    >
      {/* Section marker */}
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="absolute top-8 left-6 md:left-10 font-headline text-xs italic z-10"
        style={{ color: "#C8A44E", letterSpacing: "0.3em" }}
      >
        III
      </motion.span>

      {/* Section divider line at top */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 left-[5%] right-[5%] h-[1px]"
        style={{ backgroundColor: "rgba(200, 164, 78, 0.08)", transformOrigin: "center" }}
      />

      {/* Background layer — giant "ABOUT" text (moves slowest) */}
      <motion.div
        className="pointer-events-none absolute top-1/2 left-0 -translate-y-1/2 whitespace-nowrap select-none"
        style={{ x: bgX, opacity: 0.02 }}
      >
        <span
          className="font-headline text-[30vw] font-bold italic"
          style={{ color: "#C8A44E" }}
        >
          ABOUT
        </span>
      </motion.div>

      {/* Subtle warm gradient */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 80% 50% at 30% 50%, rgba(200,164,78,0.03) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-[2560px] px-6 md:px-24 2xl:px-40">
        {/* Paragraphs with word-by-word scroll opacity */}
        <div className="max-w-full md:max-w-4xl 2xl:max-w-6xl">
          <ScrollRevealText text={t("about.p1")} />
          <ScrollRevealText text={t("about.p2")} />
        </div>

        {/* Stats — large gold numbers with thin serif labels */}
        <motion.div
          className="mt-32 md:mt-48"
          style={{ x: midX }}
        >
          <div className="flex flex-wrap gap-12 md:gap-0 md:divide-x" style={{ borderColor: "rgba(200, 164, 78, 0.15)" }}>
            {[
              { label: t("about.stat.products"), value: "04+" },
              { label: t("about.stat.founders"), value: "02" },
              { label: t("about.stat.founded"), value: "2026" },
              { label: t("about.stat.location"), value: "Poznan" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="flex flex-col gap-2 md:px-12 first:md:pl-0 last:md:pr-0"
                style={{ borderColor: "rgba(200, 164, 78, 0.15)" }}
              >
                <span
                  className="font-headline text-6xl md:text-7xl lg:text-[100px] font-bold italic tracking-tighter leading-none"
                  style={{ color: "#C8A44E" }}
                >
                  <AnimatedCounter value={stat.value} />
                </span>
                <span
                  className="text-[10px] font-medium uppercase"
                  style={{ color: "#8A8278", letterSpacing: "0.3em" }}
                >
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Founders */}
        <div className="mt-32 md:mt-56">
          {/* Thin gold connecting line */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-16 h-[1px] max-w-2xl"
            style={{ backgroundColor: "rgba(200, 164, 78, 0.15)", transformOrigin: "left" }}
          />

          <div className="flex flex-col gap-12 md:gap-16 2xl:gap-20">
            {[
              { name: "Wojciech Plonka", role: "Design & Product" },
              { name: "Bartosz Kolaj", role: "Engineering Lead" },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <h3
                  className="font-headline text-4xl md:text-6xl lg:text-7xl 2xl:text-8xl font-bold italic tracking-tighter"
                  style={{ color: "#E8E0D0" }}
                >
                  {f.name}
                </h3>
                <span
                  className="mt-3 block text-[10px] 2xl:text-xs font-medium uppercase"
                  style={{ color: "#C8A44E", letterSpacing: "0.4em" }}
                >
                  {f.role}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
