"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { useConsent } from "@/lib/consent";
import { fadeInUp } from "@/lib/motion";

export default function Footer() {
  const { t } = useI18n();
  const { theme } = useTheme();
  const { openSettings } = useConsent();
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
        className="flex flex-col gap-10 px-6 md:px-24 2xl:px-40 py-12 md:py-16 2xl:py-24 w-full max-w-[2560px] mx-auto will-change-transform transform-gpu"
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12">
          <div>
            <Image
              key={theme}
              src={theme === "dark" ? "/programo-logo-white.svg" : "/programo-logo-gradient.svg"}
              alt="Programo"
              width={320}
              height={226}
              className="h-auto w-[220px] md:w-[280px] select-none"
              priority
            />
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
          className="border-t border-outline-variant/20 pt-8 flex flex-col-reverse md:flex-row justify-between items-start md:items-center gap-4"
        >
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link
              href="/polityka-prywatnosci"
              className="text-[10px] font-medium text-on-surface-variant/70 uppercase tracking-widest hover-underline hover:text-on-surface transition-colors"
            >
              {t("footer.privacy")}
            </Link>
            <button
              type="button"
              onClick={openSettings}
              className="text-[10px] font-medium text-on-surface-variant/70 uppercase tracking-widest hover-underline hover:text-on-surface transition-colors cursor-pointer"
            >
              {t("footer.cookies")}
            </button>
          </div>
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
