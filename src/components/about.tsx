"use client";

import { useI18n } from "@/lib/i18n";

export default function About() {
  const { t } = useI18n();

  const introText = t("about.intro");
  const parts = introText.split(/\{w\}|\{b\}/);

  return (
    <section id="about" className="bg-beige px-6 py-32 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-16 md:grid-cols-2 md:gap-20">
          <div>
            <p className="mb-3 text-sm tracking-[0.2em] uppercase text-sage-muted">
              {t("about.label")}
            </p>
            <h2 className="font-serif text-4xl tracking-tight text-sage md:text-5xl">
              {t("about.title1")}
              <br />
              {t("about.title2")}
            </h2>
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-lg leading-relaxed text-sage-light">
              {parts[0]}
              <span className="text-sage font-medium">Wojciech P&#322;onka</span>
              {parts[1]}
              <span className="text-sage font-medium">Bartosz Ko&#322;aj</span>
              {parts[2]}
            </p>
            <p className="mt-6 leading-relaxed text-sage-muted">
              {t("about.p1")}
            </p>
            <p className="mt-6 leading-relaxed text-sage-muted">
              {t("about.p2")}
            </p>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-2 gap-8 border-t border-sage/10 pt-12 md:grid-cols-4">
          {[
            { number: "3+", label: t("about.stat.products") },
            { number: "2", label: t("about.stat.founders") },
            { number: "2026", label: t("about.stat.founded") },
            { number: "Pozna\u0144", label: t("about.stat.location") },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="font-serif text-3xl text-sage md:text-4xl">
                {stat.number}
              </p>
              <p className="mt-1 text-sm text-sage-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
