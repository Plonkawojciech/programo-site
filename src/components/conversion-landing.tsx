"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import ContactForm from "@/components/contact-form";

const services = [
  {
    title: { pl: "Aplikacje webowe", en: "Web apps" },
    desc: {
      pl: "Panele, platformy, CRM-y, marketplace'y i narzędzia operacyjne dla firm.",
      en: "Dashboards, platforms, CRMs, marketplaces, and operational tools for companies.",
    },
  },
  {
    title: { pl: "Systemy SaaS", en: "SaaS systems" },
    desc: {
      pl: "Logowanie, role, płatności, multi-tenant, automatyzacje i gotowość do skalowania.",
      en: "Auth, roles, payments, multi-tenant architecture, automation, and scaling readiness.",
    },
  },
  {
    title: { pl: "Mobile i PWA", en: "Mobile and PWA" },
    desc: {
      pl: "Aplikacje instalowane na telefonie, wspólny kod web/mobile, szybkie MVP.",
      en: "Installable mobile apps, shared web/mobile code, and fast MVP delivery.",
    },
  },
  {
    title: { pl: "AI i integracje", en: "AI and integrations" },
    desc: {
      pl: "LLM, RAG, OCR, agenci, API i automatyzacje procesów, które faktycznie oszczędzają czas.",
      en: "LLMs, RAG, OCR, agents, APIs, and process automation that actually saves time.",
    },
  },
];

const pricing = [
  {
    name: { pl: "Strona firmowa", en: "Company website" },
    price: { pl: "podamy wkrótce", en: "coming soon" },
    desc: {
      pl: "Oferta, formularz, SEO lokalne, szybkie wdrożenie i panel treści, jeśli jest potrzebny.",
      en: "Offer page, contact form, local SEO, fast deployment, and CMS if needed.",
    },
  },
  {
    name: { pl: "MVP aplikacji", en: "App MVP" },
    price: { pl: "podamy wkrótce", en: "coming soon" },
    desc: {
      pl: "Pierwsza wersja produktu: UX, frontend, backend, baza, hosting i analityka.",
      en: "First product version: UX, frontend, backend, database, hosting, and analytics.",
    },
    featured: true,
  },
  {
    name: { pl: "System SaaS", en: "SaaS system" },
    price: { pl: "podamy wkrótce", en: "coming soon" },
    desc: {
      pl: "Rozbudowany produkt z rolami, płatnościami, integracjami, AI i utrzymaniem.",
      en: "A larger product with roles, payments, integrations, AI, and maintenance.",
    },
  },
];

const process = [
  {
    step: "01",
    title: { pl: "Krótka rozmowa", en: "Short call" },
    desc: { pl: "Ustalamy cel, ryzyko, budżet i pierwszą wersję zakresu.", en: "We define the goal, risk, budget, and first scope." },
  },
  {
    step: "02",
    title: { pl: "Makieta i wycena", en: "Prototype and quote" },
    desc: { pl: "Dostajesz konkretny plan, etapy, widełki i priorytety.", en: "You get a concrete plan, stages, ranges, and priorities." },
  },
  {
    step: "03",
    title: { pl: "Budowa i wdrożenie", en: "Build and launch" },
    desc: { pl: "Projektujemy, kodujemy, testujemy i wypuszczamy produkcyjnie.", en: "We design, code, test, and ship to production." },
  },
];

const proof = [
  { value: "02", label: { pl: "założycieli przy projekcie", en: "founders on the project" } },
  { value: "04+", label: { pl: "produktów w portfolio", en: "products in portfolio" } },
  { value: "24h", label: { pl: "czas pierwszej odpowiedzi", en: "first reply target" } },
];

