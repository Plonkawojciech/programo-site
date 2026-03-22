"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useInView,
  useMotionValue,
  useTransform,
  animate,
} from "framer-motion";
import { useI18n } from "@/lib/i18n";
import {
  easeEntry,
  durationMedium,
  durationSlow,
  staggerItem,
  fadeInUp,
} from "@/lib/motion";

// ---------------------------------------------------------------------------
// Animated counter – small inline helper
// ---------------------------------------------------------------------------

function AnimatedCounter({
  from,
  to,
  suffix = "",
  duration = 1.5,
}: {
  from: number;
  to: number;
  suffix?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const motionVal = useMotionValue(from);
  const rounded = useTransform(motionVal, (v) => Math.round(v));

  useEffect(() => {
    if (!inView) return;
    const controls = animate(motionVal, to, {
      duration,
      ease: [0.16, 1, 0.3, 1],
    });
    return () => controls.stop();
  }, [inView, motionVal, to, duration]);

  useEffect(() => {
    const unsub = rounded.on("change", (v) => {
      if (ref.current) ref.current.textContent = `${v}${suffix}`;
    });
    return unsub;
  }, [rounded, suffix]);

  return <span ref={ref}>{`${from}${suffix}`}</span>;
}

// ---------------------------------------------------------------------------
// Reusable variants
// ---------------------------------------------------------------------------

const statBoxVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: durationMedium,
      ease: easeEntry,
    },
  }),
};

const wordRevealContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const wordRevealChild = {
  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: durationMedium, ease: easeEntry },
  },
};

const paragraphVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: durationMedium, ease: easeEntry },
  },
};

const founderVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * staggerItem,
      duration: durationMedium,
      ease: easeEntry,
    },
  }),
};

const clipRevealText = {
  hidden: { opacity: 0, clipPath: "inset(0 100% 0 0)" },
  visible: {
    opacity: 1,
    clipPath: "inset(0 0% 0 0)",
    transition: { duration: durationSlow, ease: easeEntry },
  },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function About() {
  const { t } = useI18n();

  const introText = t("about.intro");
  const parts = introText.split(/\{w\}|\{b\}/);

  // Heading words for word-by-word reveal
  const headingLine1 = t("about.title1");
  const headingLine2 = t("about.title2");
  const headingWords = [
    ...headingLine1.split(" ").map((w) => ({ word: w, lineBreakAfter: false })),
  ];
  // Mark the last word of line 1 for a line break
  if (headingWords.length > 0) {
    headingWords[headingWords.length - 1].lineBreakAfter = true;
  }
  const line2Words = headingLine2
    .split(" ")
    .map((w) => ({ word: w, lineBreakAfter: false }));
  const allWords = [...headingWords, ...line2Words];

  // Stats data
  const leftStats = [
    {
      key: "products",
      label: t("about.stat.products"),
      render: <AnimatedCounter from={0} to={4} suffix="+" />,
    },
    {
      key: "founders",
      label: t("about.stat.founders"),
      render: <AnimatedCounter from={0} to={2} />,
    },
  ];

  const rightStats = [
    {
      key: "founded",
      label: t("about.stat.founded"),
      render: <AnimatedCounter from={2020} to={2024} />,
    },
    {
      key: "location",
      label: t("about.stat.location"),
      render: null, // Poznań uses clip-path fade
    },
  ];

  return (
    <section
      id="about"
      className="py-40 px-8 md:px-24 max-w-[1920px] mx-auto bg-surface-container-low rounded-t-[40px]"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
        <div>
          {/* Word-by-word heading reveal */}
          <motion.h2
            className="font-headline text-5xl md:text-7xl text-on-surface leading-tight mb-12"
            variants={wordRevealContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            {allWords.map((item, i) => (
              <span key={i} className="inline-block overflow-hidden">
                <motion.span
                  className="inline-block"
                  variants={wordRevealChild}
                >
                  {item.word}
                </motion.span>
                {item.lineBreakAfter ? <br /> : " "}
              </span>
            ))}
          </motion.h2>

          {/* Paragraphs fade in */}
          <motion.p
            className="text-lg text-on-surface-variant leading-relaxed mb-8 max-w-lg"
            variants={paragraphVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
          >
            {parts[0]}
            <span className="text-on-surface font-medium">
              Wojciech P&#322;onka
            </span>
            {parts[1]}
            <span className="text-on-surface font-medium">Bartosz Kolaj</span>
            {parts[2]}
          </motion.p>

          <motion.p
            className="text-on-surface-variant leading-relaxed max-w-lg mb-6"
            variants={paragraphVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.15 }}
          >
            {t("about.p1")}
          </motion.p>

          <motion.p
            className="text-on-surface-variant leading-relaxed max-w-lg"
            variants={paragraphVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            transition={{ delay: 0.3 }}
          >
            {t("about.p2")}
          </motion.p>

          {/* Founders – staggered */}
          <div className="grid grid-cols-2 gap-x-12 gap-y-12 mt-16 border-t border-outline-variant/20 pt-12">
            {[
              {
                name: "Wojciech P\u0142onka",
                role: "Design & Strategy",
              },
              {
                name: "Bartosz Kolaj",
                role: "Engineering Lead",
              },
            ].map((founder, i) => (
              <motion.div
                key={founder.name}
                custom={i}
                variants={founderVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
              >
                <h4 className="font-headline text-3xl md:text-4xl text-on-surface">
                  {founder.name}
                </h4>
                <p className="text-xs uppercase tracking-widest text-primary mt-2">
                  {founder.role}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Left column */}
          <div className="space-y-6">
            {leftStats.map((stat, i) => (
              <motion.div
                key={stat.key}
                custom={i}
                variants={statBoxVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                className="bg-surface-container-lowest p-12 rounded-xl editorial-shadow"
              >
                <p className="font-headline text-5xl text-primary mb-2">
                  {stat.render}
                </p>
                <p className="text-xs uppercase tracking-widest text-on-surface-variant">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Right column (offset with mt-12) */}
          <div className="space-y-6 mt-12">
            {rightStats.map((stat, i) => (
              <motion.div
                key={stat.key}
                custom={i + 2}
                variants={statBoxVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                className="bg-surface-container-lowest p-12 rounded-xl editorial-shadow"
              >
                <p className="font-headline text-5xl text-primary mb-2">
                  {stat.render !== null ? (
                    stat.render
                  ) : (
                    <motion.span
                      variants={clipRevealText}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="inline-block"
                    >
                      Pozna&#324;
                    </motion.span>
                  )}
                </p>
                <p className="text-xs uppercase tracking-widest text-on-surface-variant">
                  {stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
