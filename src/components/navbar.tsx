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
    { label: t("nav.blog"), href: "/blog", section: "blog" },
    { label: t("nav.referral"), href: "/wspolpraca", section: "wspolpraca" },
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

  // --- Active section: pure derivation from pathname, no state needed ---
  const activeSection = pathname
    ? (navLinks.find((l) => pathname === l.href || pathname.startsWith(`${l.href}/`))?.section ?? "")
    : "";

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
        className="fixed top-0 left-0 right-0 z-50 hidden xl:grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 lg:px-8 pt-5 pb-4"
      >
        {/* Shared ground for all three zones once the page moves. Sits behind
            them (the grid children are position:relative) and is inert. */}
        <div className="nav-band" data-scrolled={scrolled ? "true" : "false"} aria-hidden="true" />

        {/* Zone 1 — logo */}
        <div className="relative justify-self-start">
          <Link
            href="/"
            aria-label="Programo - strona główna"
            className="flex items-center"
          >
            {/* The SVG is an A4 art-board (viewBox 841.89x595.28) with the
                wordmark centred in it, so the ink is only 121.3 units tall —
                20% of the canvas. Rendered at `h-auto` the box came out 141px
                tall against ~29px of visible logo, which inflated this fixed
                header to 177px: an invisible full-width strip that swallowed
                pointer events over the top of the hero, and far too tall a
                ground for the scroll band. Cropping to the ink's aspect with
                object-cover leaves the rendered wordmark pixel-identical (both
                scale by width) and drops the dead space. */}
            <Image
              key={theme}
              src={theme === "dark" ? "/programo-logo-white.svg" : "/programo-logo-dark.svg"}
              alt="Programo"
              width={300}
              height={212}
              priority
              className="w-[168px] 2xl:w-[200px] shrink-0 aspect-[841.89/121.3] object-cover select-none"
            />
          </Link>
        </div>

        {/* Zone 2 — floating pill nav */}
        <nav
          role="navigation"
          aria-label={t("a11y.mainNav")}
          className="relative justify-self-center"
        >
          {/* No `data-scrolled` here on purpose — the band behind it now owns the
              scrolled state, so the pill keeps one constant treatment. */}
          <div className="liquid-glass relative rounded-full">
            {/* Zagęszczenie przełącza się na 2xl, nie na lg. Ósma pozycja
                ("Współpraca") rozpycha pigułkę do 754 px, a przy gap-6/13 px
                od lg kolumna 1fr z logo zwijała się na 1280 px ze 200 px do
                104 px - logo po prostu robiło się węższe i nikt tego nie
                zgłaszał, bo nic nie wychodziło poza ekran. */}
            <div className="relative z-10 flex items-center gap-4 2xl:gap-6 px-5 2xl:px-6 py-2.5">
              {navLinks.map((link) => {
                const isActive = activeSection === link.section;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    // 0.92, nie 0.72. Pigułka składa się do rgb(130,143,144),
                    // więc przy 0.72 nieaktywne pozycje mierzyły 3.39:1 przy
                    // wymaganych 4.5:1 dla 12 px - i to na każdej podstronie.
                    // Nawet pełną siłą koloru wychodzi tu 5.13:1, bo limitem
                    // jest samo tło pigułki. Stan aktywny nic na tym nie traci:
                    // niesie go podkreślenie w kolorze primary i aria-current,
                    // a nie sama różnica przezroczystości.
                    className={`relative whitespace-nowrap text-[12px] 2xl:text-[13px] uppercase font-medium transition-colors ${
                      isActive
                        ? "text-[var(--theme-nav-text)]"
                        : "text-[rgba(var(--theme-nav-text-rgb),0.92)] hover:text-[var(--theme-nav-text)]"
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
        <div className="relative justify-self-end flex h-12 items-center gap-3 lg:gap-4">
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
            aria-label="Programo - strona główna"
            className="flex items-center"
          >
            {/* Inverted against the desktop logo above, on purpose. This one
                sits INSIDE the pill, and the pill is deliberately the opposite
                of the page — globals.css:44, "pill is light in dark mode, dark
                in light mode". Picking the logo by page theme (which is what
                the desktop band wants) put the dark wordmark on the dark pill
                in light mode and it vanished. Everything else in this pill
                already tints from --theme-nav-text; the logo is a file, so it
                has to pick the file that matches that token. */}
            <Image
              key={theme}
              src={theme === "dark" ? "/programo-logo-dark.svg" : "/programo-logo-white.svg"}
              alt="Programo"
              width={170}
              height={120}
              priority
              className="w-[78px] aspect-[841.89/121.3] object-cover select-none"
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

      {/* Mobile menu — a sheet, not a centred stack.

          The old version was `inset-0 … justify-center` holding nine children at
          gap-8. At 375x667 that is taller than the viewport, there was no
          scroller, and `body { overflow: hidden }` was already blocking the page
          behind it — so the bottom of the menu was simply unreachable. It also
          sat at z-40: below the pill (z-50), which punched through it, and level
          with the sticky call bar, which covered the CTA.

          Three rows now. `100dvh` rather than `inset-0`, because `vh` resolves
          against the largest viewport and would push the footer under mobile
          browser chrome. The middle row owns the only scroll.

          `--z-nav-scrim` (45) sits above the sticky call bar (40) and below the
          pill (50) — deliberately, not by accident. The top row is clearance,
          not decoration: the pill stays visible so the hamburger, which carries
          aria-expanded and is where focus returns, is still tappable to close. */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu-overlay"
            ref={menuOverlayRef}
            // Reveal originates from the hamburger, which is on the LEFT of the
            // pill. The old circle grew from 90% 5% — the opposite corner, so
            // the menu appeared to come from nowhere the user had touched.
            initial={shouldReduceMotion ? false : { clipPath: "circle(0% at 25% 6%)" }}
            animate={{ clipPath: "circle(150% at 25% 6%)" }}
            exit={shouldReduceMotion ? undefined : { clipPath: "circle(0% at 25% 6%)" }}
            transition={{
              duration: shouldReduceMotion ? 0 : 0.5,
              ease: easeEntry,
            }}
            className="fixed inset-x-0 top-0 z-[var(--z-nav-scrim)] grid h-[100dvh] grid-rows-[auto_1fr_auto] bg-surface/98 backdrop-blur-2xl xl:hidden"
          >
            {/* Pill clearance. 16px margin + 48px pill + 24px breathing room. */}
            <div aria-hidden="true" className="h-[88px]" />

            {/* Not a <nav>: the pill above is already the mobile navigation
                landmark and is labelled as such. A second landmark with the
                same name is a worse outcome than none — the toggle points here
                with aria-controls, which is what the disclosure pattern wants. */}
            <div className="overflow-y-auto overscroll-contain px-6">
              <ul role="list" className="flex flex-col">
                {navLinks.map((link, i) => {
                  const isActive = activeSection === link.section;
                  return (
                    <motion.li
                      key={link.href}
                      initial={shouldReduceMotion ? false : { opacity: 0, x: -16 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={shouldReduceMotion ? undefined : { opacity: 0, x: -16 }}
                      transition={{
                        // 0.04 not 0.1: seven links at the old stagger took
                        // 700ms to finish arriving, which reads as lag.
                        delay: shouldReduceMotion ? 0 : i * 0.04,
                        duration: shouldReduceMotion ? 0 : durationMedium,
                        ease: easeEntry,
                      }}
                      // on-surface-variant, not outline-variant. The latter is
                      // --theme-border-1, which in the dark theme is #163832 —
                      // DARKER than the sheet it sits on, so the rules measured
                      // 1.06:1 and were simply not there. on-surface-variant is
                      // the one token that inverts with the theme, so one value
                      // gives a real hairline in both.
                      className="border-b border-on-surface-variant/25 last:border-b-0"
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        aria-current={isActive ? "page" : undefined}
                        className={`flex min-h-[56px] items-center justify-between gap-4 font-headline text-xl transition-colors ${
                          isActive ? "text-primary" : "text-on-surface"
                        }`}
                      >
                        <span>{link.label}</span>
                        <span
                          aria-hidden="true"
                          className={`text-base leading-none ${
                            isActive ? "text-primary" : "text-on-surface-variant/60"
                          }`}
                        >
                          →
                        </span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>
            </div>

            {/* Pinned actions. The phone number lived in three places at once
                before — top of the overlay, the overlay CTA, and the sticky bar
                underneath — so it read as filler rather than as the one thing
                this site is asking for. Once here, at the thumb.

                Deliberately not animated. This row is the sheet's anchor and it
                carries the only conversion on the page; gating it behind an
                entrance means that any environment where the transition stalls
                shows a menu with no way to contact us. The links stagger, the
                anchor is simply there. */}
            <div className="border-t border-on-surface-variant/30 px-6 pt-5 pb-[max(env(safe-area-inset-bottom),1.25rem)]">
              <a
                href="tel:+48509123434"
                className="flex min-h-[44px] items-center gap-2.5 text-base font-medium text-on-surface"
              >
                <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0 text-primary" fill="none" aria-hidden="true">
                  <path d="M6.5 3.5l3 1 1 4-2 1.5a11 11 0 005 5l1.5-2 4 1 1 3a2 2 0 01-2 2.3A16 16 0 014.2 6.5 2 2 0 016.5 3.5z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                509 123 434
              </a>
              <ContactCtaLink
                onNavigate={() => setMobileOpen(false)}
                className="mt-3 flex min-h-[52px] w-full items-center justify-center rounded-full bg-primary px-6 text-sm font-medium tracking-wide text-on-primary transition-transform active:scale-[0.98]"
              >
                {t("nav.cta")}
              </ContactCtaLink>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