const cases = [
  {
    title: "Estalo",
    image: "/screenshots/estalo-hero.png",
    href: "/projects/estalo",
    copy: { pl: "CRM SaaS dla nieruchomości z AI, rolami i integracjami.", en: "Real estate SaaS CRM with AI, roles, and integrations." },
  },
  {
    title: "Baulx",
    image: "/screenshots/baulx-hero.png",
    href: "/projects/baulx",
    copy: { pl: "Platforma CNC i 3D dla prefabrykacji drewnianej.", en: "CNC and 3D platform for timber prefabrication." },
  },
  {
    title: "Athlix",
    image: "/screenshots/athlix-trainpilot-1.png",
    href: "/projects/athlix",
    copy: { pl: "Ekosystem treningowy z mobile, AI i integracjami sportowymi.", en: "Training ecosystem with mobile, AI, and sport integrations." },
  },
];

const contactChannels = [
  {
    label: { pl: "Biuro", en: "Office" },
    value: "biuro@programo.pl",
    href: "mailto:biuro@programo.pl",
    note: { pl: "główna skrzynka", en: "main inbox" },
  },
  {
    label: "Wojciech",
    value: "wojciech.plonka@programo.pl",
    href: "mailto:wojciech.plonka@programo.pl",
    phone: "+48 797 222 363",
    phoneHref: "tel:+48797222363",
    note: { pl: "produkt i design", en: "product and design" },
  },
  {
    label: "Bartosz",
    value: "bartosz.kolaj@programo.pl",
    href: "mailto:bartosz.kolaj@programo.pl",
    phone: "+48 509 123 434",
    phoneHref: "tel:+48509123434",
    note: { pl: "engineering", en: "engineering" },
  },
];

const studioTicker = [
  "PRODUCT DESIGN",
  "NEXT.JS",
  "AI SYSTEMS",
  "SAAS",
  "MOBILE",
  "AUTOMATIONS",
  "PROGRAMO",
  "SOFTWARE ENGINEERING",
];

