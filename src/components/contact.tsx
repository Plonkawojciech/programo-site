"use client";

import { useI18n } from "@/lib/i18n";
import ContactForm from "@/components/contact-form";

const contactCards = [
  {
    label: { pl: "Biuro", en: "Office" },
    value: "biuro@programo.pl",
    href: "mailto:biuro@programo.pl",
    detail: { pl: "najlepszy adres na nowe projekty", en: "best address for new projects" },
  },
  {
    label: "Wojciech",
    value: "wojciech.plonka@programo.pl",
    href: "mailto:wojciech.plonka@programo.pl",
    detail: "+48 797 222 363",
    phoneHref: "tel:+48797222363",
  },
  {
    label: "Bartosz",
    value: "bartosz.kolaj@programo.pl",
    href: "mailto:bartosz.kolaj@programo.pl",
    detail: "+48 509 123 434",
    phoneHref: "tel:+48509123434",
  },
];

export default function Contact() {
  const { t, lang } = useI18n();

  return (
    <section
      id="contact"
      className="relative overflow-hidden border-t border-[#d8d2c8] bg-[#f7f4ed] px-6 py-20 text-[#161616] md:px-10 md:py-28"
    >
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-normal text-[#65706b]">
            {t("contact.label")}
          </p>
          <h2 className="mt-5 max-w-2xl font-headline text-4xl font-semibold leading-tight tracking-normal md:text-6xl">
            {lang === "pl" ? "Porozmawiajmy o projekcie." : "Let's talk about the project."}
          </h2>
          <p className="mt-6 max-w-xl text-base leading-8 text-[#4f5855] md:text-lg">
            {lang === "pl"
              ? "Napisz, co chcesz zbudować. Oddzwonimy albo odpiszemy z konkretnymi pytaniami, widełkami i najlepszą ścieżką startu."
              : "Tell us what you want to build. We will reply with concrete questions, pricing context, and the best starting path."}
          </p>

          <div className="mt-10 grid gap-3 text-sm text-[#303734]">
            {contactCards.map((card) => (
              <div
                key={card.value}
                className="rounded-[8px] border border-[#d8d2c8] bg-white/55 p-4 transition hover:border-[#082f2b] hover:bg-white/75"
              >
                <span className="block text-xs font-semibold uppercase tracking-normal text-[#65706b]">
                  {typeof card.label === "string" ? card.label : card.label[lang]}
                </span>
                <a href={card.href} className="mt-2 block break-all font-semibold text-[#082f2b]">
                  {card.value}
                </a>
                {card.phoneHref ? (
                  <a href={card.phoneHref} className="mt-1 inline-block text-[#4f5855] hover:text-[#082f2b]">
                    {card.detail}
                  </a>
                ) : (
                  <span className="mt-1 block text-[#4f5855]">
                    {typeof card.detail === "string" ? card.detail : card.detail[lang]}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="border border-[#d8d2c8] bg-white/60 p-5 shadow-[0_24px_80px_rgba(15,23,42,0.08)] md:p-8">
          <ContactForm source="main-contact" />
        </div>
      </div>
    </section>
  );
}
