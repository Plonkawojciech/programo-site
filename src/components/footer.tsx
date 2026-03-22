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

  const contentY = useTransform(scrollYProgress, [0, 1], [60, 0]);

  return (
    <footer
      ref={footerRef}
      className="w-full rounded-t-[32px] mt-12 bg-surface-container-low overflow-hidden"
    >
      <motion.div
        style={{ y: contentY }}
        className="flex flex-col gap-10 px-8 md:px-24 py-12 md:py-16 w-full max-w-[1920px] mx-auto"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          <div>
            <span className="text-2xl font-semibold text-on-surface">
              Programo
            </span>
            <p className="text-sm text-on-surface-variant mt-6 max-w-xs leading-relaxed">
              {t("hero.desc")}
            </p>
          </div>
          <div className="flex flex-wrap gap-8 md:gap-16">
            <a
              href="https://github.com/programo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-on-surface-variant hover-underline transition-colors duration-300"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/company/programo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-on-surface-variant hover-underline transition-colors duration-300"
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
          className="border-t border-outline-variant/20 pt-8 flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <p className="text-xs font-normal text-on-surface-variant">
            &copy; 2024&ndash;{currentYear} Programo
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-medium text-on-surface-variant/60 uppercase tracking-widest">
              {t("footer.location")}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}
