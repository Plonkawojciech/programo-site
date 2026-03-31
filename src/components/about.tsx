"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useI18n } from "@/lib/i18n";

function FadeInText({ text }: { text: string }) {
  const container = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start 0.9", "start 0.5"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [0.15, 1]);
  const color = useTransform(
    scrollYProgress,
    [0, 1],
    ["rgb(161, 161, 170)", "rgb(228, 228, 231)"]
  );

  return (
    <motion.p
      ref={container}
      style={{ opacity, color }}
      className="mb-8 text-xl font-light leading-relaxed md:text-2xl lg:text-3xl"
    >
      {text}
    </motion.p>
  );
}

function StatBox({
  label,
  value,
  index,
}: {
  label: string;
  value: string;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bento-card relative flex flex-col justify-between p-8 md:p-10"
    >
      <div
        className="card-spotlight"
        style={{
          background: isHovered
            ? `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, rgba(139, 92, 246, 0.06), transparent 40%)`
            : "none",
        }}
      />
      <div className="relative z-10">
        <span className="gradient-text font-headline text-5xl font-bold tracking-tighter md:text-6xl lg:text-7xl">
          {value}
        </span>
        <p className="mt-3 text-sm font-medium text-on-surface-variant">{label}</p>
      </div>
    </motion.div>
  );
}

export default function About() {
  const { t } = useI18n();

  return (
    <section id="about" className="relative overflow-hidden py-24 md:py-32 lg:py-40">
      <div className="mx-auto max-w-7xl px-6 md:px-12">
        {/* Section header */}
        <div className="mb-16 md:mb-20">
          <motion.span
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="text-xs font-semibold uppercase tracking-[0.3em] text-on-surface-variant mb-4 block"
          >
            {t("about.label")}
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl font-bold tracking-tight text-on-surface md:text-6xl"
          >
            {t("about.title1")} <span className="gradient-text">{t("about.title2")}</span>
          </motion.h2>
        </div>

        {/* Scroll-dimming paragraphs */}
        <div className="max-w-4xl mb-20 md:mb-28">
          <FadeInText text={t("about.p1")} />
          <FadeInText text={t("about.p2")} />
        </div>

        {/* Stats bento 2x2 */}
        <div className="grid grid-cols-2 gap-4 md:gap-5 mb-20 md:mb-28">
          <StatBox label={t("about.stat.products")} value="4+" index={0} />
          <StatBox label={t("about.stat.founders")} value="2" index={1} />
          <StatBox label={t("about.stat.founded")} value="2024" index={2} />
          <StatBox label={t("about.stat.location")} value="Pozna&#324;" index={3} />
        </div>

        {/* Founders — minimal list */}
        <div className="flex flex-col gap-6 md:gap-8">
          {[
            { name: "Wojciech P\u0142onka", role: "Design & Product" },
            { name: "Bartosz Kolaj", role: "Engineering Lead" },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="flex items-baseline gap-4 md:gap-8"
            >
              <span className="text-2xl font-bold tracking-tight text-on-surface md:text-4xl">
                {f.name}
              </span>
              <span className="text-sm font-medium text-on-surface-variant">
                {f.role}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
