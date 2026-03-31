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
      className="relative min-h-screen bg-dark py-32 md:py-48 lg:py-64 overflow-hidden"
    >
      {/* Section number */}
      <span className="absolute top-8 left-8 text-[11px] font-medium tracking-[0.2em] text-coral z-20">
        05
      </span>

      {/* Background gradient blob */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="orb-coral absolute bottom-[20%] left-[30%] w-[600px] h-[600px] rounded-full opacity-[0.04]"
          style={{
            background: "radial-gradient(circle, #FF3D00 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="mx-auto max-w-[2560px] px-6 md:px-24 2xl:px-40 relative z-10">
        <div className="grid grid-cols-1 gap-20 md:gap-32 lg:grid-cols-12">
          {/* Left: Massive typography */}
          <div className="lg:col-span-5">
            <div className="overflow-hidden">
              <motion.div
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              >
                <h2 className="font-headline text-[15vw] md:text-[12vw] lg:text-[10vw] font-bold leading-[0.9] tracking-tighter text-text">
                  LET&apos;S
                </h2>
              </motion.div>
            </div>
            <div className="overflow-hidden">
              <motion.div
                initial={{ y: "100%" }}
                whileInView={{ y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 1,
                  ease: [0.16, 1, 0.3, 1],
                  delay: 0.1,
                }}
              >
                <h2 className="font-headline text-[15vw] md:text-[12vw] lg:text-[10vw] font-bold italic leading-[0.9] tracking-tighter text-text">
                  TALK<span className="text-coral">.</span>
                </h2>
              </motion.div>
            </div>

            {/* Emails */}
            <div className="mt-16 md:mt-24 flex flex-col gap-8">
              <div className="group cursor-pointer">
                <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">
                  Email us
                </span>
                <a
                  href="mailto:kontakt@programo.pl"
                  className="mt-2 block font-headline text-lg md:text-xl font-medium tracking-tight text-text transition-colors group-hover:text-coral break-all md:break-normal"
                >
                  kontakt@programo.pl
                </a>
              </div>

              <div className="flex flex-col md:flex-row gap-8 md:gap-16">
                <div className="group cursor-pointer">
                  <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">
                    Wojciech
                  </span>
                  <a
                    href="mailto:wojciech.plonka@programo.pl"
                    className="mt-2 block text-sm font-light text-text-muted transition-colors group-hover:text-coral break-all md:break-normal"
                  >
                    wojciech.plonka@programo.pl
                  </a>
                </div>
                <div className="group cursor-pointer">
                  <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted">
                    Bartosz
                  </span>
                  <a
                    href="mailto:bartosz.kolaj@programo.pl"
                    className="mt-2 block text-sm font-light text-text-muted transition-colors group-hover:text-coral break-all md:break-normal"
                  >
                    bartosz.kolaj@programo.pl
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-16 md:mt-24">
              <p className="max-w-xs text-xs font-light leading-relaxed text-text-muted">
                Located in Pozna\u0144, Poland.
                <br />
                Working worldwide.
                <br />
                &copy; 2026 Programo Studio.
              </p>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-7 lg:pl-20">
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="flex flex-col gap-12"
            >
              {[
                {
                  num: "01",
                  label: "Your name",
                  type: "text",
                  placeholder: "John Doe *",
                },
                {
                  num: "02",
                  label: "Your email",
                  type: "email",
                  placeholder: "john@example.com *",
                },
              ].map((field, i) => (
                <motion.div
                  key={field.num}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: i * 0.2,
                    duration: 0.8,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="group relative"
                >
                  <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted transition-colors group-focus-within:text-coral">
                    {field.num}. {field.label}
                  </label>
                  <input
                    type={field.type}
                    placeholder={field.placeholder}
                    className="mt-4 w-full bg-transparent py-4 font-headline text-xl md:text-2xl font-light tracking-tight text-text outline-none border-b border-white/10 focus:border-coral transition-colors placeholder:text-text-muted/30"
                    required
                  />
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.4,
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative"
              >
                <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-text-muted transition-colors group-focus-within:text-coral">
                  03. Tell us about your project
                </label>
                <textarea
                  rows={4}
                  placeholder="Hello, I'm looking for... *"
                  className="mt-4 w-full bg-transparent py-4 font-headline text-xl md:text-2xl font-light tracking-tight text-text outline-none border-b border-white/10 focus:border-coral transition-colors resize-none placeholder:text-text-muted/30"
                  required
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: 0.6,
                  duration: 0.8,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="mt-8 flex items-center gap-12"
              >
                <MagneticWrapper strength={0.4}>
                  <button
                    type="submit"
                    disabled={formState === "submitting"}
                    className="group relative flex h-36 w-36 md:h-40 md:w-40 items-center justify-center rounded-full border-2 border-coral text-sm font-bold uppercase tracking-widest text-coral transition-all duration-500 hover:bg-coral hover:text-dark active:scale-95 disabled:opacity-50"
                  >
                    <AnimatePresence mode="wait">
                      {formState === "submitting" ? (
                        <motion.span
                          key="sub"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          Sending...
                        </motion.span>
                      ) : formState === "success" ? (
                        <motion.span
                          key="success"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          Sent!
                        </motion.span>
                      ) : (
                        <motion.span
                          key="idle"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          SEND
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </MagneticWrapper>

                <p className="max-w-[200px] text-[10px] font-medium uppercase tracking-[0.15em] text-text-muted">
                  By clicking send you agree to our privacy policy.
                </p>
              </motion.div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
