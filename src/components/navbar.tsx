"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
import ContactCtaLink from "@/components/contact-cta-link";
import {
  easeEntry,
  easeHover,
  durationFast,
  durationMedium,
  springGentle,
} from "@/lib/motion";

export default function Navbar() {
  const { lang, toggle, t } = useI18n();
  const { theme, toggle: toggleTheme } = useTheme();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const ticking = useRef(false);

  const navLinks = [
    { label: t("nav.offer"), href: "/oferta", section: "oferta" },
    { label: t("nav.pricing"), href: "/cennik", section: "cennik" },
    { label: t("nav.work"), href: "/projekty", section: "projekty" },
    { label: t("nav.about"), href: "/o-nas", section: "o-nas" },
    { label: t("nav.contact"), href: "/kontakt", section: "kontakt" },
  ];

  // --- Track scroll position only to toggle liquid-glass intensity ---
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 40);
    ticking.current = false;
  }, []);

  useEffect(() => {
    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(handleScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [handleScroll]);

  // --- Active section from pathname ---
  useEffect(() => {
    if (!pathname) {
      setActiveSection("");
      return;
    }
    const match = navLinks.find((l) => pathname === l.href || pathname.startsWith(`${l.href}/`));
    setActiveSection(match?.section ?? "");
  }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // --- Lock body scroll when mobile menu open ---
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Desktop logo — fixed top-left, at navbar height */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: durationFast,
          ease: easeEntry,
        }}
        className="fixed top-5 left-8 z-50 hidden md:flex h-14 items-center"
      >
        <Link
          href="/"
          aria-label="Programo — strona główna"
          className="flex items-center gap-3 font-headline text-3xl font-semibold tracking-tight text-on-surface"
        >
          <Image
            src="/programo-mark.svg"
            alt=""
            width={48}
            height={48}
            priority
            className="h-12 w-12"
          />
          <span>Programo</span>
        </Link>
      </motion.div>

      {/* Desktop floating pill nav — centered, compact */}
      <motion.nav
        role="navigation"
        aria-label={t("a11y.mainNav")}
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: durationFast,
          ease: easeEntry,
        }}
        className="fixed top-6 left-1/2 -translate-x-1/2 z-50 hidden md:block"
      >
        <div
          className="liquid-glass relative rounded-full transition-all duration-500"
          data-scrolled={scrolled ? "true" : "false"}
        >
          <div className="relative z-10 flex items-center gap-7 px-6 py-2.5">
            {navLinks.map((link) => {
              const isActive = activeSection === link.section;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative text-[13px] uppercase font-medium transition-colors ${
                    isActive
                      ? "text-[var(--theme-nav-text)]"
                      : "text-[rgba(var(--theme-nav-text-rgb),0.6)] hover:text-[var(--theme-nav-text)]"
                  }`}
                  style={{
                    transitionDuration: `${durationFast * 1000}ms`,
                    transitionTimingFunction: `cubic-bezier(${easeHover.join(",")})`,
                  }}
                >
                  {link.label}
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute -bottom-1.5 left-0 right-0 h-[2px] bg-primary rounded-full"
                      transition={{
                        type: "spring",
                        ...springGentle,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </motion.nav>

      {/* Desktop right cluster — theme, lang, CTA */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: durationFast,
          ease: easeEntry,
        }}
        className="fixed top-6 right-8 z-50 hidden md:flex h-12 items-center gap-4"
      >
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="flex items-center justify-center w-8 h-8 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
        >
          {theme === "dark" ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="4"/>
              <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
            </svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          )}
        </button>
        <button
          onClick={toggle}
          aria-label={t("a11y.langToggle")}
          className="text-[13px] uppercase font-medium text-on-surface-variant cursor-pointer hover:text-on-surface transition-colors"
        >
          {lang === "pl" ? "EN" : "PL"}
        </button>
        <ContactCtaLink className="bg-primary px-5 py-2.5 rounded-full text-on-primary text-[13px] uppercase tracking-wide font-medium hover:bg-primary-container transition-all">
          {t("nav.cta")}
        </ContactCtaLink>
      </motion.div>

      {/* Mobile navbar */}
      <motion.nav
        role="navigation"
        aria-label={t("a11y.mainNav")}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: durationFast,
          ease: easeEntry,
        }}
        className="fixed top-0 left-0 right-0 z-50 md:hidden flex justify-center"
      >
        <div
          className="liquid-glass relative rounded-full mt-6 mx-auto max-w-fit px-5 py-2 flex items-center gap-6 transition-all duration-500"
          data-scrolled={scrolled ? "true" : "false"}
        >
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-11 w-11 flex-col items-center justify-center gap-1.5"
            aria-label="Toggle menu"
          >
            <span
              className={`h-[1.5px] w-5 bg-[var(--theme-nav-text)] transition-all duration-300 ${
                mobileOpen ? "translate-y-[4.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-[1.5px] w-5 bg-[var(--theme-nav-text)] transition-all duration-300 ${
                mobileOpen ? "-translate-y-[1.5px] -rotate-45" : ""
              }`}
            />
          </button>

          <Link
            href="/"
            aria-label="Programo — strona główna"
            className="flex items-center gap-2 text-lg font-headline font-semibold tracking-tight text-[var(--theme-nav-text)]"
          >
            <Image
              src="/programo-mark.svg"
              alt=""
              width={22}
              height={22}
              priority
              className="h-[22px] w-[22px]"
            />
            <span>Programo</span>
          </Link>

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex items-center justify-center w-7 h-7 text-[var(--theme-nav-text)] cursor-pointer"
          >
            {theme === "dark" ? (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="4"/>
                <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>
              </svg>
            ) : (
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
          <button
            onClick={toggle}
            aria-label={t("a11y.langToggle")}
            className="text-[13px] uppercase text-[var(--theme-nav-text)] font-medium cursor-pointer"
          >
            {lang === "pl" ? "EN" : "PL"}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ clipPath: "circle(0% at 90% 5%)" }}
            animate={{ clipPath: "circle(150% at 90% 5%)" }}
            exit={{ clipPath: "circle(0% at 90% 5%)" }}
            transition={{
              duration: 0.6,
              ease: easeEntry,
            }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-surface/98 backdrop-blur-lg md:hidden"
          >
            <nav className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -30, y: 20 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, x: -30, y: 20 }}
                  transition={{
                    delay: i * 0.1,
                    duration: durationMedium,
                    ease: easeEntry,
                  }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="font-headline text-2xl font-normal text-on-surface min-h-[44px] flex items-center"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <ContactCtaLink
                onNavigate={() => setMobileOpen(false)}
                className="mt-4 bg-primary px-8 py-3 rounded-full text-on-primary text-sm tracking-wide font-medium min-h-[44px] flex items-center"
              >
                {t("nav.cta")}
              </ContactCtaLink>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
