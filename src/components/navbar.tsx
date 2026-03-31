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
      {/* Desktop minimal flat bar */}
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
        className="fixed top-0 left-0 right-0 z-50 hidden md:block"
      >
        <div
          className={`transition-all duration-500 ${
            scrolled
              ? "border-b border-on-surface/10 bg-surface/80 backdrop-blur-xl"
              : "border-b border-transparent bg-transparent"
          }`}
        >
          <div className="mx-auto flex max-w-[2560px] items-center justify-between px-8 py-5 2xl:px-16">
            <Link
              href="/"
              className="font-headline text-xl italic font-medium tracking-tight text-on-surface"
            >
              Programo
            </Link>

            <div className="flex items-center gap-10">
              {navLinks.map((link) => {
                const isActive = activeSection === link.section;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className={`relative text-[11px] font-medium uppercase tracking-[0.2em] transition-colors ${
                      isActive
                        ? "text-on-surface"
                        : "text-on-surface-variant/60 hover:text-on-surface"
                    }`}
                    style={{
                      transitionDuration: `${durationFast * 1000}ms`,
                      transitionTimingFunction: `cubic-bezier(${easeHover.join(",")})`,
                    }}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-dot"
                        className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary"
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

            <div className="flex items-center gap-6">
              <button
                onClick={toggle}
                aria-label={t("a11y.langToggle")}
                className="text-[11px] font-medium uppercase tracking-[0.2em] text-on-surface-variant/50 cursor-pointer hover:text-primary transition-colors"
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
                  className="rounded-full border border-primary px-5 py-2 text-[11px] font-medium uppercase tracking-[0.2em] text-primary transition-all hover:bg-primary hover:text-white"
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
        className="fixed top-0 left-0 right-0 z-50 md:hidden"
      >
        <div
          className={`flex items-center justify-between px-6 py-4 transition-all duration-500 ${
            scrolled
              ? "border-b border-on-surface/10 bg-surface/90 backdrop-blur-xl"
              : "bg-transparent"
          }`}
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
            className="font-headline text-lg italic font-medium tracking-tight text-on-surface"
          >
            Programo
          </Link>

          <button
            onClick={toggle}
            aria-label={t("a11y.langToggle")}
            className="text-[11px] uppercase tracking-[0.2em] text-primary font-medium cursor-pointer"
          >
            {lang === "pl" ? "EN" : "PL"}
          </button>
        </div>
      </motion.nav>

      {/* Mobile full-screen overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{
              duration: 0.6,
              ease: easeEntry,
            }}
            className="fixed inset-0 z-40 flex flex-col items-start justify-center bg-[#0A0A0A] px-8 md:hidden"
          >
            <nav className="flex flex-col gap-4">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{
                    delay: i * 0.08,
                    duration: durationMedium,
                    ease: easeEntry,
                  }}
                  className="font-headline text-[12vw] font-medium italic leading-[1.1] text-[#F0F0EC] min-h-[44px] flex items-center"
                >
                  {link.label}
                </motion.a>
              ))}
            </nav>

            <motion.a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                delay: navLinks.length * 0.08 + 0.1,
                duration: durationMedium,
                ease: easeEntry,
              }}
              className="mt-12 rounded-full border border-primary px-8 py-3 text-sm font-medium uppercase tracking-[0.2em] text-primary min-h-[44px] flex items-center"
            >
              {t("nav.cta")}
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
