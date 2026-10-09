// /cennik — the quoting process (call → range in 24 h → fixed quote) and what
// drives the cost. Zero invented amounts. Content: content-deck-2026-07.md
// section 6.
export const pricing = {
  "pricing.label": { pl: "Przejrzyste zasady wyceny", en: "Transparent pricing rules" },
  "pricing.title": { pl: "Ile kosztuje strona, sklep lub aplikacja?", en: "What does a website, shop or app cost?" },
  "pricing.lead": {
    pl: "Widełki pokazują koszt standardowego i rozszerzonego zakresu. Po rozmowie dopasowujemy zakres do Twojego projektu; przed rozpoczęciem prac dostajesz stałą wycenę.",
    en: "The ranges show the cost of standard and extended scope. After a call we match the scope to your project; you receive a fixed quote before work begins.",
  },

  "pricing.processLabel": { pl: "Jak wygląda proces", en: "How the process works" },

  "pricing.step1.title": { pl: "Rozmowa", en: "The call" },
  "pricing.step1.desc": {
    pl: "Piętnaście do trzydziestu minut przez telefon lub online. Opowiadasz o biznesie i celu, my dopytujemy o zakres, integracje i terminy. Bez zobowiązań.",
    en: "Fifteen to thirty minutes by phone or online. You tell us about the business and the goal; we ask about scope, integrations, and timelines. No obligation.",
  },
  "pricing.step2.title": { pl: "Widełki w 24 h", en: "A range within 24 hours" },
  "pricing.step2.desc": {
    pl: "Odpowiadamy w 24 h z widełkami cenowymi i proponowanym zakresem. Jeśli budżet się nie spina, mówimy to wprost i proponujemy mniejszy pierwszy etap zamiast naciągania oferty.",
    en: "We reply within 24 hours with a price range and a proposed scope. If the budget doesn't add up, we say so plainly and propose a smaller first stage instead of stretching the offer.",
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
  "pricing.ctaWrite": { pl: "Napisz do nas", en: "Contact us" },
  "pricing.cta": { pl: "Zadzwoń: 509 123 434", en: "Call +48 509 123 434" },

  // Price table — 3 categories, one active at a time (tabs). Numbers copied
  // 1:1 from ~/Programo/marketing/FIRMA/sprzedaz/cennik.md (verified 2026-10-09), the
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
    pl: "Ceny netto, doliczamy 23% VAT. Dolna kwota dotyczy standardowego zakresu, górna wersji rozszerzonej. Zakres i limit godzin każdego abonamentu ustalamy w umowie. Zmianę zakresu wyceniamy przed rozpoczęciem dodatkowych prac. Budżet reklam i opłaty zewnętrznych usług rozliczasz osobno. Google Ads powyżej 10 000 zł budżetu miesięcznego: 10% wydatku zamiast stawki z tabeli.",
    en: "Prices exclude 23% VAT. The lower amount covers standard scope; the upper amount covers an extended version. The scope and included hours of every retainer are agreed in the contract. We quote scope changes before starting extra work. Ad spend and external service fees are paid separately. Google Ads above a 10,000 PLN monthly budget: 10% of spend instead of the table rate.",
  },

  "pricing.catProjects": { pl: "Projekty", en: "Projects" },
  "pricing.catMonthly": { pl: "Współpraca miesięczna", en: "Monthly collaboration" },
  "pricing.catAi": { pl: "AI i automatyzacja", en: "AI and automation" },

  // Landing page i strona firmowa scalone 2026-08-12 (Wojtek: ta sama cena,
  // nie rozgraniczać) - jedna pozycja zamiast dwóch.
  "pricing.itemWebsite.name": { pl: "Strona internetowa (wizytówka lub firmowa)", en: "Website (landing page or company site)" },
  "pricing.itemWebsite.termin": { pl: "5 dni - 2 tyg.", en: "5 days - 2 weeks" },
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
  // SEO, Google Ads i GA4+GTM scalone 2026-08-12 (Wojtek: ta sama cena) -
  // jedna pozycja zamiast trzech. Reguła "powyżej 10 000 zł budżetu Ads: 10%
  // wydatku" z cennik.md jest opisana przy tabeli.
  "pricing.itemMarketing.name": { pl: "SEO, Google Ads, GA4 + GTM", en: "SEO, Google Ads, GA4 + GTM" },

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
