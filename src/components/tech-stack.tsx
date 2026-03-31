"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";

interface TechItem {
  name: string;
  description: string;
}

function TechPill({ item }: { item: TechItem }) {
  return (
    <div className="group flex items-center gap-3 rounded-full border border-outline-variant bg-surface px-4 py-2 transition-all duration-300 hover:border-primary/30 hover:shadow-[0_0_20px_-5px_rgba(139,92,246,0.2)] whitespace-nowrap shrink-0">
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-container-high text-xs font-bold text-on-surface-variant group-hover:text-primary transition-colors">
        {item.name[0]}
      </span>
      <span className="text-sm font-medium text-on-surface">
        {item.name}
      </span>
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
    <section id="stack" className="relative overflow-hidden py-24 md:py-32 lg:py-40">
      {/* Background radial glow */}
      <div className="absolute left-1/2 top-1/2 -z-10 h-[500px] w-[500px] md:h-[800px] md:w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/[0.03] blur-[100px]" />

      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* Section header */}
        <div className="mb-16 md:mb-20">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-[0.3em] text-on-surface-variant mb-4 block"
          >
            {t("stack.label")}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold tracking-tight md:text-6xl"
          >
            <span className="gradient-text">{t("stack.title")}</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 max-w-xl text-base text-on-surface-variant"
          >
            {t("stack.desc")}
          </motion.p>
        </div>

        {/* Marquee Rows */}
        <div className="flex flex-col gap-4 md:gap-5">
          {/* Row 1 */}
          <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="flex gap-3 md:gap-4 pr-3 md:pr-4 animate-slide-left w-max max-w-max hover:[animation-play-state:paused] will-change-transform transform-gpu">
              {[...technologies, ...technologies, ...technologies].map((tech, i) => (
                <TechPill key={`r1-${i}`} item={tech} />
              ))}
            </div>
          </div>

          {/* Row 2 (Reverse) */}
          <div className="flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
            <div className="flex gap-3 md:gap-4 pr-3 md:pr-4 animate-slide-right w-max max-w-max hover:[animation-play-state:paused] will-change-transform transform-gpu">
              {[...technologies, ...technologies, ...technologies].reverse().map((tech, i) => (
                <TechPill key={`r2-${i}`} item={tech} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
