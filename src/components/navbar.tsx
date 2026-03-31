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
      {/* Desktop — ultra-minimal thin bar */}
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
              ? "bg-[#0A0808]/80 backdrop-blur-xl"
              : "bg-transparent"
          }`}
        >
          <div className="flex justify-between items-center px-10 py-5 max-w-[2560px] mx-auto">
            {/* Logo — Newsreader italic, gold */}
            <Link
              href="/"
              className="font-headline text-lg italic tracking-tight"
              style={{ color: "#C8A44E" }}
            >
              Programo
            </Link>

            {/* Nav links — tiny uppercase */}
            <div className="flex items-center gap-10">
              {navLinks.map((link) => {
                const isActive = activeSection === link.section;
                return (
                  <a
                    key={link.href}
                    href={link.href}
                    className="relative text-[11px] uppercase font-medium transition-colors"
                    style={{
                      letterSpacing: "0.4em",
                      color: isActive ? "#C8A44E" : "#E8E0D0",
                      transitionDuration: `${durationFast * 1000}ms`,
                      transitionTimingFunction: `cubic-bezier(${easeHover.join(",")})`,
                    }}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-dot"
                        className="absolute -bottom-2 left-1/2 -translate-x-1/2 h-[3px] w-[3px] rounded-full"
                        style={{ backgroundColor: "#C8A44E" }}
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

            {/* Right — lang toggle */}
            <button
              onClick={toggle}
              aria-label={t("a11y.langToggle")}
              className="text-[11px] uppercase font-medium cursor-pointer transition-colors"
              style={{
                letterSpacing: "0.4em",
                color: "#8A8278",
                transitionDuration: `${durationFast * 1000}ms`,
                transitionTimingFunction: `cubic-bezier(${easeHover.join(",")})`,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#C8A44E")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#8A8278")}
            >
              {lang === "pl" ? "EN" : "PL"}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile navbar — minimal */}
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
          className={`transition-all duration-500 px-5 py-4 flex justify-between items-center ${
            scrolled ? "bg-[#0A0808]/90 backdrop-blur-xl" : "bg-transparent"
          }`}
        >
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-11 w-11 flex-col items-center justify-center gap-1.5"
            aria-label="Toggle menu"
          >
            <span
              className={`h-[1px] w-5 transition-all duration-300 ${
                mobileOpen ? "translate-y-[4px] rotate-45" : ""
              }`}
              style={{ backgroundColor: "#C8A44E" }}
            />
            <span
              className={`h-[1px] w-5 transition-all duration-300 ${
                mobileOpen ? "-translate-y-[2px] -rotate-45" : ""
              }`}
              style={{ backgroundColor: "#C8A44E" }}
            />
          </button>

          <Link
            href="/"
            className="font-headline text-lg italic tracking-tight"
            style={{ color: "#C8A44E" }}
          >
            Programo
          </Link>

          <button
            onClick={toggle}
            aria-label={t("a11y.langToggle")}
            className="text-[11px] uppercase font-medium cursor-pointer"
            style={{ color: "#C8A44E", letterSpacing: "0.4em" }}
          >
            {lang === "pl" ? "EN" : "PL"}
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu overlay — warm dark with large serif links */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.4,
              ease: easeEntry,
            }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center md:hidden"
            style={{ backgroundColor: "rgba(10, 8, 8, 0.98)" }}
          >
            <nav className="flex flex-col items-center gap-10">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{
                    delay: i * 0.1,
                    duration: durationMedium,
                    ease: easeEntry,
                  }}
                  className="font-headline text-4xl font-normal italic tracking-tight min-h-[44px] flex items-center"
                  style={{ color: "#E8E0D0" }}
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 30 }}
                transition={{
                  delay: navLinks.length * 0.1,
                  duration: durationMedium,
                  ease: easeEntry,
                }}
                className="mt-6 font-headline text-2xl italic tracking-tight min-h-[44px] flex items-center"
                style={{ color: "#C8A44E" }}
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
