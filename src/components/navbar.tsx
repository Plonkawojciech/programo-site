"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import {
  easeEntry,
  easeHover,
  durationFast,
  durationMedium,
  springGentle,
} from "@/lib/motion";
import MagneticWrapper from "@/components/magnetic";

export default function Navbar() {
  const { lang, toggle, t } = useI18n();
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

  const handleScroll = useCallback(() => {
    const currentY = window.scrollY;

    if (currentY < 100) {
      setHidden(false);
      setScrolled(currentY > 40);
      lastScrollY.current = currentY;
      ticking.current = false;
      return;
    }

    setScrolled(true);

    const delta = currentY - lastScrollY.current;

    if (delta > 8) {
      setHidden(true);
    } else if (delta < -5) {
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

  const isNavHidden = hidden && !mobileOpen;

  return (
    <>
      {/* Desktop floating dark glass pill nav */}
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
              ? "border-white/[0.08] bg-black/60 shadow-[0_20px_60px_rgba(0,0,0,0.5)] backdrop-blur-2xl"
              : "border-white/[0.04] bg-black/40 shadow-none backdrop-blur-xl"
          }`}
        >
          <div className="flex justify-between items-center px-8 py-3">
            <Link
              href="/"
              className="font-headline text-xl font-semibold tracking-tight text-on-surface"
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
                        ? "text-primary"
                        : "text-on-surface-variant/70 hover:text-primary"
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
                onClick={toggle}
                aria-label={t("a11y.langToggle")}
                className="text-[13px] uppercase font-medium text-on-surface-variant/50 cursor-pointer hover:text-primary transition-colors"
                style={{
                  transitionDuration: `${durationFast * 1000}ms`,
                  transitionTimingFunction: `cubic-bezier(${easeHover.join(",")})`,
                }}
              >
                {lang === "pl" ? "EN" : "PL"}
              </button>
              <MagneticWrapper>
                <a
                  href="#contact"
                  className="border border-primary/40 px-5 py-2.5 rounded-full text-primary text-[13px] uppercase tracking-wide font-medium hover:bg-primary hover:text-surface transition-all"
                  style={{
                    transitionDuration: `${durationFast * 1000}ms`,
                    transitionTimingFunction: `cubic-bezier(${easeHover.join(",")})`,
                  }}
                >
                  {t("nav.cta")}
                </a>
              </MagneticWrapper>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile navbar — dark glass pill */}
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
          className={`bg-black/60 backdrop-blur-2xl rounded-full mt-6 mx-auto max-w-fit px-5 py-2 border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.5)] flex items-center gap-6 transition-all duration-500`}
        >
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-11 w-11 flex-col items-center justify-center gap-1.5"
            aria-label="Toggle menu"
          >
            <span
              className={`h-[1.5px] w-5 bg-on-surface transition-all duration-300 ${
                mobileOpen ? "translate-y-[4.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-[1.5px] w-5 bg-on-surface transition-all duration-300 ${
                mobileOpen ? "-translate-y-[1.5px] -rotate-45" : ""
              }`}
            />
          </button>

          <Link
            href="/"
            className="text-lg font-headline font-semibold tracking-tight text-on-surface"
          >
            Programo
          </Link>

          <button
            onClick={toggle}
            aria-label={t("a11y.langToggle")}
            className="text-[13px] uppercase text-primary font-medium cursor-pointer"
          >
            {lang === "pl" ? "EN" : "PL"}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu overlay — dark */}
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
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-surface/[0.98] backdrop-blur-lg md:hidden"
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
                className="mt-4 border border-primary/40 px-8 py-3 rounded-full text-primary text-sm tracking-wide font-medium min-h-[44px] flex items-center hover:bg-primary hover:text-surface transition-all"
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
