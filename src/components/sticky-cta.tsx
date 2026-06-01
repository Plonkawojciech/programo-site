"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import ContactCtaLink from "@/components/contact-cta-link";

/**
 * Mobile-only sticky CTA bar.
 * - Appears after the user scrolls past the hero.
 * - Hides itself whenever the contact section (#kontakt-main) is on screen,
 *   so it never overlaps the form it points to.
 */
export default function StickyCta() {
  const { t } = useI18n();
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolledPastHero(window.scrollY > window.innerHeight * 0.6);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = document.getElementById("kontakt-main");
    if (!el) {
      setContactVisible(false);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => setContactVisible(entry.isIntersecting),
      { rootMargin: "0px 0px -20% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  });

  const show = scrolledPastHero && !contactVisible;

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="md:hidden fixed inset-x-0 bottom-0 z-[var(--z-sticky)] px-4 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-3 bg-gradient-to-t from-surface via-surface/95 to-transparent"
        >
          <ContactCtaLink className="flex w-full items-center justify-center gap-3 rounded-full bg-primary px-6 py-4 text-sm font-medium uppercase tracking-widest text-on-primary shadow-lg shadow-black/20 active:scale-[0.98] transition-transform">
            {t("sticky.cta")} <span aria-hidden="true">→</span>
          </ContactCtaLink>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
