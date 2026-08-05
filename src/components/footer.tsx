"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import { useConsent } from "@/lib/consent";
import { projects } from "@/lib/projects";

type TKey = Parameters<ReturnType<typeof useI18n>["t"]>[0];

// Offer column — same four pillars as /oferta, each linking to its subpage.
const offerLinks: { titleKey: TKey; href: string }[] = [
  { titleKey: "offer.pillar1.title", href: "/oferta" },
  { titleKey: "offer.pillar2.title", href: "/oferta" },
  { titleKey: "offer.pillar3.title", href: "/sklepy-internetowe" },
  { titleKey: "offer.pillar4.title", href: "/strony-tracking-reklamy" },
  { titleKey: "footer.websites", href: "/strony-internetowe" },
];

// Projects column — top 6 (content-deck / brief section 5.4 portfolio picks).
const featuredSlugs = ["jedmar", "estalo", "wks-poznan", "skup-nieruchomosci", "eportal-prawny", "rejestr-pro"];
const projectLinks = featuredSlugs
  .map((slug) => projects.find((p) => p.slug === slug))
  .filter((p): p is NonNullable<typeof p> => Boolean(p));

const companyLinks: { labelKey: TKey; href: string }[] = [
  { labelKey: "nav.about", href: "/o-nas" },
  { labelKey: "footer.softwareHousePoznan", href: "/software-house-poznan" },
  { labelKey: "nav.pricing", href: "/cennik" },
  { labelKey: "footer.appCost", href: "/ile-kosztuje-aplikacji" },
  { labelKey: "footer.stack", href: "/stack" },
  { labelKey: "nav.contact", href: "/kontakt" },
  { labelKey: "footer.privacy", href: "/polityka-prywatnosci" },
];

export default function Footer() {
  const { t } = useI18n();
  const { theme } = useTheme();
  const { openSettings } = useConsent();
  const footerRef = useRef<HTMLElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: footerRef,
    offset: ["start end", "end end"],
  });

  // Reduced motion: static variant — no scroll-linked parallax.
  const contentY = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [0, 0] : [60, 0]);

  // `mt-8` is the floor, not a preference: the top corners are rounded by
  // exactly 32px, so a smaller margin makes the curve bite into the section
  // above it.
  return (
    <footer
      ref={footerRef}
      className="w-full rounded-t-[32px] mt-8 bg-surface-container-low overflow-hidden"
    >
      <motion.div
        style={{ y: contentY }}
        className="flex flex-col gap-14 px-6 md:px-12 lg:px-24 py-12 md:py-16 2xl:py-24 w-full max-w-[1400px] mx-auto will-change-transform transform-gpu"
      >
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            {/* Same A4 art-board as the navbar logo: a 141px-tall box for a 29px
                wordmark, so ~112px of dead space sat between the logo and the
                tagline. Cropping to the ink's aspect renders the wordmark
                identically (both scale by width) and closes the gap. */}
            <Image
              key={theme}
              src={theme === "dark" ? "/programo-logo-white.svg" : "/programo-logo-gradient.svg"}
              alt="Programo"
              width={320}
              height={226}
              className="w-[200px] aspect-[841.89/121.3] object-cover select-none"
              loading="lazy"
            />
            {/* Conditional: these are owner-editable, and an empty <p> still
                carries its top margin, so a cleared line leaves a gap under the
                logo that reads as a rendering bug. */}
            {t("footer.tagline").trim() && (
              <p className="mt-6 max-w-xs text-sm leading-relaxed text-on-surface-variant">
                {t("footer.tagline")}
              </p>
            )}
            {t("footer.reply").trim() && (
              <p className="mt-4 text-xs font-bold uppercase tracking-widest text-primary">
                {t("footer.reply")}
              </p>
            )}
          </div>

          {/* Offer */}
          <nav aria-label={t("footer.colOffer")} className="flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant">
              {t("footer.colOffer")}
            </span>
            {/* A cleared title would render <a href> with no text: invisible to
                sighted users and a WCAG 2.4.4 failure (link with no accessible
                name). Drop the entry instead of shipping an empty link. */}
            {offerLinks
              .filter((l) => t(l.titleKey).trim())
              .map((l) => (
              <Link
                key={l.titleKey}
                href={l.href}
                className="-my-2 py-2 min-h-[32px] text-sm text-on-surface-variant hover-underline hover:text-on-surface transition-colors duration-300"
              >
                {t(l.titleKey)}
              </Link>
              ))}
          </nav>

          {/* Projects */}
          <nav aria-label={t("footer.colProjects")} className="flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant">
              {t("footer.colProjects")}
            </span>
            {projectLinks.map((p) => (
              <Link
                key={p.slug}
                href={`/projects/${p.slug}`}
                className="-my-2 py-2 min-h-[32px] text-sm text-on-surface-variant hover-underline hover:text-on-surface transition-colors duration-300"
              >
                {p.title}
              </Link>
            ))}
            <Link
              href="/projekty"
              className="-my-2 py-2 min-h-[32px] text-sm font-medium text-primary hover-underline transition-colors duration-300"
            >
              {t("footer.allProjects")}
            </Link>
          </nav>

          {/* Company */}
          <nav aria-label={t("footer.colCompany")} className="flex flex-col gap-3">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant">
              {t("footer.colCompany")}
            </span>
            {companyLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="-my-2 py-2 min-h-[32px] text-sm text-on-surface-variant hover-underline hover:text-on-surface transition-colors duration-300"
              >
                {t(l.labelKey)}
              </Link>
            ))}
          </nav>
        </div>

        {/* Company data — rendered statically so the contact details are always
            legible; a whileInView reveal here could freeze at opacity 0. */}
        <div className="flex flex-col gap-4 border-t border-outline-variant/20 pt-8 text-sm text-on-surface-variant md:flex-row md:flex-wrap md:items-center md:gap-x-6 md:gap-y-2">
          <span className="font-medium text-on-surface">{t("footer.companyName")}</span>
          <span>{t("footer.location")}</span>
          <a href="mailto:biuro@programo.pl" className="hover-underline hover:text-on-surface transition-colors">
            biuro@programo.pl
          </a>
          <a href="tel:+48509123434" className="hover-underline hover:text-on-surface transition-colors">
            +48 509 123 434
          </a>
          <a href="tel:+48797222363" className="hover-underline hover:text-on-surface transition-colors">
            +48 797 222 363
          </a>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-outline-variant/20 pt-8 flex flex-col-reverse md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <span className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest">
              © {new Date().getFullYear()} {t("footer.copyright")}
            </span>
            <button
              type="button"
              onClick={openSettings}
              className="-my-2 min-h-[32px] py-2 text-[10px] font-medium text-on-surface-variant uppercase tracking-widest hover-underline hover:text-on-surface transition-colors cursor-pointer"
            >
              {t("footer.cookies")}
            </button>
          </div>
          {/* Guard the dot with the text: the dot is decoration for the label,
              so on its own it is a green blob with no meaning. */}
          {t("footer.reply").trim() && (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-medium text-on-surface-variant uppercase tracking-widest">
                {t("footer.reply")}
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </footer>
  );
}
