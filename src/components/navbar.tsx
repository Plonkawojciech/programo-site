"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";

export default function Navbar() {
  const { lang, toggle, t } = useI18n();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { label: t("nav.work"), href: "#work" },
    { label: t("nav.about"), href: "#about" },
    { label: t("nav.stack"), href: "#stack" },
    { label: t("nav.contact"), href: "#contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Desktop pill navbar */}
      <motion.nav
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        className="fixed top-5 left-0 right-0 z-50 hidden md:flex justify-center pointer-events-none"
      >
        <div
          className={`pointer-events-auto flex items-center gap-1 rounded-full border px-2 py-2 transition-all duration-500 ${
            scrolled
              ? "border-sage/12 bg-beige-light/85 shadow-lg shadow-sage/5 backdrop-blur-xl"
              : "border-sage/8 bg-beige-light/60 backdrop-blur-md"
          }`}
        >
          {/* Home / Logo */}
          <a
            href="#"
            className="flex h-10 w-10 items-center justify-center rounded-full text-sage transition-all duration-300 hover:bg-sage/8"
          >
            <span className="font-serif text-lg leading-none">P</span>
          </a>

          {/* Separator */}
          <div className="mx-1 h-5 w-px bg-sage/10" />

          {/* Nav links */}
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="relative rounded-full px-4 py-2 text-[13px] font-medium tracking-[0.08em] uppercase text-sage-muted transition-all duration-300 hover:text-sage hover:bg-sage/6"
            >
              {link.label}
            </a>
          ))}

          {/* Separator */}
          <div className="mx-1 h-5 w-px bg-sage/10" />

          {/* Language toggle */}
          <button
            onClick={toggle}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[11px] font-semibold tracking-wider text-sage-muted transition-all duration-300 hover:bg-sage/8 hover:text-sage"
          >
            {lang === "pl" ? "EN" : "PL"}
          </button>
        </div>
      </motion.nav>

      {/* Mobile navbar */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 md:hidden transition-all duration-500 ${
          scrolled
            ? "bg-beige-light/90 backdrop-blur-md shadow-[0_1px_0_rgba(45,58,46,0.08)]"
            : "bg-transparent"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <a
            href="#"
            className="font-serif text-xl tracking-tight text-sage transition-opacity hover:opacity-70"
          >
            Programo
          </a>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="relative z-50 flex h-8 w-8 flex-col items-center justify-center gap-1.5"
            aria-label="Toggle menu"
          >
            <span
              className={`h-[1.5px] w-5 bg-sage transition-all duration-300 ${
                mobileOpen ? "translate-y-[4.5px] rotate-45" : ""
              }`}
            />
            <span
              className={`h-[1.5px] w-5 bg-sage transition-all duration-300 ${
                mobileOpen ? "-translate-y-[1.5px] -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </motion.nav>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-beige-light/98 backdrop-blur-lg md:hidden"
          >
            <nav className="flex flex-col items-center gap-8">
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08, duration: 0.4 }}
                  className="font-serif text-3xl text-sage"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.button
                onClick={() => { toggle(); setMobileOpen(false); }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.08, duration: 0.4 }}
                className="rounded-full border border-sage/20 px-6 py-2 text-sm tracking-wider text-sage"
              >
                {lang === "pl" ? "English" : "Polski"}
              </motion.button>
              <motion.a
                href="mailto:wojciech.plonka@programo.pl"
                onClick={() => setMobileOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: (navLinks.length + 1) * 0.08,
                  duration: 0.4,
                }}
                className="mt-4 rounded-full border border-sage px-8 py-3 text-sm tracking-wide text-sage transition-colors hover:bg-sage hover:text-beige-light"
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
