"use client";

import { motion } from "framer-motion";

export default function About() {
  return (
    <section id="about" className="bg-beige px-6 py-32 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-16 md:grid-cols-2 md:gap-20">
          {/* Left column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <p className="mb-3 text-sm tracking-[0.2em] uppercase text-sage-muted">
              Who We Are
            </p>
            <h2 className="font-serif text-4xl tracking-tight text-sage md:text-5xl">
              Two builders,
              <br />
              one studio.
            </h2>
          </motion.div>

          {/* Right column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.15,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="flex flex-col justify-center"
          >
            <p className="text-lg leading-relaxed text-sage-light">
              Programo is a software studio founded by{" "}
              <span className="text-sage font-medium">Wojciech P&#322;onka</span>{" "}
              and{" "}
              <span className="text-sage font-medium">Bartosz Ko&#322;aj</span>{" "}
              in Pozna&#324;, Poland.
            </p>
            <p className="mt-6 leading-relaxed text-sage-muted">
              We build complete software products &mdash; from early-stage prototypes
              to production-ready SaaS platforms. Our focus is on shipping
              thoughtfully crafted tools that businesses actually need, not just
              technically impressive demos.
            </p>
            <p className="mt-6 leading-relaxed text-sage-muted">
              Every project we take on gets our full attention. We handle
              architecture, design, development, and deployment. No layers of
              management, no handoffs &mdash; just two engineers who care deeply
              about the work.
            </p>
          </motion.div>
        </div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-20 grid grid-cols-2 gap-8 border-t border-sage/10 pt-12 md:grid-cols-4"
        >
          {[
            { number: "3+", label: "Products Shipped" },
            { number: "2", label: "Founders" },
            { number: "2025", label: "Founded" },
            { number: "Pozna\u0144", label: "Based In" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-serif text-3xl text-sage md:text-4xl">
                {stat.number}
              </p>
              <p className="mt-1 text-sm text-sage-muted">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
