// Homepage-only copy: intro, trust/proof bar, sticky mobile CTA, portfolio
// marquee heading and the legacy hero labels.
export const home = {
  // Main page intro section
  "main.intro.label": { pl: "Programo Studio", en: "Programo Studio" },
  "main.intro.headline": {
    pl: "Tworzymy software, który rozwiązuje realne problemy.",
    en: "We build software that solves real problems.",
  },
  "main.intro.subheadline": {
    pl: "Dwóch inżynierów z Poznania. Od pierwszej rozmowy po wdrożenie na produkcję bierzemy odpowiedzialność za całość — projekt, kod i uruchomienie. Bez pośredników.",
    en: "Two engineers from Poznań. From the first call to production launch, we own the whole thing — design, code and deployment. No middlemen.",
  },
  "main.values.title": { pl: "Co nas wyróżnia", en: "What sets us apart" },
  "main.values.problem.title": { pl: "Realny problem", en: "Real problem" },
  "main.values.problem.desc": {
    pl: "Nie budujemy demo. Budujemy narzędzia, które naprawdę pomagają firmom zarabiać i oszczędzać czas.",
    en: "We don't build demos. We build tools that actually help businesses earn and save time.",
  },
  "main.values.craft.title": { pl: "Pełne zaangażowanie", en: "Full ownership" },
  "main.values.craft.desc": {
    pl: "Bez warstw managementu. Architektura, design, kod i wdrożenie — wszystko z naszych rąk.",
    en: "No management layers. Architecture, design, code and deployment — all hands-on from us.",
  },
  "main.values.speed.title": { pl: "Szybkie wdrożenie", en: "Fast delivery" },
  "main.values.speed.desc": {
    pl: "Pracujemy szybko, ale bez kompromisów. Nowoczesny stack i sprawdzone wzorce.",
    en: "We move fast without cutting corners. Modern stack, battle-tested patterns.",
  },
  "main.cta.primary": { pl: "Porozmawiajmy o projekcie", en: "Let's talk about your project" },
  "main.cta.secondary": { pl: "Zobacz nasze projekty", en: "See our work" },
  "main.cta.offer": { pl: "Sprawdź ofertę", en: "Check our offer" },
  "main.cta.pricing": { pl: "Zobacz cennik", en: "See pricing" },

  // Trust / proof bar (homepage, under hero)
  "trust.eyebrow": { pl: "Co już zbudowaliśmy", en: "What we've already built" },
  "trust.stat1.value": { pl: "7", en: "7" },
  "trust.stat1.label": { pl: "Wdrożonych produktów", en: "Products shipped" },
  "trust.stat2.value": { pl: "100%", en: "100%" },
  "trust.stat2.label": { pl: "Własny kod, bez podwykonawców", en: "Own code, no subcontractors" },
  "trust.stat3.value": { pl: "do 24 h", en: "under 24 h" },
  "trust.stat3.label": { pl: "Czas pierwszej odpowiedzi", en: "First response time" },
  "trust.stat4.value": { pl: "PL · EN", en: "PL · EN" },
  "trust.stat4.label": { pl: "Dwujęzyczne wdrożenia", en: "Bilingual delivery" },

  // Sticky mobile CTA
  "sticky.cta": { pl: "Bezpłatna konsultacja", en: "Free consultation" },
  "sticky.call": { pl: "Zadzwoń", en: "Call" },
  "sticky.write": { pl: "Napisz", en: "Message" },

  // Projects marquee (main page preview strip)
  "realizations.label": { pl: "Portfolio", en: "Portfolio" },
  "realizations.title": { pl: "Nasze realizacje", en: "Our work" },
  "realizations.subtitle": {
    pl: "Realne systemy, aplikacje i sklepy, które działają na produkcji. Kliknij, żeby zobaczyć szczegóły.",
    en: "Real systems, apps and stores running in production. Click to see the details.",
  },
  "realizations.viewAll": { pl: "Zobacz wszystkie projekty", en: "See all projects" },

  // Hero
  "hero.label": { pl: "Studio Software", en: "Software Studio" },
  "hero.desc": {
    pl: "Projektujemy i budujemy oprogramowanie, które rozwiązuje realne problemy. Od koncepcji po wdrożenie, z dbałością o każdy detal.",
    en: "We design and build software products that solve real problems. From concept to launch, with craft and precision.",
  },
  "hero.browse": { pl: "Zobacz projekty", en: "Browse our work" },
  "hero.about": { pl: "O nas", en: "About us" },
  "hero.contact": { pl: "Kontakt", en: "Get in touch" },
} as const satisfies Record<string, { pl: string; en: string }>;
