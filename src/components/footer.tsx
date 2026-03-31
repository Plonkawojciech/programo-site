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
      className="relative w-full overflow-hidden"
      style={{ backgroundColor: "#0A0808" }}
    >
      {/* Top gold line */}
      <div
        className="w-full h-[1px]"
        style={{ backgroundColor: "rgba(200, 164, 78, 0.2)" }}
      />

      {/* Giant watermark "Programo" */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden select-none">
        <span
          className="font-headline text-[20vw] font-bold italic whitespace-nowrap"
          style={{ color: "rgba(200, 164, 78, 0.03)" }}
        >
          Programo
        </span>
      </div>

      <motion.div
        style={{ y: contentY }}
        className="relative z-10 flex flex-col gap-10 px-6 md:px-24 2xl:px-40 py-16 md:py-20 2xl:py-28 w-full max-w-[2560px] mx-auto will-change-transform transform-gpu"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          <div>
            <span
              className="font-headline text-xl italic"
              style={{ color: "#C8A44E" }}
            >
              Programo
            </span>
            <p
              className="text-sm mt-4 max-w-xs leading-relaxed font-light"
              style={{ color: "#8A8278" }}
            >
              {t("hero.desc")}
            </p>
          </div>

          {/* Links with animated gold underlines */}
          <div className="flex flex-wrap gap-8 md:gap-12">
            <a
              href="https://github.com/programo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-light hover-underline transition-colors duration-300"
              style={{ color: "#8A8278" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#C8A44E")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#8A8278")}
            >
              GitHub
            </a>
            <a
              href="https://linkedin.com/company/programo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-light hover-underline transition-colors duration-300"
              style={{ color: "#8A8278" }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#C8A44E")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#8A8278")}
            >
              LinkedIn
            </a>
          </div>
        </div>

        {/* Bottom row */}
        <div
          className="border-t pt-8 flex flex-col md:flex-row justify-between items-center gap-6"
          style={{ borderColor: "rgba(200, 164, 78, 0.08)" }}
        >
          <p
            className="text-xs font-light"
            style={{ color: "#8A8278" }}
          >
            &copy; 2026&ndash;{currentYear} {t("footer.copyright")}
          </p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span
              className="text-[10px] font-medium uppercase"
              style={{ color: "#8A8278", letterSpacing: "0.3em" }}
            >
              {t("footer.location")}
            </span>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
