// /cennik — the quoting process (call → range in 24 h → fixed quote) and what
// drives the cost. Zero invented amounts. Content: content-deck-2026-07.md
// section 6.
export const pricing = {
  "pricing.label": { pl: "Wycena", en: "Pricing" },
  "pricing.title": { pl: "Wycena", en: "Pricing" },
  "pricing.lead": {
    pl: "Nie mamy cennika z półki, bo strona wizytówkowa i platforma SaaS różnią się skalą pracy o rząd wielkości. Mamy za to prosty, przewidywalny proces: zanim zapłacisz cokolwiek, wiesz dokładnie, co dostaniesz i za ile.",
    en: "We don't have an off-the-shelf price list, because a simple website and a SaaS platform differ in scale by an order of magnitude. What we have is a simple, predictable process: before you pay anything, you know exactly what you'll get and for how much.",
  },

  "pricing.processLabel": { pl: "Jak wygląda proces", en: "How the process works" },

  "pricing.step1.title": { pl: "Rozmowa", en: "The call" },
  "pricing.step1.desc": {
    pl: "Piętnaście do trzydziestu minut przez telefon lub online. Opowiadasz o biznesie i celu, my dopytujemy o zakres, integracje i terminy. Bez zobowiązań.",
    en: "Fifteen to thirty minutes by phone or online. You tell us about the business and the goal; we ask about scope, integrations, and timelines. No obligation.",
  },
  "pricing.step2.title": { pl: "Widełki w 24 h", en: "A range within 24 hours" },
  "pricing.step2.desc": {
    pl: "Następnego dnia roboczego masz w skrzynce widełki cenowe i proponowany zakres. Jeśli budżet się nie spina, mówimy to wprost i proponujemy mniejszy pierwszy etap zamiast naciągania oferty.",
    en: "By the next business day you have a price range and a proposed scope in your inbox. If the budget doesn't add up, we say so plainly and propose a smaller first stage instead of stretching the offer.",
  },
  "pricing.step3.title": { pl: "Stała wycena", en: "A fixed quote" },
  "pricing.step3.desc": {
    pl: "Przed startem dostajesz stałą wycenę z rozpisanym zakresem, etapami i terminami. Cena nie rośnie w trakcie, chyba że wspólnie zmienimy zakres — wtedy najpierw aktualizujemy wycenę, potem pracujemy.",
    en: "Before we start, you get a fixed quote with the scope, stages, and deadlines written out. The price doesn't grow mid-project unless we change the scope together — in which case we update the quote first, then do the work.",
  },

  "pricing.factorsLabel": { pl: "Co wpływa na cenę", en: "What drives the cost" },

  "pricing.factor1.name": { pl: "Zakres i złożoność", en: "Scope and complexity" },
  "pricing.factor1.desc": {
    pl: "Liczba ekranów, ról użytkowników i procesów",
    en: "Number of screens, user roles, and processes",
  },
  "pricing.factor2.name": { pl: "Integracje", en: "Integrations" },
  "pricing.factor2.desc": {
    pl: "Płatności, portale, systemy magazynowe, API zewnętrzne",
    en: "Payments, portals, warehouse systems, external APIs",
  },
  "pricing.factor3.name": { pl: "Platformy", en: "Platforms" },
  "pricing.factor3.desc": {
    pl: "Sama strona, web i aplikacje mobilne, czy całość",
    en: "Website only, web plus mobile apps, or everything",
  },
  "pricing.factor4.name": { pl: "Termin", en: "Timeline" },
  "pricing.factor4.desc": {
    pl: "Praca w standardowym tempie kosztuje mniej niż ekspres",
    en: "Standard pace costs less than a rush job",
  },
  "pricing.factor5.name": { pl: "Utrzymanie", en: "Maintenance" },
  "pricing.factor5.desc": {
    pl: "Jednorazowe wdrożenie albo stała opieka i rozwój",
    en: "One-off deployment or ongoing care and development",
  },

  "pricing.ctaTitle": { pl: "Poznaj koszt swojego projektu", en: "Find out what your project costs" },
  "pricing.ctaDesc": {
    pl: "Widełki dostaniesz w 24 h.",
    en: "You'll get a range within 24 hours.",
  },
  "pricing.cta": { pl: "Zadzwoń: 509 123 434", en: "Call +48 509 123 434" },
} as const satisfies Record<string, { pl: string; en: string }>;
