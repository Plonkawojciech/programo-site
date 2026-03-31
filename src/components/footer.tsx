"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { fadeInUp } from "@/lib/motion";

export default function Footer() {
  const { t } = useI18n();
  const currentYear = new Date().getFullYear();
  const footerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  });

  const contentY = useTransform(scrollYProgress, [0, 1], [40, 0]);

  return (
    <footer
      ref={footerRef}
      className="w-full bg-zinc-950 border-t border-outline-variant overflow-hidden"
    >
      <motion.div
        style={{ y: contentY }}
        className="flex flex-col gap-10 px-6 md:px-12 py-12 md:py-16 w-full max-w-7xl mx-auto will-change-transform transform-gpu"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div>
            <span className="text-xl font-semibold gradient-text">
              Programo
            </span>
            <p className="text-sm text-on-surface-variant mt-4 max-w-xs leading-relaxed">
              {t("hero.desc")}
            </p>
          </div>
          <div className="flex flex-wrap gap-8 md:gap-12">
            <a
              href="https://github.com/programo"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className="text-sm text-on-surface-variant hover-underline transition-colors duration-300 hover:text-on-surface"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/company/programo"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-sm text-on-surface-variant hover-underline transition-colors duration-300 hover:text-on-surface"
            >
              LinkedIn
            </a>
          </div>
        </div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="border-t border-outline-variant pt-8 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-xs font-normal text-on-surface-variant">
            &copy; 2024&ndash;{currentYear} {t("footer.copyright")}
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-medium text-on-surface-variant/60 uppercase tracking-widest">
              {t("footer.location")}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}
