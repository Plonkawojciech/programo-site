"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useI18n } from "@/lib/i18n";

interface TechItem {
  name: string;
  description: string;
}

/**
 * Two-column layout:
 * - Left column is sticky, shows current highlighted tech name in large serif
 * - Right column scrolls through all tech items as cards
 * - As each card enters center of viewport, the left column updates
 */

function TechCard({
  item,
  index,
  isActive,
}: {
  item: TechItem;
  index: number;
  isActive: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-20%" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="py-8 border-b transition-all duration-500"
      style={{
        borderColor: isActive ? "rgba(200, 164, 78, 0.2)" : "rgba(200, 164, 78, 0.05)",
      }}
    >
      <div className="flex items-baseline justify-between gap-4">
        <span
          className="text-[10px] font-medium"
          style={{ color: "#8A8278", letterSpacing: "0.2em" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3
          className="font-headline text-2xl md:text-3xl font-medium italic tracking-tight flex-1"
          style={{ color: isActive ? "#C8A44E" : "#E8E0D0" }}
        >
          {item.name}
        </h3>
      </div>
      <p
        className="mt-3 text-sm font-light leading-relaxed pl-10 md:pl-12"
        style={{ color: "#8A8278" }}
      >
        {item.description}
      </p>
    </motion.div>
  );
}

export default function TechStack() {
  const { t } = useI18n();
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

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

  // Determine active index based on scroll progress
  const activeIndex = useTransform(
    scrollYProgress,
    [0, 1],
    [0, technologies.length - 1]
  );

  // Progress bar scaleY
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="stack"
      ref={sectionRef}
      className="relative py-32 md:py-48 lg:py-64"
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
        IV
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

      <div className="mx-auto max-w-[2560px] px-6 md:px-24 2xl:px-40">
        {/* Header */}
        <div className="mb-20 md:mb-32">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-[10px] md:text-xs font-medium uppercase"
            style={{ color: "#C8A44E", letterSpacing: "0.5em" }}
          >
            {t("stack.label")}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-4 font-headline text-5xl md:text-7xl lg:text-8xl 2xl:text-[8vw] font-bold italic tracking-tighter"
            style={{ color: "#E8E0D0" }}
          >
            {t("stack.title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-6 max-w-xl text-sm md:text-base font-light leading-relaxed"
            style={{ color: "#8A8278" }}
          >
            {t("stack.desc")}
          </motion.p>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left: Sticky large tech name */}
          <div className="hidden lg:block lg:col-span-5">
            <div className="sticky top-[40vh]">
              <ActiveTechDisplay
                technologies={technologies}
                scrollYProgress={scrollYProgress}
              />

              {/* Gold progress bar */}
              <div className="mt-12 w-[1px] h-48 relative" style={{ backgroundColor: "rgba(200, 164, 78, 0.1)" }}>
                <motion.div
                  className="absolute top-0 left-0 w-full origin-top"
                  style={{
                    backgroundColor: "#C8A44E",
                    scaleY: progressScale,
                    height: "100%",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Right: Scrolling tech cards */}
          <div className="lg:col-span-7">
            {technologies.map((tech, i) => (
              <ScrollTechCard
                key={tech.name}
                item={tech}
                index={i}
                total={technologies.length}
                scrollYProgress={scrollYProgress}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Warm gradient orb background */}
      <div
        className="pointer-events-none absolute top-1/3 right-0 h-[600px] w-[600px] md:h-[900px] md:w-[900px]"
        style={{
          background: "radial-gradient(circle, rgba(200,164,78,0.04) 0%, transparent 70%)",
        }}
      />
    </section>
  );
}

/** The large tech name on the left that updates based on scroll position */
function ActiveTechDisplay({
  technologies,
  scrollYProgress,
}: {
  technologies: TechItem[];
  scrollYProgress: MotionValue<number>;
}) {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      const idx = Math.min(
        Math.max(0, Math.floor(v * technologies.length)),
        technologies.length - 1
      );
      setActiveIdx(idx);
    });
    return unsubscribe;
  }, [scrollYProgress, technologies.length]);

  const tech = technologies[activeIdx];

  return (
    <div>
      <h3
        className="font-headline text-5xl xl:text-7xl font-bold italic tracking-tighter leading-none"
        style={{ color: "#C8A44E" }}
      >
        {tech?.name}
      </h3>
      <p
        className="mt-4 text-sm font-light"
        style={{ color: "#8A8278" }}
      >
        {tech?.description}
      </p>
    </div>
  );
}

/** Individual tech card in the right column */
function ScrollTechCard({
  item,
  index,
  total,
  scrollYProgress,
}: {
  item: TechItem;
  index: number;
  total: number;
  scrollYProgress: MotionValue<number>;
}) {
  const segmentSize = 1 / total;
  const start = index * segmentSize;
  const end = start + segmentSize;

  const cardOpacity = useTransform(scrollYProgress, (v) =>
    v >= start && v < end ? 1 : 0.5
  );

  return (
    <motion.div
      className="py-8 border-b transition-all duration-500"
      style={{
        borderColor: "rgba(200, 164, 78, 0.05)",
        opacity: cardOpacity,
      }}
    >
      <div className="flex items-baseline gap-4">
        <span
          className="text-[10px] font-medium"
          style={{ color: "#8A8278", letterSpacing: "0.2em" }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <div className="flex-1">
          <h3
            className="font-headline text-xl md:text-2xl font-medium italic tracking-tight"
            style={{ color: "#E8E0D0" }}
          >
            {item.name}
          </h3>
          <p
            className="mt-2 text-sm font-light leading-relaxed"
            style={{ color: "#8A8278" }}
          >
            {item.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
