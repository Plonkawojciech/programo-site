"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { useTheme } from "@/lib/theme";
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
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  const isHome = pathname === "/";
  const prefix = isHome ? "" : "/";

  const sections = ["work", "about", "stack", "contact"];

  const navLinks = [
    { label: t("nav.work"), href: `${prefix}#work`, section: "work" },
    { label: t("nav.about"), href: `${prefix}#about`, section: "about" },
    { label: t("nav.stack"), href: `${prefix}#stack`, section: "stack" },
    { label: t("nav.contact"), href: `${prefix}#contact`, section: "contact" },
  ];

  // --- Hide on scroll down, show on scroll up ---
  const handleScroll = useCallback(() => {
    const currentY = window.scrollY;

    // Always show at top of page
    if (currentY < 100) {
      setHidden(false);
      setScrolled(currentY > 40);
      lastScrollY.current = currentY;
      ticking.current = false;
      return;
    }

    setScrolled(true);

    const delta = currentY - lastScrollY.current;

    // Only trigger hide/show with a minimum delta to avoid jitter
    if (delta > 8) {
      // Scrolling DOWN
      setHidden(true);
    } else if (delta < -5) {
      // Scrolling UP
      setHidden(false);
    }

    lastScrollY.current = currentY;
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

  // --- Active section IntersectionObserver ---
  useEffect(() => {
    if (!isHome) return;

    const observers: IntersectionObserver[] = [];
    for (const id of sections) {
      const el = document.getElementById(id);
      if (!el) continue;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { rootMargin: "-40% 0px -40% 0px" }
      );
      observer.observe(el);
      observers.push(observer);
    }

    return () => observers.forEach((o) => o.disconnect());
  }, [isHome]); // eslint-disable-line react-hooks/exhaustive-deps

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

  // Don't hide nav when mobile menu is open
  const isNavHidden = hidden && !mobileOpen;

  return (
    <>
      {/* Desktop floating pill nav */}
      <motion.nav
        role="navigation"
        aria-label={t("a11y.mainNav")}
        initial={{ y: -30, opacity: 0 }}
        animate={{
          y: isNavHidden ? -100 : 0,
          opacity: isNavHidden ? 0 : 1,
        }}
        transition={{
          duration: durationFast,
          ease: easeEntry,
        }}
        className="fixed top-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[1400px] z-50 hidden md:block"
      >
        <div
          className={`rounded-full border transition-all duration-500 ${
            scrolled
              ? "border-[var(--theme-nav-pill-border-scrolled)] bg-[var(--theme-nav-pill-scrolled)] shadow-[0_20px_40px_var(--theme-nav-pill-shadow)] backdrop-blur-2xl"
              : "border-[var(--theme-nav-pill-border)] bg-[var(--theme-nav-pill)] shadow-none backdrop-blur-xl"
          }`}
        >
          <div className="flex justify-between items-center px-8 py-3">
            <Link
              href="/"
              className="font-headline text-xl font-semibold tracking-tight text-[var(--theme-nav-text)]"
            >
              Programo
            </Link>

            <div className="flex items-center gap-8">
              {navLinks.map((link) => {
                const isActive = activeSection === link.section;
                return (
                  <a
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
                  </a>
                );
              })}
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={toggleTheme}
                aria-label="Toggle theme"
                title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
                className="flex items-center justify-center w-8 h-8 text-[rgba(var(--theme-nav-text-rgb),0.6)] hover:text-[var(--theme-nav-text)] transition-colors cursor-pointer"
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
                className="text-[13px] uppercase font-medium text-[rgba(var(--theme-nav-text-rgb),0.4)] cursor-pointer hover:text-[var(--theme-nav-text)] transition-colors"
                style={{
                  transitionDuration: `${durationFast * 1000}ms`,
                  transitionTimingFunction: `cubic-bezier(${easeHover.join(",")})`,
                }}
              >
                {lang === "pl" ? "EN" : "PL"}
              </button>
              <a
                href="#contact"
                className="bg-primary px-5 py-2.5 rounded-full text-on-primary text-[13px] uppercase tracking-wide font-medium hover:bg-primary-container transition-all"
                style={{
                  transitionDuration: `${durationFast * 1000}ms`,
                  transitionTimingFunction: `cubic-bezier(${easeHover.join(",")})`,
                }}
              >
                {t("nav.cta")}
              </a>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile navbar */}
      <motion.nav
        role="navigation"
        aria-label={t("a11y.mainNav")}
        initial={{ y: -20, opacity: 0 }}
        animate={{
          y: isNavHidden ? -80 : 0,
          opacity: isNavHidden ? 0 : 1,
        }}
        transition={{
          duration: durationFast,
          ease: easeEntry,
        }}
        className="fixed top-0 left-0 right-0 z-50 md:hidden flex justify-center"
      >
        <div
          className={`bg-[var(--theme-nav-pill-mobile)] backdrop-blur-xl rounded-full mt-6 mx-auto max-w-fit px-5 py-2 border border-outline-variant/20 shadow-[0_20px_40px_var(--theme-nav-pill-shadow-soft)] flex items-center gap-6 transition-all duration-500 ${
            scrolled ? "shadow-[0_20px_40px_var(--theme-nav-pill-shadow)]" : ""
          }`}
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
            className="text-lg font-headline font-semibold tracking-tight text-[var(--theme-nav-text)]"
          >
            Programo
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
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: -30, y: 20 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, x: -30, y: 20 }}
                  transition={{
                    delay: i * 0.1,
                    duration: durationMedium,
                    ease: easeEntry,
                  }}
                  className="font-headline text-2xl font-normal text-on-surface min-h-[44px] flex items-center"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0, x: -30, y: 20 }}
                animate={{ opacity: 1, x: 0, y: 0 }}
                exit={{ opacity: 0, x: -30, y: 20 }}
                transition={{
                  delay: navLinks.length * 0.1,
                  duration: durationMedium,
                  ease: easeEntry,
                }}
                className="mt-4 bg-primary px-8 py-3 rounded-full text-on-primary text-sm tracking-wide font-medium min-h-[44px] flex items-center"
              >
                {t("nav.cta")}
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
