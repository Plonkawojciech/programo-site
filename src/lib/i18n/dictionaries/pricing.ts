// /cennik — the quoting process (call → range in 24 h → fixed quote) and what
// drives the cost. Zero invented amounts. Content: content-deck-2026-07.md
// section 6.
export const pricing = {
  "pricing.label": { pl: "Przejrzyste zasady wyceny", en: "Transparent pricing rules" },
  "pricing.title": { pl: "Wycena", en: "Pricing" },
  "pricing.lead": {
    pl: "Strony wizytówkowej i platformy SaaS nie da się wycenić z jednego cennika, bo skala pracy różni się o rząd wielkości. Dlatego wyceniamy każdy projekt osobno, a zanim zapłacisz pierwszą złotówkę, wiesz, co dostaniesz i za ile.",
    en: "You can't price a simple website and a SaaS platform off the same list, because the scale of work differs by an order of magnitude. So we quote every project separately, and before you pay anything you know what you'll get and for how much.",
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
    pl: "Przed startem dostajesz stałą wycenę z rozpisanym zakresem, etapami i terminami. Cena nie rośnie w trakcie, chyba że wspólnie zmienimy zakres. Wtedy aktualizujemy wycenę, zanim zabierzemy się do pracy.",
    en: "Before we start, you get a fixed quote with the scope, stages, and deadlines written out. The price doesn't grow mid-project unless we change the scope together. In that case we update the quote before doing the work.",
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

  // Price table — 3 categories, one active at a time (tabs). Numbers copied
  // 1:1 from ~/Programo/marketing/FIRMA/sprzedaz/cennik.md (28.07.2026), the
  // only source of truth. Only the Standard-Rozszerzony range is public — the
  // owner's rule (cennik.md "Zasady"): "Klient słyszy kolumnę Standard, Start
  // tylko za case study, opinię albo polecenie." "Start" never appears here.
  "pricing.tableLabel": { pl: "Widełki cenowe", en: "Price ranges" },
  "pricing.tableLead": {
    pl: "Od czego zaczyna standardowy zakres i ile kosztuje wersja rozszerzona - wybierz kategorię.",
    en: "What a standard scope starts at and what the extended version costs - pick a category.",
  },
  "pricing.unitMonth": { pl: "/ mies.", en: "/ mo" },
  "pricing.disclaimer": {
    pl: "Ceny netto, doliczamy 23% VAT. Wycena jest stała od podpisania - żadnych aneksów w trakcie projektu.",
    en: "Prices are net, we add 23% VAT. The quote is fixed once signed - no add-ons mid-project.",
  },

  "pricing.catProjects": { pl: "Projekty", en: "Projects" },
  "pricing.catMonthly": { pl: "Współpraca miesięczna", en: "Monthly collaboration" },
  "pricing.catAi": { pl: "AI i automatyzacja", en: "AI and automation" },

  "pricing.itemLanding.name": { pl: "Landing page", en: "Landing page" },
  "pricing.itemLanding.termin": { pl: "5 dni", en: "5 days" },
  "pricing.itemCorporate.name": { pl: "Strona firmowa", en: "Company website" },
  "pricing.itemCorporate.termin": { pl: "2 tyg.", en: "2 weeks" },
  "pricing.itemStoreWoo.name": { pl: "Sklep Woo / Shopify", en: "Woo / Shopify store" },
  "pricing.itemStoreWoo.termin": { pl: "3 tyg.", en: "3 weeks" },
  "pricing.itemStoreCustom.name": { pl: "Sklep na własnym silniku", en: "Custom-built store" },
  "pricing.itemStoreCustom.termin": { pl: "6 tyg.", en: "6 weeks" },
  "pricing.itemWebapp.name": { pl: "System / aplikacja webowa", en: "System / web application" },
  "pricing.itemWebapp.termin": { pl: "od 4 tyg.", en: "from 4 weeks" },
  "pricing.itemMobile.name": { pl: "Aplikacja mobilna iOS + Android", en: "iOS + Android mobile app" },
  "pricing.itemMobile.termin": { pl: "6 tyg.", en: "6 weeks" },

  "pricing.itemCareSite.name": { pl: "Opieka nad stroną", en: "Website care" },
  "pricing.itemCareShop.name": { pl: "Opieka nad sklepem / systemem", en: "Store / system care" },
  "pricing.itemSeo.name": { pl: "SEO", en: "SEO" },
  "pricing.itemAds.name": { pl: "Google Ads", en: "Google Ads" },
  "pricing.itemGa4.name": { pl: "GA4 + GTM", en: "GA4 + GTM" },
  "pricing.itemGa4.termin": { pl: "jednorazowo", en: "one-time" },

  "pricing.itemAudit.name": { pl: "Audyt procesów", en: "Process audit" },
  "pricing.itemAudit.termin": { pl: "1 tydz.", en: "1 week" },
  "pricing.itemAutomation.name": { pl: "Automatyzacja procesu", en: "Process automation" },
  "pricing.itemAutomation.termin": { pl: "2-4 tyg.", en: "2-4 weeks" },
  "pricing.itemAssistant.name": { pl: "Asystent na danych firmy", en: "Assistant on company data" },
  "pricing.itemAssistant.termin": { pl: "3-6 tyg.", en: "3-6 weeks" },
  "pricing.itemTraining.name": { pl: "Szkolenie zespołu", en: "Team training" },
  "pricing.itemTraining.termin": { pl: "1 dzień", en: "1 day" },
  "pricing.itemAiCare.name": { pl: "Opieka po wdrożeniu", en: "Post-launch support" },
} as const satisfies Record<string, { pl: string; en: string }>;
