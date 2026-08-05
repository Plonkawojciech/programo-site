// /oferta — four pillars (web/SaaS, native mobile, online stores, websites +
// tracking + Google Ads). Same four pillars as the homepage, expanded here
// with a "what you get" list and a link to the matching subpage. Content:
// content-deck-2026-07.md section 2.
export const offer = {
  "offer.label": { pl: "Co robimy i jak pracujemy", en: "What we do and how we work" },
  "offer.title": { pl: "Oferta", en: "Services" },
  // Every `desc` below was cut roughly in half on 2026-08-05. The rule was
  // narrow: a sentence goes if the bullet list under it already says the same
  // thing. The bullets are the scannable part, the paragraph is the argument —
  // when both carried the same fact, the paragraph lost. Nothing was reworded
  // for style, so anything still here is a claim no bullet makes.
  "offer.lead": {
    pl: "Projekt, kod, wdrożenie i pomiar efektu robimy w jednych rękach.",
    en: "Design, code, deployment, and measurement all happen in the same hands.",
  },

  // Pillar 1 — Web applications & SaaS
  "offer.pillar1.title": { pl: "Aplikacje webowe i SaaS", en: "Web applications and SaaS" },
  "offer.pillar1.desc": {
    pl: "Budujemy systemy, w których firma pracuje na co dzień: CRM-y, panele klienta, platformy z płatnościami i wieloma poziomami uprawnień. Nasz własny produkt, Estalo, to działający produkcyjnie CRM dla biur nieruchomości z płatnościami, integracjami czterech portali ogłoszeniowych i sztuczną inteligencją wpiętą w codzienną pracę agenta. W projektach klienckich pracujemy tak samo.",
    en: "We build the systems a company works in daily: CRMs, client panels, platforms with payments and multiple permission levels. Our own product, Estalo, is a production CRM for real estate agencies with live billing, integrations with four listing portals, and AI wired into an agent's daily work. We work the same way on client projects.",
  },
  "offer.pillar1.example": {
    pl: "Estalo - CRM dla biur nieruchomości, live z płatnościami",
    en: "Estalo - a CRM for real estate agencies, live with billing",
  },
  "offer.pillar1.b1": { pl: "Analizę procesu i projekt systemu przed pierwszą linijką kodu", en: "Process analysis and system design before the first line of code" },
  "offer.pillar1.b2": { pl: "Aplikację z kontami, rolami i płatnościami", en: "An application with accounts, roles, and payments" },
  "offer.pillar1.b3": { pl: "Izolację danych każdego klienta na poziomie bazy (RLS)", en: "Per-customer data isolation at the database level (RLS)" },
  "offer.pillar1.b4": { pl: "Testy automatyczne i wdrożenie produkcyjne", en: "Automated tests and a production deployment" },
  "offer.pillar1.b5": { pl: "Panel administracyjny, którym zarządzasz samodzielnie", en: "An admin panel you manage yourself" },

  // Pillar 2 — Native iOS & Android apps
  "offer.pillar2.title": { pl: "Natywne aplikacje iOS i Android", en: "Native iOS and Android apps" },
  "offer.pillar2.desc": {
    pl: "Aplikacje mobilne piszemy natywnie: iOS w Swift i SwiftUI, Android w Kotlinie z Jetpack Compose. Nie używamy nakładek typu webview, bo różnicę czuć w pierwszej sekundzie, a potem przy aparacie, powiadomieniach, Face ID i pracy bez zasięgu. Dla Jedmara zbudowaliśmy w ten sposób dwie aplikacje sklepowe, opublikowane i działające w App Store oraz Google Play.",
    en: "We write mobile apps natively: iOS in Swift and SwiftUI, Android in Kotlin with Jetpack Compose. We skip webview wrappers, because you feel the difference in the first second, and then again with the camera, notifications, Face ID, and working with no signal. For Jedmar we built two store apps this way, published and live on the App Store and Google Play.",
  },
  "offer.pillar2.example": {
    pl: "Jedmar - dwie aplikacje sklepowe opublikowane w obu sklepach",
    en: "Jedmar - two store apps published in both app stores",
  },
  "offer.pillar2.b1": { pl: "Dwie natywne aplikacje albo jedną platformę, zależnie od potrzeb i budżetu", en: "Two native apps or a single platform, depending on need and budget" },
  "offer.pillar2.b2": { pl: "Integrację z Twoim istniejącym systemem lub sklepem", en: "Integration with your existing system or store" },
  "offer.pillar2.b3": { pl: "Publikację w App Store i Google Play przeprowadzoną przez nas", en: "App Store and Google Play publication handled by us" },
  "offer.pillar2.b4": { pl: "Powiadomienia push, biometrię, pracę offline", en: "Push notifications, biometrics, offline support" },
  "offer.pillar2.b5": { pl: "Testy automatyczne i aktualizacje po premierze", en: "Automated tests and post-launch updates" },

  // Pillar 3 — Online stores
  "offer.pillar3.title": { pl: "Sklepy internetowe", en: "Online stores" },
  "offer.pillar3.desc": {
    pl: "E-commerce robimy na dwa sposoby. Możemy rozbudować sklep, który już masz, jak u Jedmara, gdzie do działającego PrestaShopa dołożyliśmy dwie natywne aplikacje mobilne i interaktywne schematy części zamiennych. Możemy też postawić sklep od zera, na WooCommerce, PrestaShop albo headless na Next.js.",
    en: "We do e-commerce two ways. We can extend the store you already have, as with Jedmar, where we added two native mobile apps and interactive spare-parts diagrams to a running PrestaShop. Or we can build a store from scratch, on WooCommerce, PrestaShop, or headless Next.js.",
  },
  "offer.pillar3.example": {
    pl: "Jedmar - aplikacje i interaktywne schematy części do istniejącego sklepu",
    en: "Jedmar - apps and interactive parts diagrams for an existing store",
  },
  "offer.pillar3.b1": { pl: "Sklep od zera albo rozbudowę tego, który masz, bez wymuszonej migracji", en: "A store from scratch or an extension of the one you have, with no forced migration" },
  "offer.pillar3.b2": { pl: "Integracje płatności (PayU, przelewy, raty) i dostaw (InPost)", en: "Payment (PayU, transfers, installments) and delivery (InPost) integrations" },
  "offer.pillar3.b3": { pl: "Aplikację mobilną do sklepu, jeśli Twoi klienci kupują z telefonu", en: "A mobile app for the store if your customers buy from their phones" },
  "offer.pillar3.b4": { pl: "Integracje z Allegro i BaseLinkerem", en: "Allegro and BaseLinker integrations" },
  "offer.pillar3.b5": { pl: "Migrację bez utraty pozycji w Google", en: "Migration without losing Google rankings" },

  // Pillar 4 — Websites, tracking & Google Ads
  // Was `""` on both sides, which rendered pillar "04" with a number and no
  // heading — the only unlabelled block on the page.
  "offer.pillar4.title": { pl: "Strony, tracking i reklamy Google", en: "Websites, tracking and Google Ads" },
  "offer.pillar4.desc": {
    pl: "Strona, na którą nikt nie wchodzi i której nikt nie mierzy, to wydatek bez zwrotu. Dlatego stronę lub landing, pomiar konwersji i kampanię Google Ads prowadzimy razem. Dla Skupu Nieruchomości zbudowaliśmy kompletny lejek: sześć podstron dopasowanych do treści reklam, dwukrokowy widżet oddzwonienia i pełny tracking z enhanced conversions.",
    en: "A website nobody visits and nobody measures is money spent for nothing. That's why we handle the site or landing page, conversion tracking, and the Google Ads campaign together. For Skup Nieruchomości we built a complete funnel: six pages matched to ad copy, a two-step callback widget, and full tracking with enhanced conversions.",
  },
  "offer.pillar4.example": {
    pl: "Skup Nieruchomości - kompletny lejek: strona, tracking i kampania",
    en: "Skup Nieruchomości - a complete funnel: website, tracking, and campaign",
  },
  "offer.pillar4.b1": { pl: "Stronę lub landing zaprojektowane pod jedno działanie: telefon albo formularz", en: "A site or landing page designed for one action: a call or a form" },
  "offer.pillar4.b2": { pl: "GA4 i śledzenie konwersji Google Ads zgodne z Consent Mode v2", en: "GA4 and Google Ads conversion tracking compliant with Consent Mode v2" },
  "offer.pillar4.b3": { pl: "Kampanię Google Ads zbudowaną i prowadzoną, z raportami pisanymi po ludzku", en: "A Google Ads campaign built and run, with reports written in plain language" },
  "offer.pillar4.b4": { pl: "SEO techniczne: szybkość, dane strukturalne, indeksacja", en: "Technical SEO: speed, structured data, indexing" },
  "offer.pillar4.b5": { pl: "Możliwość pracy na Twojej istniejącej stronie", en: "The option to work on your existing website" },

  "offer.getBullets": { pl: "Co dostajesz", en: "What you get" },
  "offer.seeExample": { pl: "Zobacz realizację", en: "See the example" },
} as const satisfies Record<string, { pl: string; en: string }>;
