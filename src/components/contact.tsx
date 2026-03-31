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
      className="relative min-h-screen overflow-hidden bg-[#0A0A0A] py-32 md:py-48 lg:py-64"
    >
      <div className="mx-auto max-w-[2560px] px-6 md:px-16 lg:px-24 2xl:px-40">
        <div className="grid grid-cols-1 gap-20 md:gap-32 lg:grid-cols-2">
          {/* Left: massive typography */}
          <div className="flex flex-col justify-between">
            <div>
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="mb-8 block text-[11px] font-bold uppercase tracking-[0.5em] text-primary"
              >
                {t("contact.label")}
              </motion.span>

              <div className="overflow-hidden">
                <motion.h2
                  initial={{ y: "100%" }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="font-headline text-[15vw] font-bold leading-[0.9] tracking-tighter text-[#F0F0EC] md:text-[12vw] lg:text-[10vw]"
                >
                  LET&apos;S
                </motion.h2>
              </div>
              <div className="overflow-hidden">
                <motion.h2
                  initial={{ y: "100%" }}
                  whileInView={{ y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                  className="font-headline text-[15vw] font-bold italic leading-[0.9] tracking-tighter text-[#F0F0EC] md:text-[12vw] lg:text-[10vw]"
                >
                  TALK<span className="text-primary">.</span>
                </motion.h2>
              </div>
            </div>

            {/* Email addresses */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-16 flex flex-col gap-6 md:mt-24"
            >
              <a
                href="mailto:kontakt@programo.pl"
                className="font-headline text-xl font-light italic tracking-tight text-[#F0F0EC]/70 transition-colors hover:text-primary md:text-2xl"
              >
                kontakt@programo.pl
              </a>
              <div className="flex flex-col gap-3 md:flex-row md:gap-12">
                <a
                  href="mailto:wojciech.plonka@programo.pl"
                  className="text-sm font-light text-[#F0F0EC]/40 transition-colors hover:text-primary"
                >
                  wojciech.plonka@programo.pl
                </a>
                <a
                  href="mailto:bartosz.kolaj@programo.pl"
                  className="text-sm font-light text-[#F0F0EC]/40 transition-colors hover:text-primary"
                >
                  bartosz.kolaj@programo.pl
                </a>
              </div>
            </motion.div>
          </div>

          {/* Right: minimal form */}
          <div className="flex items-center">
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="flex w-full flex-col gap-12"
            >
              <div className="group relative">
                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#F0F0EC]/40 transition-colors group-focus-within:text-primary">
                  {t("contact.form.name")}
                </label>
                <input
                  type="text"
                  placeholder={t("contact.form.namePlaceholder")}
                  className="mt-4 w-full border-b border-[#F0F0EC]/20 bg-transparent py-4 font-headline text-xl font-light italic tracking-tight text-[#F0F0EC] outline-none transition-colors placeholder:text-[#F0F0EC]/15 focus:border-primary md:text-2xl"
                  required
                />
              </div>

              <div className="group relative">
                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#F0F0EC]/40 transition-colors group-focus-within:text-primary">
                  {t("contact.form.email")}
                </label>
                <input
                  type="email"
                  placeholder={t("contact.form.emailPlaceholder")}
                  className="mt-4 w-full border-b border-[#F0F0EC]/20 bg-transparent py-4 font-headline text-xl font-light italic tracking-tight text-[#F0F0EC] outline-none transition-colors placeholder:text-[#F0F0EC]/15 focus:border-primary md:text-2xl"
                  required
                />
              </div>

              <div className="group relative">
                <label className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#F0F0EC]/40 transition-colors group-focus-within:text-primary">
                  {t("contact.form.message")}
                </label>
                <textarea
                  rows={3}
                  placeholder={t("contact.form.messagePlaceholder")}
                  className="mt-4 w-full resize-none border-b border-[#F0F0EC]/20 bg-transparent py-4 font-headline text-xl font-light italic tracking-tight text-[#F0F0EC] outline-none transition-colors placeholder:text-[#F0F0EC]/15 focus:border-primary md:text-2xl"
                  required
                />
              </div>

              <div className="mt-8 flex items-center gap-8">
                <MagneticWrapper strength={0.4}>
                  <button
                    type="submit"
                    disabled={formState === "submitting"}
                    className="group relative flex h-32 w-32 items-center justify-center rounded-full border border-primary text-[11px] font-bold uppercase tracking-[0.3em] text-primary transition-all hover:bg-primary hover:text-white active:scale-95 disabled:opacity-50 md:h-36 md:w-36"
                  >
                    <AnimatePresence mode="wait">
                      {formState === "submitting" ? (
                        <motion.span
                          key="sub"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          {t("contact.form.submitting")}
                        </motion.span>
                      ) : formState === "success" ? (
                        <motion.span
                          key="success"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          {t("contact.form.submitted")}
                        </motion.span>
                      ) : (
                        <motion.span
                          key="idle"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          {t("contact.form.submit")}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </MagneticWrapper>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
