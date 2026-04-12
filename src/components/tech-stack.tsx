"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

interface TechItem {
  name: string;
  description: string;
}

const techColors: Record<string, string> = {
  "Next.js": "#ffffff",
  "React": "#61DAFB",
  "TypeScript": "#3178C6",
  "Tailwind CSS": "#06B6D4",
  "Supabase": "#3FCF8E",
  "Neon": "#00E699",
  "Drizzle": "#C5F74F",
  "Vercel": "#ffffff",
  "Capacitor": "#53B9FF",
  "Azure AI": "#0078D4",
  "Anthropic": "#D4A574",
  "Stripe": "#635BFF",
  "Resend": "#ffffff",
  "Three.js": "#049EF4",
  "Konva.js": "#0D83CD",
};

function TechCard({ item, index }: { item: TechItem; index: number }) {
  const color = techColors[item.name] || "#8EB69B";

  return (
    <div
      className="tech-card-line group relative flex min-w-[280px] flex-col gap-4 rounded-[2rem] border border-[var(--theme-border-2)]/30 bg-[var(--theme-bg-3)] p-8 shadow-sm transition-all duration-500 hover:shadow-[0_0_30px_rgba(var(--theme-accent-rgb),0.12)] hover:-translate-y-2.5 md:min-w-[320px] overflow-hidden"
      style={{
        animationDelay: `${index * 0.1}s`,
        // @ts-expect-error CSS custom property for tech-card-line hover color
        "--tech-color": color,
      }}
    >
      {/* Top accent line on hover */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}
      />

      <div
        className="flex h-12 w-12 items-center justify-center rounded-2xl transition-all duration-500"
        style={{
          backgroundColor: `${color}15`,
          color: color,
        }}
      >
        <span
          className="font-headline text-2xl font-bold tracking-tighter group-hover:rotate-12 transition-transform duration-500 group-hover:text-white"
          style={{ color: "inherit" }}
        >
          {item.name[0]}
        </span>
      </div>
      <div>
        <h3 className="font-headline text-2xl font-bold tracking-tighter text-on-surface">
          {item.name}
        </h3>
        <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant/40">
          Expertise Layer
        </p>
      </div>
      <p className="text-sm font-light leading-relaxed text-on-surface-variant">
        {item.description}
      </p>

      {/* Decorative dot with tech color */}
      <div
        className="absolute right-8 top-8 h-2 w-2 rounded-full transition-all duration-500 group-hover:animate-pulse"
        style={{
          backgroundColor: `${color}33`,
        }}
      />

      {/* Hover background glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-700 rounded-[2rem] pointer-events-none"
        style={{ background: `radial-gradient(circle at 30% 30%, ${color}, transparent 70%)` }}
      />
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

  return (
    <section id="stack" className="relative overflow-hidden py-24 md:py-32 lg:py-56 bg-gradient-to-b from-[var(--theme-bg-1)] via-[var(--theme-bg-3)] to-[var(--theme-bg-1)]">
      <div className="mx-auto max-w-[2560px] px-6 md:px-24 2xl:px-40">
        <div className="mb-20 md:mb-32 2xl:mb-48 flex flex-col items-end text-right">
          <motion.span
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-[10px] md:text-xs 2xl:text-sm font-bold uppercase tracking-[0.5em] text-primary"
          >
            {t("stack.label")}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="mt-4 md:mt-6 font-headline text-4xl font-bold tracking-tighter text-on-surface md:text-8xl 2xl:text-[8vw] bg-gradient-to-r from-[var(--theme-text-1)] via-[var(--theme-text-2)] to-[var(--theme-text-1)] bg-clip-text text-transparent"
          >
            {t("stack.title")}
          </motion.h2>
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 h-[2px] w-32 md:w-48 bg-gradient-to-r from-transparent via-primary to-transparent origin-right"
          />
        </div>

        {/* Marquee Rows */}
        <div className="flex flex-col gap-8 md:gap-12">
          {/* Row 1 */}
          <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
            <div className="flex gap-8 md:gap-12 pr-8 md:pr-12 animate-slide-left w-max max-w-max hover:[animation-play-state:paused] will-change-transform transform-gpu">
              {[...technologies, ...technologies].map((tech, i) => (
                <TechCard key={`r1-${i}`} item={tech} index={i} />
              ))}
            </div>
          </div>

          {/* Row 2 (Reverse) */}
          <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]">
            <div className="flex gap-8 md:gap-12 pr-8 md:pr-12 animate-slide-right w-max max-w-max hover:[animation-play-state:paused] will-change-transform transform-gpu">
              {[...technologies, ...technologies].reverse().map((tech, i) => (
                <TechCard key={`r2-${i}`} item={tech} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