export default function ConversionLanding() {
  const { lang } = useI18n();

  return (
    <div className="bg-[#f7f4ed] text-[#161616]">
      <section className="relative min-h-screen overflow-hidden px-6 pb-16 pt-28 md:px-10 md:pb-20 md:pt-36">
        <div
          aria-hidden
          className="absolute left-6 right-6 top-24 hidden h-px origin-center animate-[soft-line_1.1s_cubic-bezier(0.16,1,0.3,1)_both] bg-gradient-to-r from-transparent via-[#082f2b]/20 to-transparent md:block"
        />
        <div
          aria-hidden
          className="absolute -right-24 top-40 hidden h-[34rem] w-[34rem] rounded-full border border-[#082f2b]/[0.045] md:block"
        />
        <div
          aria-hidden
          className="absolute -right-10 top-72 hidden h-[22rem] w-[22rem] animate-[slow-orbit_18s_linear_infinite] rounded-full border border-[#082f2b]/[0.07] md:block"
        />
        <div
          aria-hidden
          className="absolute left-0 top-28 flex w-max max-w-max animate-slide-right whitespace-nowrap text-[12vw] font-semibold uppercase leading-none tracking-normal text-[#082f2b]/[0.028] md:text-[7vw]"
        >
          {[...studioTicker, ...studioTicker].map((item, index) => (
            <span key={`${item}-${index}`} className="mx-6">
              {item}
            </span>
          ))}
        </div>

        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.02fr_0.78fr] lg:items-center xl:grid-cols-[1.08fr_0.78fr]">
          <div className="relative z-10 min-w-0 max-w-[calc(100vw-3rem)] animate-[soft-lift_0.7s_cubic-bezier(0.16,1,0.3,1)_both] md:max-w-none">
            <div className="flex max-w-2xl items-center gap-3 text-xs font-semibold uppercase tracking-normal text-[#69746f]">
              <span>Software house z Poznania</span>
              <span className="h-px flex-1 bg-[#082f2b]/10" />
              <span className="hidden text-[#082f2b] sm:inline">design + code + AI</span>
            </div>
            <h1 className="mt-5 max-w-[calc(100vw-3rem)] font-headline text-[2.55rem] font-semibold leading-tight tracking-normal sm:text-5xl md:max-w-5xl md:text-7xl lg:text-7xl xl:text-8xl">
              {lang === "pl" ? (
                <>
                  <span className="block md:inline">Budujemy strony,</span>{" "}
                  <span className="block md:inline">aplikacje i systemy,</span>{" "}
                  <span className="block md:inline">które sprzedają.</span>
                </>
              ) : (
                <>
                  <span className="block md:inline">We build websites,</span>{" "}
                  <span className="block md:inline">apps, and systems</span>{" "}
                  <span className="block md:inline">that sell.</span>
                </>
              )}
            </h1>
            <p className="mt-7 max-w-[21rem] text-base leading-8 text-[#4f5855] md:max-w-2xl md:text-xl md:leading-9">
              {lang === "pl"
                ? "Programo łączy produktowy design, full-stack development i AI. Najpierw robimy prostą ścieżkę do kontaktu i wyceny, potem pokazujemy pełnię naszych możliwości."
                : "Programo combines product design, full-stack development, and AI. First we make the path to contact and pricing simple, then we show the full range of our craft."}
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="#quick-contact"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#082f2b] px-8 py-3 text-sm font-semibold text-white shadow-[0_14px_34px_rgba(8,47,43,0.18)] transition hover:-translate-y-0.5 hover:bg-[#12463f] hover:shadow-[0_18px_40px_rgba(8,47,43,0.22)]"
              >
                {lang === "pl" ? "Wyceń projekt" : "Get a quote"}
              </a>
              <a
                href="#work"
                className="inline-flex min-h-12 items-center text-sm font-semibold text-[#082f2b] underline decoration-[#082f2b]/25 underline-offset-8 transition hover:decoration-[#082f2b]"
              >
                {lang === "pl" ? "Zobacz realizacje" : "See the work"}
              </a>
            </div>

            <div className="mt-8 flex max-w-2xl flex-wrap items-center gap-x-3 gap-y-2 text-sm leading-7 text-[#65706b]">
              <span className="font-semibold text-[#082f2b]">2 min</span>
              <span className="text-[#082f2b]/25">/</span>
              <span>{lang === "pl" ? "formularz startowy" : "starter form"}</span>
              <span className="text-[#082f2b]/25">/</span>
              <span>{lang === "pl" ? "cennik podamy wkrótce" : "pricing coming soon"}</span>
              <span className="text-[#082f2b]/25">/</span>
              <span>MVP, SaaS, AI</span>
            </div>

            <div className="mt-12 flex max-w-2xl flex-wrap gap-x-8 gap-y-5 border-l border-[#082f2b]/10 pl-5">
              {proof.map((item) => (
                <div
                  key={item.value}
                  className="min-w-28"
                >
                  <strong className="block text-2xl font-semibold text-[#082f2b]">{item.value}</strong>
                  <span className="mt-1 block max-w-32 text-xs leading-5 text-[#65706b]">{item.label[lang]}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            id="quick-contact"
            className="relative z-10 min-w-0 max-w-[calc(100vw-3rem)] animate-[soft-lift_0.75s_0.08s_cubic-bezier(0.16,1,0.3,1)_both] rounded-[8px] bg-white/78 p-5 shadow-[0_35px_120px_rgba(15,23,42,0.12)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 md:max-w-none md:p-7"
          >
            <div className="mb-5 flex items-start justify-between gap-5">
              <div>
                <p className="text-xs font-semibold uppercase tracking-normal text-[#65706b]">
                  {lang === "pl" ? "Szybki kontakt" : "Quick contact"}
                </p>
                <h2 className="mt-2 font-headline text-2xl font-semibold tracking-normal md:text-3xl">
                  {lang === "pl" ? "Opisz projekt w 2 minuty." : "Describe the project in 2 minutes."}
                </h2>
              </div>
              <a href="mailto:biuro@programo.pl" className="hidden shrink-0 text-xs font-semibold text-[#082f2b] underline underline-offset-4 md:inline-flex">
                biuro@programo.pl
              </a>
            </div>

            <div className="mb-6 border-y border-[#082f2b]/10 py-4 text-sm">
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {contactChannels.map((channel) => (
                  <a
                    key={channel.value}
                    href={channel.href}
                    className="font-semibold text-[#082f2b] underline decoration-transparent underline-offset-4 transition hover:decoration-[#082f2b]/35"
                  >
                    {typeof channel.label === "string" ? channel.label : channel.label[lang]}
                  </a>
                ))}
              </div>
              <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#606966]">
                <a href="tel:+48797222363" className="hover:text-[#082f2b]">
                  +48 797 222 363
                </a>
                <a href="tel:+48509123434" className="hover:text-[#082f2b]">
                  +48 509 123 434
                </a>
                <span>biuro@programo.pl</span>
              </div>
            </div>
            <ContactForm compact source="hero" />
          </div>
        </div>
      </section>

      <section id="services" className="px-6 py-20 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-normal text-[#65706b]">
                {lang === "pl" ? "Oferta" : "Services"}
              </p>
              <h2 className="mt-4 max-w-3xl font-headline text-4xl font-semibold leading-tight tracking-normal md:text-6xl">
                {lang === "pl" ? "Prosto nazwane rzeczy, które robimy." : "Plainly named things we build."}
              </h2>
            </div>
            <a href="#quick-contact" className="text-sm font-semibold text-[#082f2b] underline underline-offset-4">
              {lang === "pl" ? "Umów rozmowę" : "Book a conversation"}
            </a>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {services.map((service) => (
              <article
                key={service.title.pl}
                className="min-h-56 rounded-[8px] bg-white/54 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.045)] transition duration-200 hover:-translate-y-1 hover:bg-white"
              >
                <h3 className="font-headline text-2xl font-semibold tracking-normal">{service.title[lang]}</h3>
                <p className="mt-5 text-sm leading-7 text-[#59625e]">{service.desc[lang]}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="px-6 py-20 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-normal text-[#65706b]">
                {lang === "pl" ? "Cennik" : "Pricing"}
              </p>
              <h2 className="mt-4 font-headline text-4xl font-semibold leading-tight tracking-normal md:text-6xl">
                {lang === "pl" ? "Cennik podamy wkrótce." : "Pricing is coming soon."}
              </h2>
              <p className="mt-6 max-w-xl text-base leading-8 text-[#59625e]">
                {lang === "pl"
                  ? "Pracujemy nad prostym, czytelnym cennikiem. Na razie dobieramy zakres indywidualnie po krótkiej rozmowie i od razu mówimy, co ma największy sens biznesowy."
                  : "We are preparing simple, clear pricing. For now, we scope each project individually after a short call and explain what makes the most business sense."}
              </p>
            </div>

            <div className="grid gap-4">
              {pricing.map((item) => (
                <article
                  key={item.name.pl}
                  className={`grid gap-5 rounded-[8px] p-5 shadow-[0_18px_60px_rgba(15,23,42,0.05)] transition duration-200 hover:-translate-y-1 md:grid-cols-[0.75fr_1fr] md:items-center ${
                    item.featured
                      ? "bg-[#082f2b] text-white"
                      : "bg-white/58"
                  }`}
                >
                  <div>
                    <h3 className="font-headline text-3xl font-semibold tracking-normal">{item.name[lang]}</h3>
                    <p className={`mt-3 text-base font-semibold uppercase tracking-normal ${item.featured ? "text-[#d5f4df]" : "text-[#082f2b]"}`}>
                      {item.price[lang]}
                    </p>
                  </div>
                  <div>
                    <p className={`text-sm leading-7 ${item.featured ? "text-white/78" : "text-[#59625e]"}`}>
                      {item.desc[lang]}
                    </p>
                    <a
                      href="#quick-contact"
                      className={`mt-5 inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold transition ${
                        item.featured
                          ? "bg-white text-[#082f2b] hover:bg-[#d5f4df]"
                          : "bg-[#082f2b]/7 text-[#082f2b] hover:bg-[#082f2b]/12"
                      }`}
                    >
                      {lang === "pl" ? "Zapytaj o szczegóły" : "Ask for details"}
                    </a>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-normal text-[#65706b]">
                {lang === "pl" ? "Proces" : "Process"}
              </p>
              <h2 className="mt-4 font-headline text-4xl font-semibold leading-tight tracking-normal md:text-6xl">
                {lang === "pl" ? "Mało chaosu. Dużo dowożenia." : "Less chaos. More shipping."}
              </h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {process.map((item) => (
                <article
                  key={item.step}
                  className="rounded-[8px] bg-white/54 p-6 shadow-[0_18px_60px_rgba(15,23,42,0.045)] transition duration-200 hover:-translate-y-1"
                >
                  <span className="text-xs font-semibold text-[#65706b]">{item.step}</span>
                  <h3 className="mt-6 font-headline text-2xl font-semibold tracking-normal">{item.title[lang]}</h3>
                  <p className="mt-4 text-sm leading-7 text-[#59625e]">{item.desc[lang]}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-normal text-[#65706b]">
                {lang === "pl" ? "Dowody" : "Proof"}
              </p>
              <h2 className="mt-4 max-w-3xl font-headline text-4xl font-semibold leading-tight tracking-normal md:text-6xl">
                {lang === "pl" ? "Najpierw konkrety, potem pełne portfolio." : "Concrete proof first, full portfolio next."}
              </h2>
            </div>
            <a href="#work" className="text-sm font-semibold text-[#082f2b] underline underline-offset-4">
              {lang === "pl" ? "Przejdź do archiwum" : "Go to archive"}
            </a>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {cases.map((item) => (
              <div
                key={item.title}
                className="transition duration-200 hover:-translate-y-1"
              >
                <Link
                  href={item.href}
                  className="group block overflow-hidden rounded-[8px] bg-white/58 shadow-[0_18px_60px_rgba(15,23,42,0.055)] transition hover:bg-white"
                >
                  <div className="relative aspect-[16/10] bg-[#e2ddd4]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      unoptimized
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-headline text-3xl font-semibold tracking-normal">{item.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#59625e]">{item.copy[lang]}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="overflow-hidden bg-[#f7f4ed] py-10 text-[#082f2b]" aria-label="Programo capabilities">
        <div className="flex w-max max-w-max animate-slide-right whitespace-nowrap font-mono text-xl uppercase tracking-normal text-[#082f2b]/45 md:text-4xl">
          {[...studioTicker, ...studioTicker, ...studioTicker].map((item, index) => (
            <span key={`${item}-ticker-${index}`} className="mx-5 md:mx-8">
              {item} {"//"}
            </span>
          ))}
        </div>
      </section>

      <section className="bg-[#051f20] px-6 py-16 text-[#daf1de] md:px-10">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-normal text-[#8eb69b]">
              {lang === "pl" ? "Studio mode" : "Studio mode"}
            </p>
            <h2 className="mt-4 max-w-4xl font-headline text-4xl font-semibold leading-tight tracking-normal md:text-6xl">
              {lang === "pl" ? "Teraz wchodzimy w część, która pokazuje charakter Programo." : "Now we enter the part that shows Programo's character."}
            </h2>
          </div>
          <a
            href="#contact"
            className="inline-flex min-h-12 items-center justify-center rounded-full bg-[#daf1de] px-7 py-3 text-sm font-semibold text-[#051f20] transition hover:bg-white"
          >
            {lang === "pl" ? "Kontakt jest też na dole" : "Contact is also below"}
          </a>
        </div>
      </section>

    </div>
  );
}
