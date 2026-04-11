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
      className="w-full rounded-t-[32px] mt-12 bg-[#F0EDE6] overflow-hidden"
    >
      <motion.div
        style={{ y: contentY }}
        className="flex flex-col gap-10 px-6 md:px-24 2xl:px-40 py-12 md:py-16 2xl:py-24 w-full max-w-[2560px] mx-auto will-change-transform transform-gpu"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          <div>
            <span className="text-2xl font-semibold text-[#1A1816]">
              Programo
            </span>
            <p className="text-sm text-[#6B6560] mt-6 max-w-xs leading-relaxed">
              {t("hero.desc")}
            </p>
          </div>
          <div className="flex flex-wrap gap-8 md:gap-16">
            <a
              href="https://github.com/programo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#6B6560] hover-underline transition-colors duration-300 hover:text-[#1A1816]"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/company/programo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-[#6B6560] hover-underline transition-colors duration-300 hover:text-[#1A1816]"
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
          className="border-t border-[#E5E0D5] pt-8 flex flex-col md:flex-row justify-between items-center gap-6"
        >
          <p className="text-xs font-normal text-[#6B6560]">
            &copy; 2026&ndash;{currentYear} Programo
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8EB69B]" />
            <span className="text-[10px] font-medium text-[#6B6560]/60 uppercase tracking-widest">
              {t("footer.location")}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}
