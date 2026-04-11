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

  return (
    <footer
      ref={footerRef}
      className="w-full mt-24 bg-white overflow-hidden border-t border-[#F5F5F5]"
    >
      <motion.div
        style={{ y: contentY }}
        className="flex flex-col gap-12 px-8 md:px-24 2xl:px-40 py-16 md:py-24 w-full max-w-[1400px] 2xl:max-w-[2560px] mx-auto will-change-transform transform-gpu"
      >
        <div className="flex flex-col md:flex-row justify-between items-start gap-16">
          <div className="max-w-md">
            <span className="text-4xl 2xl:text-5xl font-bold tracking-tighter text-black uppercase">
              Programo
            </span>
            <p className="text-sm 2xl:text-base text-black/40 mt-8 leading-relaxed uppercase tracking-widest">
              Digital Craftsmanship / Software Engineering / Minimalism
            </p>
          </div>
          <div className="flex flex-col gap-6">
            <span className="text-[10px] uppercase tracking-[0.5em] text-black/20">Connect</span>
            <div className="flex flex-col gap-3">
              <a
                href="https://github.com/programo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm 2xl:text-base text-black hover:text-black/60 transition-colors uppercase tracking-widest"
              >
                GitHub
              </a>
              <a
                href="https://linkedin.com/company/programo"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm 2xl:text-base text-black hover:text-black/60 transition-colors uppercase tracking-widest"
              >
                LinkedIn
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-black/5 pt-12 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] 2xl:text-xs font-medium text-black/30 uppercase tracking-[0.3em]">
            &copy; {currentYear} Programo — All rights reserved
          </p>
          <div className="flex items-center gap-4">
            <div className="w-1.5 h-1.5 rounded-full bg-black/10" />
            <span className="text-[10px] 2xl:text-xs font-medium text-black/30 uppercase tracking-[0.5em]">
              {t("footer.location")}
            </span>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
