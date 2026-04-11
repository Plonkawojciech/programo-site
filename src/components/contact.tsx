"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useI18n } from "@/lib/i18n";


type FormState = "idle" | "submitting" | "success" | "error";

export default function Contact() {
  const { t } = useI18n();
  const [formState, setFormState] = useState<FormState>("idle");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormState("submitting");
    // Simulate submit for visual polish
    setTimeout(() => setFormState("success"), 2000);
    setTimeout(() => setFormState("idle"), 5000);
  }

  return (
    <section id="contact" className="relative min-h-screen bg-surface py-24 md:py-32 lg:py-56 border-t border-outline-variant/20 overflow-hidden">
      <div className="mx-auto max-w-[2560px] px-6 md:px-24 2xl:px-40">
        <div className="grid grid-cols-1 gap-20 md:gap-32 lg:grid-cols-12">
          
          {/* Left: Info */}
          <div className="lg:col-span-5">
            <motion.span
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-[10px] md:text-xs 2xl:text-sm font-bold uppercase tracking-[0.5em] text-primary"
            >
              {t("contact.label")}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-6 md:mt-8 font-headline text-5xl font-bold tracking-tighter text-on-surface md:text-8xl 2xl:text-[8vw]"
            >
              Let&apos;s <br /> <span className="italic text-primary">Connect.</span>
            </motion.h2>
            
            <div className="mt-16 md:mt-20 flex flex-col gap-8 md:gap-12 2xl:gap-16">
              <div className="group cursor-pointer">
                <span className="text-[10px] 2xl:text-xs font-bold uppercase tracking-widest text-on-surface-variant">Email us</span>
                <a href="mailto:kontakt@programo.pl" className="mt-2 md:mt-4 block font-headline text-xl md:text-2xl 2xl:text-5xl font-medium tracking-tight text-on-surface transition-colors group-hover:text-primary break-all md:break-normal">
                  kontakt@programo.pl
                </a>
              </div>
              
              <div className="flex flex-col md:flex-row gap-8 md:gap-20 2xl:gap-32">
                <div className="group cursor-pointer">
                  <span className="text-[10px] 2xl:text-xs font-bold uppercase tracking-widest text-on-surface-variant">Wojciech</span>
                  <a href="mailto:wojciech.plonka@programo.pl" className="mt-2 block text-sm 2xl:text-lg font-light text-on-surface-variant transition-colors group-hover:text-primary break-all md:break-normal">
                    wojciech.plonka@programo.pl
                  </a>
                </div>
                <div className="group cursor-pointer">
                  <span className="text-[10px] 2xl:text-xs font-bold uppercase tracking-widest text-on-surface-variant">Bartosz</span>
                  <a href="mailto:bartosz.kolaj@programo.pl" className="mt-2 block text-sm 2xl:text-lg font-light text-on-surface-variant transition-colors group-hover:text-primary break-all md:break-normal">
                    bartosz.kolaj@programo.pl
                  </a>
                </div>
              </div>
            </div>

            <div className="mt-20 md:mt-32 2xl:mt-48">
              <p className="max-w-[250px] md:max-w-xs 2xl:max-w-md text-xs md:text-sm 2xl:text-base font-light leading-relaxed text-on-surface-variant">
                Located in Poznań, Poland. <br /> 
                Working worldwide. <br />
                © 2026 Programo Studio.
              </p>
            </div>
          </div>

          {/* Right: Form */}
          <div className="lg:col-span-7 lg:pl-20">
            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-12">
              <div className="group relative">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant transition-colors group-focus-within:text-primary">
                  01. What&apos;s your name?
                </label>
                <input
                  type="text"
                  placeholder="John Doe *"
                  className="mt-4 w-full bg-transparent py-4 font-headline text-2xl font-light tracking-tight text-on-surface outline-none border-b border-on-surface/10 focus:border-primary transition-colors md:text-4xl"
                  required
                />
              </div>

              <div className="group relative">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant transition-colors group-focus-within:text-primary">
                  02. What&apos;s your email?
                </label>
                <input
                  type="email"
                  placeholder="john@example.com *"
                  className="mt-4 w-full bg-transparent py-4 font-headline text-2xl font-light tracking-tight text-on-surface outline-none border-b border-on-surface/10 focus:border-primary transition-colors md:text-4xl"
                  required
                />
              </div>

              <div className="group relative">
                <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant transition-colors group-focus-within:text-primary">
                  03. Tell us about your project
                </label>
                <textarea
                  rows={4}
                  placeholder="Hello, I'm looking for... *"
                  className="mt-4 w-full bg-transparent py-4 font-headline text-2xl font-light tracking-tight text-on-surface outline-none border-b border-on-surface/10 focus:border-primary transition-colors md:text-4xl resize-none"
                  required
                />
              </div>

              <div className="mt-12 flex items-center gap-12">
                <div>
                  <button
                    type="submit"
                    disabled={formState === "submitting"}
                    className="group relative flex h-40 w-40 items-center justify-center rounded-full bg-primary text-sm font-bold uppercase tracking-widest text-on-primary transition-transform hover:scale-110 active:scale-95 disabled:opacity-50"
                  >
                    <AnimatePresence mode="wait">
                      {formState === "submitting" ? (
                        <motion.span key="sub" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          Sending...
                        </motion.span>
                      ) : formState === "success" ? (
                        <motion.span key="success" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          Sent!
                        </motion.span>
                      ) : (
                        <motion.span key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                          Send it
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </button>
                </div>
                
                <p className="max-w-[200px] text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
                  By clicking send you agree to our privacy policy.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

    </section>
  );
}
