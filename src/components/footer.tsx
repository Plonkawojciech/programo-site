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
      className="relative w-full overflow-hidden bg-[#0A0A0A]"
    >
      {/* Huge background "Programo" */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <span className="select-none whitespace-nowrap font-headline text-[15vw] font-bold italic text-[#F0F0EC]/[0.04]">
          Programo
        </span>
      </div>

      <motion.div
        style={{ y: contentY }}
        className="relative z-10 mx-auto flex max-w-[2560px] flex-col gap-10 px-6 py-16 md:px-16 md:py-24 2xl:px-40 will-change-transform transform-gpu"
      >
        <div className="flex flex-col justify-between gap-12 md:flex-row md:items-end">
          <div>
            <span className="font-headline text-2xl italic font-medium text-[#F0F0EC]">
              Programo
            </span>
            <p className="mt-4 max-w-xs text-sm font-light leading-relaxed text-[#F0F0EC]/40">
              {t("hero.desc")}
            </p>
          </div>
          <div className="flex flex-wrap gap-8 md:gap-12">
            <a
              href="https://github.com/programo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-light text-[#F0F0EC]/40 transition-colors hover:text-primary"
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/company/programo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-light text-[#F0F0EC]/40 transition-colors hover:text-primary"
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
          className="flex flex-col items-center justify-between gap-6 border-t border-[#F0F0EC]/10 pt-8 md:flex-row"
        >
          <p className="text-xs font-light text-[#F0F0EC]/30">
            &copy; 2026&ndash;{currentYear} Programo
          </p>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#F0F0EC]/30">
              Available for work &mdash; {t("footer.location")}
            </span>
          </div>
        </motion.div>
      </motion.div>
    </footer>
  );
}
