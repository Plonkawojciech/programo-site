"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useI18n } from "@/lib/i18n";

export default function Footer() {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [60, 0]);
  const watermarkY = useTransform(scrollYProgress, [0, 1], [40, -20]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer
      ref={footerRef}
      className="relative w-full overflow-hidden bg-dark border-t border-white/5"
    >
      {/* Huge "Programo" watermark */}
      <motion.div
        style={{ y: watermarkY }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
      >
        <span className="font-headline text-[20vw] font-bold italic text-text/[0.03] tracking-tighter whitespace-nowrap leading-none">
          Programo
        </span>
      </motion.div>

      <motion.div
        style={{ y: contentY }}
        className="relative z-10 flex flex-col gap-10 px-6 md:px-24 2xl:px-40 py-12 md:py-16 2xl:py-24 w-full max-w-[2560px] mx-auto will-change-transform transform-gpu"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          <div>
            <span className="text-xl font-headline font-semibold italic text-text tracking-tight">
              Programo
            </span>
            <p className="text-sm text-text-muted mt-4 max-w-xs leading-relaxed">
              {t("hero.desc")}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-8 md:gap-12">
            <a
              href="https://github.com/programo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-text-muted hover-underline transition-colors duration-300 hover:text-text"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/company/programo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-text-muted hover-underline transition-colors duration-300 hover:text-text"
            >
              LinkedIn
            </a>
            <button
              onClick={scrollToTop}
              className="text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted hover:text-coral transition-colors cursor-pointer"
            >
              Back to top
            </button>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-xs font-normal text-text-muted">
            &copy; 2026&ndash;{currentYear} Programo
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-medium text-text-muted/60 uppercase tracking-[0.2em]">
              {t("footer.location")}
            </span>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
