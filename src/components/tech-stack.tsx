"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useI18n } from "@/lib/i18n";

interface TechItem {
  name: string;
  description: string;
}

function GlassCard({
  item,
  index,
  mouseX,
  mouseY,
  depthFactor,
}: {
  item: TechItem;
  index: number;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  mouseY: ReturnType<typeof useMotionValue<number>>;
  depthFactor: number;
}) {
  const x = useSpring(useMotionValue(0), { damping: 30, stiffness: 100 });
  const y = useSpring(useMotionValue(0), { damping: 30, stiffness: 100 });

  useEffect(() => {
    const unsubX = mouseX.on("change", (v) => {
      x.set(v * depthFactor);
    });
    const unsubY = mouseY.on("change", (v) => {
      y.set(v * depthFactor);
    });
    return () => {
      unsubX();
      unsubY();
    };
  }, [mouseX, mouseY, depthFactor, x, y]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.04, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ y: -10, borderColor: "rgba(255, 255, 255, 0.12)" }}
      style={{ x, y }}
      className="group relative flex flex-col gap-4 rounded-2xl md:rounded-3xl p-6 md:p-8
        bg-white/[0.03] backdrop-blur-xl border border-white/[0.06]
        transition-all duration-500 hover:shadow-[0_0_60px_rgba(255,61,0,0.05)]
        will-change-transform"
    >
      {/* Initial circle */}
      <div className="flex h-10 w-10 md:h-12 md:w-12 items-center justify-center rounded-xl bg-coral/10 text-coral group-hover:bg-coral group-hover:text-dark transition-colors duration-500">
        <span className="font-headline text-xl md:text-2xl font-bold tracking-tighter">
          {item.name[0]}
        </span>
      </div>

      <div>
        <h3 className="font-headline text-xl md:text-2xl font-bold tracking-tight text-text">
          {item.name}
        </h3>
      </div>

      <p className="text-xs md:text-sm font-light leading-relaxed text-text-muted">
        {item.description}
      </p>

      {/* Decorative dot */}
      <div className="absolute right-6 top-6 md:right-8 md:top-8 h-1.5 w-1.5 rounded-full bg-coral/20 group-hover:bg-coral transition-colors duration-500" />
    </motion.div>
  );
}

export default function TechStack() {
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      mouseX.set((e.clientX - centerX) * 0.01);
      mouseY.set((e.clientY - centerY) * 0.01);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [isMounted, mouseX, mouseY]);

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

  // Depth factors for parallax — spread randomly across cards
  const depthFactors = [1.2, 0.8, 1.5, 0.6, 1.0, 1.3, 0.7, 1.4, 0.9, 1.1, 0.5, 1.2, 0.8, 1.3, 0.6];

  // Tech names for background marquee
  const marqueeText = technologies.map((t) => t.name).join(" \u2022 ");

  return (
    <section id="stack" className="relative overflow-hidden py-32 md:py-48 lg:py-64 bg-dark">
      {/* Section number */}
      <span className="absolute top-8 left-8 text-[11px] font-medium tracking-[0.2em] text-coral z-20">
        04
      </span>

      {/* Background blurred orbs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="orb-coral absolute top-[30%] left-[20%] w-[500px] h-[500px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, #FF3D00 0%, transparent 70%)" }}
        />
        <div
          className="orb-blue absolute bottom-[20%] right-[15%] w-[400px] h-[400px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, #3D5AFE 0%, transparent 70%)" }}
        />
      </div>

      {/* Background marquee — giant text, very low opacity */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex flex-col justify-center gap-8 opacity-[0.02]">
        <div className="whitespace-nowrap font-headline text-[15vw] font-bold uppercase tracking-tighter w-max animate-slide-left will-change-transform transform-gpu">
          {marqueeText} {marqueeText} {marqueeText}
        </div>
        <div className="whitespace-nowrap font-headline text-[15vw] font-bold uppercase tracking-tighter w-max animate-slide-right will-change-transform transform-gpu">
          {marqueeText} {marqueeText} {marqueeText}
        </div>
      </div>

      <div ref={containerRef} className="mx-auto max-w-[2560px] px-6 md:px-24 2xl:px-40 relative z-10">
        {/* Section title */}
        <div className="mb-20 md:mb-32 2xl:mb-48">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-[10px] md:text-xs font-medium uppercase tracking-[0.4em] text-coral"
          >
            {t("stack.label")}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-4 md:mt-6 font-headline text-4xl font-bold tracking-tighter text-text md:text-8xl 2xl:text-[8vw]"
          >
            {t("stack.title")}
          </motion.h2>
        </div>

        {/* Glass cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6">
          {technologies.map((tech, i) => (
            <GlassCard
              key={tech.name}
              item={tech}
              index={i}
              mouseX={mouseX}
              mouseY={mouseY}
              depthFactor={depthFactors[i % depthFactors.length]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
