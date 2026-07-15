"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
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
  const shouldReduceMotion = useReducedMotion();

  const ticking = useRef(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuOverlayRef = useRef<HTMLDivElement>(null);
  const wasMobileOpenRef = useRef(false);

  const navLinks = [
    { label: t("nav.offer"), href: "/oferta", section: "oferta" },
    { label: t("nav.work"), href: "/projekty", section: "projekty" },
    { label: t("nav.stores"), href: "/sklepy-internetowe", section: "sklepy-internetowe" },
    { label: t("nav.marketing"), href: "/strony-tracking-reklamy", section: "strony-tracking-reklamy" },
    { label: t("nav.pricing"), href: "/cennik", section: "cennik" },
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

  // --- Escape closes the mobile menu overlay, focus is trapped inside it
  //     while open and returns to the hamburger trigger on close ---
  useEffect(() => {
    if (!mobileOpen) {
      if (wasMobileOpenRef.current) menuButtonRef.current?.focus();
      wasMobileOpenRef.current = false;
      return;
    }
    wasMobileOpenRef.current = true;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        return;
      }
      if (e.key !== "Tab") return;
      const container = menuOverlayRef.current;
      if (!container) return;
      const focusable = container.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    // Move focus into the overlay once it has mounted.
    const focusTimer = window.setTimeout(() => {
      menuOverlayRef.current
        ?.querySelector<HTMLElement>('a[href], button:not([disabled])')
        ?.focus();
    }, 50);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      window.clearTimeout(focusTimer);
    };
  }, [mobileOpen]);

  return (
    // display:contents keeps this a real <header>/"banner" landmark for the whole
    // site chrome without introducing a box — the fixed-position children below
    // behave exactly as before.
    <header className="contents">
      {/* Desktop header — single fixed container, three zones (logo | pill nav | cluster).
          Grid cols 1fr/auto/1fr keeps the pill perfectly centered and structurally
          prevents the zones from ever overlapping. */}
      <motion.div
        initial={shouldReduceMotion ? false : { y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: shouldReduceMotion ? 0 : durationFast,
          ease: easeEntry,
        }}
        className="fixed top-0 left-0 right-0 z-50 hidden xl:grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 lg:px-8 pt-5"
      >
        {/* Zone 1 — logo */}
        <div className="justify-self-start">
          <Link
            href="/"
            aria-label="Programo — strona główna"
            className="flex items-center"
          >
            <Image
              key={theme}
              src={theme === "dark" ? "/programo-logo-white.svg" : "/programo-logo-dark.svg"}
              alt="Programo"
              width={300}
              height={212}
              priority
              className="h-auto w-[168px] xl:w-[200px] select-none"
            />
          </Link>
        </div>

        {/* Zone 2 — floating pill nav */}
        <nav
          role="navigation"
          aria-label={t("a11y.mainNav")}
          className="justify-self-center"
        >
          <div
            className="liquid-glass relative rounded-full transition-all duration-500"
            data-scrolled={scrolled ? "true" : "false"}
          >
            <div className="relative z-10 flex items-center gap-4 lg:gap-6 px-5 lg:px-6 py-2.5">
              {navLinks.map((link) => {
                const isActive = activeSection === link.section;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative whitespace-nowrap text-[12px] lg:text-[13px] uppercase font-medium transition-colors ${
                      isActive
                        ? "text-[var(--theme-nav-text)]"
                        : "text-[rgba(var(--theme-nav-text-rgb),0.72)] hover:text-[var(--theme-nav-text)]"
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
        </nav>

        {/* Zone 3 — theme, lang, CTA. Phone: handset link always; number text from 2xl. */}
        <div className="justify-self-end flex h-12 items-center gap-3 lg:gap-4">
          <a
            href="tel:+48509123434"
            aria-label={`${t("nav.phone")}: 509 123 434`}
            className="inline-flex items-center gap-2 text-[13px] font-medium text-on-surface-variant transition-colors hover:text-on-surface"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" fill="none" aria-hidden="true">
              <path d="M6.5 3.5l3 1 1 4-2 1.5a11 11 0 005 5l1.5-2 4 1 1 3a2 2 0 01-2 2.3A16 16 0 014.2 6.5 2 2 0 016.5 3.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="hidden 2xl:inline whitespace-nowrap">509 123 434</span>
          </a>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            className="flex items-center justify-center w-11 h-11 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
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
            className="inline-flex items-center justify-center min-h-[44px] min-w-[44px] text-[13px] uppercase font-medium text-on-surface-variant cursor-pointer hover:text-on-surface transition-colors"
          >
            {lang === "pl" ? "EN" : "PL"}
          </button>
          <ContactCtaLink className="whitespace-nowrap bg-primary px-4 lg:px-5 py-2.5 rounded-full text-on-primary text-[12px] lg:text-[13px] uppercase tracking-wide font-medium hover:bg-primary-container transition-all">
            {t("nav.cta")}
          </ContactCtaLink>
        </div>
      </motion.div>

      {/* Mobile navbar */}
      <motion.nav
        role="navigation"
        aria-label={t("a11y.mainNav")}
        initial={shouldReduceMotion ? false : { y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          duration: shouldReduceMotion ? 0 : durationFast,
          ease: easeEntry,
        }}
        className="fixed top-0 left-0 right-0 z-50 xl:hidden flex justify-center"
      >
        <div
          className="liquid-glass relative rounded-full mt-4 mx-auto max-w-fit px-5 py-0.5 flex items-center gap-5 transition-all duration-500"
          data-scrolled={scrolled ? "true" : "false"}
        >
          <button
            ref={menuButtonRef}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1.5"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu-overlay"
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
            className="flex items-center"
          >
            <Image
              key={theme}
              src={theme === "dark" ? "/programo-logo-white.svg" : "/programo-logo-dark.svg"}
              alt="Programo"
              width={170}
              height={120}
              priority
              className="h-auto w-[78px] select-none"
            />
          </Link>

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center text-[var(--theme-nav-text)] cursor-pointer"
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
            className="flex min-h-[44px] min-w-[44px] items-center justify-center text-[13px] uppercase text-[var(--theme-nav-text)] font-medium cursor-pointer"
          >
            {lang === "pl" ? "EN" : "PL"}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu-overlay"
            ref={menuOverlayRef}
            initial={shouldReduceMotion ? false : { clipPath: "circle(0% at 90% 5%)" }}
            animate={{ clipPath: "circle(150% at 90% 5%)" }}
            exit={shouldReduceMotion ? undefined : { clipPath: "circle(0% at 90% 5%)" }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.6,
              ease: easeEntry,
            }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-surface/98 backdrop-blur-lg xl:hidden"
          >
            <nav aria-label={t("a11y.mainNav")} className="flex flex-col items-center gap-8">
              <motion.a
                href="tel:+48509123434"
                initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduceMotion ? undefined : { opacity: 0, y: 20 }}
                transition={{ duration: shouldReduceMotion ? 0 : durationMedium, ease: easeEntry }}
                className="inline-flex items-center gap-2 rounded-full border border-primary/40 px-5 py-2.5 text-sm font-medium uppercase tracking-widest text-primary min-h-[44px]"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" aria-hidden="true">
                  <path d="M6.5 3.5l3 1 1 4-2 1.5a11 11 0 005 5l1.5-2 4 1 1 3a2 2 0 01-2 2.3A16 16 0 014.2 6.5 2 2 0 016.5 3.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                509 123 434
              </motion.a>
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={shouldReduceMotion ? false : { opacity: 0, x: -30, y: 20 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={shouldReduceMotion ? undefined : { opacity: 0, x: -30, y: 20 }}
                  transition={{
                    delay: shouldReduceMotion ? 0 : i * 0.1,
                    duration: shouldReduceMotion ? 0 : durationMedium,
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
    </header>
  );
}
