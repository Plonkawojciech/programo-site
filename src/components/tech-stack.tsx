"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import {
  clipRevealUp,
  fadeInUp,
  durationMedium,
  easeEntry,
} from "@/lib/motion";

interface TechItem {
  name: string;
  description: string;
}

function MarqueeRow({
  items,
  direction = "left",
  duration = 30,
}: {
  items: TechItem[];
  direction?: "left" | "right";
  duration?: number;
}) {
  const controls = useAnimationControls();
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Triplicate items for seamless loop
  const repeated = [...items, ...items, ...items];

  const isLeft = direction === "left";
  const oneSetPercent = 100 / 3;

  useEffect(() => {
    if (isPaused) {
      controls.stop();
    } else {
      controls.start({
        x: isLeft
          ? [`0%`, `-${oneSetPercent}%`]
          : [`-${oneSetPercent}%`, `0%`],
        transition: {
          x: {
            duration,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
          },
        },
      });
    }
  }, [isPaused, controls, isLeft, oneSetPercent, duration]);

  return (
    <div
      ref={containerRef}
      className="overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <motion.div className="flex gap-4" animate={controls}>
        {repeated.map((tech, i) => (
          <div
            key={`${tech.name}-${i}`}
            className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest px-6 py-4 flex-shrink-0 min-w-[180px] md:min-w-[220px]"
          >
            <span className="font-bold text-on-surface text-sm md:text-base block">
              {tech.name}
            </span>
            <p className="text-[10px] uppercase tracking-widest text-on-surface-variant mt-1.5">
              {tech.description}
            </p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export default function TechStack() {
  const { t } = useI18n();

  const technologies: TechItem[] = [
    { name: "Next.js", description: t("stack.nextjs") },
    { name: "React", description: t("stack.react") },
    { name: "TypeScript", description: t("stack.typescript") },
    { name: "Tailwind CSS", description: t("stack.tailwind") },
    { name: "Supabase", description: t("stack.supabase") },
    { name: "Neon", description: t("stack.neon") },
    { name: "Drizzle", description: t("stack.drizzle") },
    { name: "Vercel", description: t("stack.vercel") },
    { name: "Capacitor", description: t("stack.capacitor") },
    { name: "Azure AI", description: t("stack.azure") },
    { name: "Anthropic", description: t("stack.anthropic") },
    { name: "Stripe", description: t("stack.stripe") },
    { name: "Resend", description: t("stack.resend") },
    { name: "Three.js", description: t("stack.threejs") },
    { name: "Konva.js", description: t("stack.konvajs") },
  ];

  // Split into two rows: 8 and 7
  const row1 = technologies.slice(0, 8);
  const row2 = technologies.slice(8);

  return (
    <section id="stack" className="py-40 max-w-[1920px] mx-auto">
      <div className="text-center mb-32 px-8 md:px-24">
        <motion.span
          className="text-xs uppercase tracking-widest text-primary font-bold inline-block"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {t("stack.label")}
        </motion.span>
        <motion.h2
          className="font-headline text-5xl md:text-7xl text-on-surface mt-6"
          variants={clipRevealUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {t("stack.title")}
        </motion.h2>
        <motion.p
          className="mx-auto mt-6 max-w-lg text-on-surface-variant"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {t("stack.desc")}
        </motion.p>
      </div>

      <motion.div
        className="flex flex-col gap-4 overflow-hidden"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: durationMedium, ease: easeEntry }}
      >
        <MarqueeRow items={row1} direction="left" duration={30} />
        <MarqueeRow items={row2} direction="right" duration={30} />
      </motion.div>
    </section>
  );
}
