// Pricing page copy.
export const pricing = {
  "pricing.label": { pl: "Wycena", en: "Pricing" },
  "pricing.title": {
    pl: "Każdy projekt wyceniamy indywidualnie",
    en: "Every project is quoted individually",
  },
  "pricing.desc": {
    pl: "Nie pracujemy ze sztywnym cennikiem z półki — dobra strona czy aplikacja zaczyna się od Twojego celu, a nie od gotowego pakietu. Po krótkiej rozmowie przygotowujemy konkretną wycenę z widełkami i podziałem na etapy. Przejrzyście i bez ukrytych kosztów.",
    en: "We don't work from an off-the-shelf price list — a good website or app starts with your goal, not a ready-made package. After a short call we prepare a concrete quote with ranges and clear stages. Transparent, with no hidden costs.",
  },
  "pricing.factor1.name": { pl: "Zakres i złożoność", en: "Scope & complexity" },
  "pricing.factor1.desc": {
    pl: "Im więcej podstron, ekranów, ról użytkowników i logiki biznesowej, tym większy nakład pracy — i to najmocniej waży na wycenie.",
    en: "The more pages, screens, user roles and business logic, the more work involved — this weighs most on any quote.",
  },
  "pricing.factor1.f1": { pl: "Liczba podstron i ekranów", en: "Number of pages and screens" },
  "pricing.factor1.f2": { pl: "Role i uprawnienia użytkowników", en: "User roles and permissions" },
  "pricing.factor1.f3": { pl: "Logika biznesowa i automatyzacje", en: "Business logic and automation" },
  "pricing.factor2.name": { pl: "Integracje i technologia", en: "Integrations & technology" },
  "pricing.factor2.desc": {
    pl: "Płatności, systemy zewnętrzne i AI potrafią dać ogromną wartość, ale każda integracja to dodatkowy czas projektu i testów.",
    en: "Payments, external systems and AI can add huge value, but every integration means extra build and testing time.",
  },
  "pricing.factor2.f1": { pl: "Płatności (Stripe, Przelewy24)", en: "Payments (Stripe, Przelewy24)" },
  "pricing.factor2.f2": { pl: "API, ERP, BaseLinker, Allegro", en: "APIs, ERP, BaseLinker, Allegro" },
  "pricing.factor2.f3": { pl: "AI, OCR i integracje na miarę", en: "AI, OCR and custom integrations" },
  "pricing.factor3.name": { pl: "Termin i utrzymanie", en: "Timeline & maintenance" },
  "pricing.factor3.desc": {
    pl: "Tempo prac, zakres projektu UX/UI i opieka po wdrożeniu ustalamy wspólnie — to elementy, które realnie wpływają na budżet.",
    en: "Work pace, the scope of UX/UI design and post-launch care are set together — and they genuinely affect the budget.",
  },
  "pricing.factor3.f1": { pl: "Tempo prac i priorytety", en: "Pace and priorities" },
  "pricing.factor3.f2": { pl: "Projekt UX/UI od zera czy gotowy system", en: "UX/UI from scratch or a ready system" },
  "pricing.factor3.f3": { pl: "Opieka i rozwój po wdrożeniu", en: "Post-launch care and development" },
  "pricing.ctaTitle": { pl: "Poznaj koszt swojego projektu", en: "Find out your project's cost" },
  "pricing.ctaDesc": {
    pl: "Opisz pomysł w dwie minuty — wrócimy z konkretnymi widełkami i propozycją pierwszych kroków. Bezpłatnie i bez zobowiązań.",
    en: "Describe your idea in two minutes — we'll come back with concrete ranges and a proposed first step. Free and with no obligation.",
  },
  "pricing.promise": {
    pl: "Widełki przed startem · Bez ukrytych kosztów · Praca etapami",
    en: "Ranges up front · No hidden costs · Work in stages",
  },
  "pricing.cta": { pl: "Umów bezpłatną wycenę", en: "Get a free quote" },
} as const satisfies Record<string, { pl: string; en: string }>;
