"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import MagneticWrapper from "@/components/magnetic";

type FormState = "idle" | "submitting" | "success" | "error";

export default function Contact() {
  const { t } = useI18n();
  const [formState, setFormState] = useState<FormState>("idle");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormState("submitting");
    setTimeout(() => setFormState("success"), 2000);
    setTimeout(() => setFormState("idle"), 5000);
  }

  return (
    <section
      id="contact"
      className="relative min-h-screen py-32 md:py-48 lg:py-64 overflow-hidden"
      style={{ backgroundColor: "#0A0808" }}
    >
      {/* Section marker */}
      <motion.span
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="absolute top-8 left-6 md:left-10 font-headline text-xs italic z-10"
        style={{ color: "#C8A44E", letterSpacing: "0.3em" }}
      >
        V
      </motion.span>

      {/* Section divider line at top */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 left-[5%] right-[5%] h-[1px]"
        style={{ backgroundColor: "rgba(200, 164, 78, 0.08)", transformOrigin: "center" }}
      />

      <div className="mx-auto max-w-[2560px] px-6 md:px-24 2xl:px-40">
        <div className="grid grid-cols-1 gap-20 md:gap-32 lg:grid-cols-12">
          {/* Left: Title */}
          <div className="lg:col-span-5">
            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                className="font-headline text-5xl md:text-7xl lg:text-[12vw] font-bold tracking-tighter leading-[0.9]"
                style={{ color: "#E8E0D0" }}
              >
                Get in
              </motion.h2>
            </div>
            <div className="overflow-hidden">
              <motion.h2
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                className="font-headline text-5xl md:text-7xl lg:text-[12vw] font-bold italic tracking-tighter leading-[0.9]"
                style={{ color: "#C8A44E" }}
              >
                Touch.
              </motion.h2>
            </div>

            {/* Email addresses */}
            <div className="mt-16 md:mt-20 flex flex-col gap-6">
              <a
                href="mailto:kontakt@programo.pl"
                className="text-sm md:text-base font-light transition-colors duration-300 hover-underline break-all md:break-normal"
                style={{ color: "#8A8278" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#C8A44E")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#8A8278")}
              >
                kontakt@programo.pl
              </a>
              <a
                href="mailto:wojciech.plonka@programo.pl"
                className="text-sm md:text-base font-light transition-colors duration-300 hover-underline break-all md:break-normal"
                style={{ color: "#8A8278" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#C8A44E")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#8A8278")}
              >
                wojciech.plonka@programo.pl
              </a>
              <a
                href="mailto:bartosz.kolaj@programo.pl"
                className="text-sm md:text-base font-light transition-colors duration-300 hover-underline break-all md:break-normal"
                style={{ color: "#8A8278" }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#C8A44E")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#8A8278")}
              >
                bartosz.kolaj@programo.pl
              </a>
            </div>
          </div>

          {/* Right: Elegant form */}
          <div className="lg:col-span-7 lg:pl-12">
            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-10">
              {/* Name */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="group relative"
              >
                <label
                  className="text-[10px] font-medium uppercase transition-colors duration-300 group-focus-within:text-[#C8A44E]"
                  style={{ color: "#C8A44E", letterSpacing: "0.3em" }}
                >
                  {t("contact.form.name")}
                </label>
                <input
                  type="text"
                  placeholder={t("contact.form.namePlaceholder")}
                  className="mt-3 w-full bg-transparent py-4 font-headline text-xl md:text-2xl font-light tracking-tight outline-none border-b transition-all duration-500 focus:shadow-[0_2px_20px_rgba(200,164,78,0.1)]"
                  style={{
                    color: "#E8E0D0",
                    borderColor: "#1f1a15",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#C8A44E")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#1f1a15")}
                  required
                />
              </motion.div>

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
                className="group relative"
              >
                <label
                  className="text-[10px] font-medium uppercase transition-colors duration-300 group-focus-within:text-[#C8A44E]"
                  style={{ color: "#C8A44E", letterSpacing: "0.3em" }}
                >
                  {t("contact.form.email")}
                </label>
                <input
                  type="email"
                  placeholder={t("contact.form.emailPlaceholder")}
                  className="mt-3 w-full bg-transparent py-4 font-headline text-xl md:text-2xl font-light tracking-tight outline-none border-b transition-all duration-500 focus:shadow-[0_2px_20px_rgba(200,164,78,0.1)]"
                  style={{
                    color: "#E8E0D0",
                    borderColor: "#1f1a15",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#C8A44E")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#1f1a15")}
                  required
                />
              </motion.div>

              {/* Message */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                className="group relative"
              >
                <label
                  className="text-[10px] font-medium uppercase transition-colors duration-300 group-focus-within:text-[#C8A44E]"
                  style={{ color: "#C8A44E", letterSpacing: "0.3em" }}
                >
                  {t("contact.form.message")}
                </label>
                <textarea
                  rows={4}
                  placeholder={t("contact.form.messagePlaceholder")}
                  className="mt-3 w-full bg-transparent py-4 font-headline text-xl md:text-2xl font-light tracking-tight outline-none border-b transition-all duration-500 resize-none focus:shadow-[0_2px_20px_rgba(200,164,78,0.1)]"
                  style={{
                    color: "#E8E0D0",
                    borderColor: "#1f1a15",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "#C8A44E")}
                  onBlur={(e) => (e.currentTarget.style.borderColor = "#1f1a15")}
                  required
                />
              </motion.div>

              {/* Submit — gold outlined circle */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.45 }}
                className="mt-8 flex items-center gap-8"
              >
                <MagneticWrapper strength={0.4}>
                  <button
                    type="submit"
                    disabled={formState === "submitting"}
                    className="group relative flex h-[140px] w-[140px] items-center justify-center rounded-full border-2 font-headline text-lg italic tracking-tight transition-all duration-500 disabled:opacity-50"
                    style={{
                      borderColor: "#C8A44E",
                      color: "#C8A44E",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#C8A44E";
                      e.currentTarget.style.color = "#0A0808";
                      e.currentTarget.style.boxShadow = "0 0 40px rgba(200,164,78,0.2)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = "#C8A44E";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <AnimatePresence mode="wait">
                      {formState === "submitting" ? (
                        <motion.span key="sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          {t("contact.form.submitting")}
                        </motion.span>
                      ) : formState === "success" ? (
                        <motion.span key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          {t("contact.form.submitted")}
                        </motion.span>
                      ) : (
                        <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          {t("contact.form.submit")}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </MagneticWrapper>
              </motion.div>
            </form>
          </div>
        </div>
      </div>

      {/* Decorative horizontal gold line at bottom */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-0 left-[5%] right-[5%] h-[1px]"
        style={{ backgroundColor: "rgba(200, 164, 78, 0.08)", transformOrigin: "center" }}
      />
    </section>
  );
}
