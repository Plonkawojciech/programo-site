export type ProjectStatus = "live" | "development" | "coming-soon" | "planned";

export interface SubProduct {
  name: string;
  tagline: { pl: string; en: string };
  description: { pl: string; en: string };
  icon?: string;
  screenshots: string[];
  liveUrl?: string;
  accentColor?: string;
}

export interface Project {
  slug: string;
  title: string;
  subtitle: { pl: string; en: string };
  description: { pl: string; en: string };
  longDescription: { pl: string; en: string };
  status: ProjectStatus;
  // Honest, human-readable status shown next to the badge
  // (e.g. "Web live; apka iOS w wersji podglądowej").
  statusLabel?: { pl: string; en: string };
  // Optional presentation hint. "mobile-app" → the detail page shows screenshots
  // inside App-Store-style phone frames instead of the default editorial grid.
  kind?: "mobile-app";
  category: "produkty" | "dla-klientow" | "marketing";
  // Client name for commissioned work (dla-klientow / marketing).
  client?: { pl: string; en: string };
  // Honest scope statement — what we actually delivered (and what we did not).
  scope?: { pl: string; en: string };
  // External collaboration partner, if any (e.g. "PBDevs (Filip Piątek)").
  partner?: string;
  liveUrl?: string;
  // Short, real headline metric shown on cards (e.g. "1500+ produktów · 190 kategorii").
  metric?: { pl: string; en: string };
  // 2-4 hard numbers for cards and detail pages. Only verified facts.
  metrics?: { value: string; label: { pl: string; en: string } }[];
  tech: string[];
  features: { pl: string[]; en: string[] };
  tags: string[];
  accentColor: string;
  bgColor: string;
  year: string;
  role: { pl: string; en: string };
  screenshots?: string[];
  subProducts?: SubProduct[];
}

export const projects: Project[] = [
  {
    slug: "jedmar",
    title: "Jedmar",
    subtitle: {
      pl: "Natywne aplikacje sklepowe iOS i Android z interaktywnymi schematami części",
      en: "Native iOS and Android store apps with interactive parts diagrams",
    },
    description: {
      pl: "Dwie natywne aplikacje zakupowe dla poznańskiego Centrum Narzędziowego Jedmar, spięte z istniejącym sklepem PrestaShop: katalog ponad 1500 produktów, 6 integracji płatności, Paczkomaty InPost i skaner kodów EAN. Do tego interaktywny moduł schematów części zamiennych, który działa na stronie sklepu i w obu aplikacjach.",
      en: "Two native shopping apps for the Jedmar Tool Center in Poznan, wired into the store's existing PrestaShop backend: a catalog of over 1,500 products, 6 payment integrations, InPost parcel lockers, and an EAN barcode scanner. Plus an interactive spare-parts diagram module that runs on the store website and inside both apps.",
    },
    longDescription: {
      pl: "Jedmar prowadzi w Poznaniu sklep narzędziowy z ponad 1500 produktami na PrestaShop. Sklep działał, ale zakupy z telefonu były uciążliwe, a znalezienie właściwej części zamiennej do gwoździarki wymagało telefonu do obsługi i wertowania PDF-ów producenta. Naszym zadaniem nie była przebudowa sklepu, tylko dołożenie do niego dwóch rzeczy: wygodnych zakupów mobilnych i sensownej sprzedaży części.\n\nZbudowaliśmy dwie w pełni natywne aplikacje: iOS w Swift i SwiftUI oraz Android w Kotlinie z Jetpack Compose. Obie obsługują pełny cykl zakupowy: katalog z ok. 190 kategoriami, wyszukiwarkę z filtrami, koszyk, checkout z wyborem Paczkomatu InPost na mapie i sześcioma metodami płatności (PayU, PayPo, iMoje, Comfino, Caraty, InPost Pay), konto klienta z historią zamówień, skaner kodów EAN, powiadomienia push i logowanie Face ID. Osobno powstał moduł schematów części: interaktywne, eksplodowane rysunki techniczne 73 narzędzi z ok. 7500 klikalnych markerów, z których każdy prowadzi do konkretnej części i przycisku dodania do koszyka.\n\nŹródłem prawdy pozostał istniejący PrestaShop. Aplikacje rozmawiają z nim przez warstwę API na Next.js, a katalog synchronizuje się automatycznie co kilka minut, więc cena zmieniona w sklepie pojawia się w aplikacjach bez niczyjej pracy. Moduł schematów ma jedno źródło danych i trzy miejsca działania: stronę sklepu, aplikację iOS i aplikację Android. Natywność nie była kaprysem, tylko decyzją pod użytkownika, który obsługuje aplikację jedną ręką na budowie i skanuje kod z opakowania zamiast wpisywać nazwę.\n\nObie aplikacje są opublikowane i działają w App Store oraz Google Play, a schematy części są dostępne publicznie na jedmar.pl. Wersję iOS pokrywa 96 testów automatycznych, a cały proces wydawniczy przechodzi przez TestFlight i review sklepów, jak w każdym poważnym produkcie mobilnym.",
      en: "Jedmar runs a tool store in Poznan with over 1,500 products on PrestaShop. The store worked fine, but shopping from a phone was clumsy, and finding the right spare part for a nail gun meant calling the shop and digging through manufacturer PDFs. Our job was not to rebuild the store. It was to add two things to it: comfortable mobile shopping and a sane way to sell spare parts.\n\nWe built two fully native apps: iOS in Swift and SwiftUI, Android in Kotlin with Jetpack Compose. Both cover the complete purchase cycle: a catalog with around 190 categories, search with filters, cart, checkout with InPost parcel-locker selection on a map and six payment methods (PayU, PayPo, iMoje, Comfino, Caraty, InPost Pay), a customer account with order history, an EAN barcode scanner, push notifications, and Face ID sign-in. Separately, we built the parts diagram module: interactive exploded technical drawings of 73 tools with roughly 7,500 clickable markers, each leading to a specific part and an add-to-cart button.\n\nThe existing PrestaShop remained the source of truth. The apps talk to it through a Next.js API layer, and the catalog syncs automatically every few minutes, so a price changed in the store shows up in the apps with no manual work. The diagram module has one data source and three surfaces: the store website, the iOS app, and the Android app. Going native was not a whim but a decision made for the actual user, who operates the app one-handed on a job site and scans a barcode instead of typing a product name.\n\nBoth apps are published and live on the App Store and Google Play, and the parts diagrams are publicly available on jedmar.pl. The iOS version is covered by 96 automated tests, and every release goes through TestFlight and store review, as any serious mobile product should.",
    },
    status: "live",
    statusLabel: {
      pl: "Obie aplikacje opublikowane w App Store i Google Play",
      en: "Both apps published on the App Store and Google Play",
    },
    kind: "mobile-app",
    category: "dla-klientow",
    client: {
      pl: "Centrum Narzędziowe Jedmar, Poznań",
      en: "Jedmar Tool Center, Poznan",
    },
    scope: {
      pl: "Aplikacje mobilne i moduł schematów części — sklep internetowy jedmar.pl istniał wcześniej i nie jest naszym dziełem",
      en: "Mobile apps and the parts diagram module — the jedmar.pl online store existed before and is not our work",
    },
    liveUrl: "https://jedmar.pl/pl/schematy-narzedzi",
    metric: {
      pl: "1500+ produktów · 73 schematy narzędzi",
      en: "1,500+ products · 73 tool diagrams",
    },
    metrics: [
      { value: "2", label: { pl: "natywne aplikacje w sklepach", en: "native apps in the stores" } },
      { value: "1500+", label: { pl: "produktów w katalogu", en: "products in the catalog" } },
      { value: "73", label: { pl: "narzędzia w module schematów", en: "tools in the diagram module" } },
      { value: "~7500", label: { pl: "klikalnych markerów części", en: "clickable part markers" } },
    ],
    tech: ["Swift", "SwiftUI", "Kotlin", "Jetpack Compose", "Next.js", "PrestaShop API", "InPost", "APNs / FCM"],
    features: {
      pl: [
        "Pełny cykl zakupowy w aplikacji: katalog, koszyk, checkout, konto, historia zamówień",
        "6 integracji płatności: PayU, PayPo, iMoje, Comfino, Caraty, InPost Pay",
        "Checkout z wyborem Paczkomatu InPost na mapie",
        "Skaner kodów kreskowych EAN — od kodu na opakowaniu do karty produktu",
        "Interaktywne schematy części: 73 narzędzia, ok. 7500 markerów, dodanie części do koszyka",
        "Jedno źródło danych schematów dla strony sklepu i obu aplikacji",
        "Automatyczna synchronizacja katalogu z PrestaShop co kilka minut",
        "96 testów automatycznych po stronie iOS, wydania przez TestFlight i review sklepów",
      ],
      en: [
        "Full purchase cycle in the app: catalog, cart, checkout, account, order history",
        "6 payment integrations: PayU, PayPo, iMoje, Comfino, Caraty, InPost Pay",
        "Checkout with InPost parcel-locker selection on a map",
        "EAN barcode scanner — from the code on the box to the product page",
        "Interactive parts diagrams: 73 tools, ~7,500 markers, add-to-cart per part",
        "One diagram data source serving the store website and both apps",
        "Automatic catalog sync with PrestaShop every few minutes",
        "96 automated tests on iOS, releases through TestFlight and store review",
      ],
    },
    tags: ["Mobile", "iOS", "Android", "E-commerce"],
    accentColor: "#ffd333",
    bgColor: "#1a1a0a",
    year: "2026",
    role: {
      pl: "Programo — projekt i budowa aplikacji oraz modułu schematów",
      en: "Programo — design and build of the apps and the diagram module",
    },
    screenshots: [
      "/screenshots/v2/jedmar-schemat-tool-desktop.webp",
      "/screenshots/v2/jedmar-schematy-mobile.webp",
      "/screenshots/jedmar-app1.webp",
      "/screenshots/jedmar-app2.webp",
      "/screenshots/jedmar-app3.webp",
    ],
    subProducts: [
      {
        name: "Aplikacje mobilne",
        tagline: {
          pl: "Sklep w kieszeni klienta — natywnie na iOS i Android",
          en: "The store in the customer's pocket — native on iOS and Android",
        },
        description: {
          pl: "Dwie osobne, w pełni natywne aplikacje (Swift/SwiftUI i Kotlin/Compose) na wspólnym backendzie API. Katalog, koszyk, płatności, Paczkomaty, konto klienta i skaner EAN — wszystko na danych istniejącego sklepu.",
          en: "Two separate, fully native apps (Swift/SwiftUI and Kotlin/Compose) on a shared API backend. Catalog, cart, payments, parcel lockers, customer account, and an EAN scanner — all running on the existing store's data.",
        },
        screenshots: [
          "/screenshots/jedmar-app1.webp",
          "/screenshots/jedmar-app2.webp",
          "/screenshots/jedmar-app3.webp",
        ],
        accentColor: "#ffd333",
      },
      {
        name: "Moduł schematów części",
        tagline: {
          pl: "Eksplodowane rysunki techniczne z częściami do kupienia jednym kliknięciem",
          en: "Exploded technical drawings with parts one click away from the cart",
        },
        description: {
          pl: "Interaktywny wizualizator schematów 73 narzędzi pięciu marek: klikalne markery części, zoom i pinch na mobile, lista części z wyszukiwarką i przycisk dodania do koszyka. Wdrożony na produkcyjnej stronie jedmar.pl i natywnie w obu aplikacjach.",
          en: "An interactive diagram viewer for 73 tools across five brands: clickable part markers, zoom and pinch on mobile, a searchable parts list, and an add-to-cart button. Deployed on the production jedmar.pl website and natively inside both apps.",
        },
        screenshots: ["/screenshots/v2/jedmar-schemat-tool-desktop.webp"],
        liveUrl: "https://jedmar.pl/pl/schematy-narzedzi",
        accentColor: "#ffd333",
      },
    ],
  },
  {
    slug: "estalo",
    title: "Estalo",
    subtitle: {
      pl: "CRM z AI dla biur nieruchomości — z własnym portalem ogłoszeń",
      en: "AI-powered CRM for real estate agencies — with its own listings portal",
    },
    description: {
      pl: "Wielonajemcowy CRM dla polskich biur nieruchomości: integracje z czterema portalami ogłoszeniowymi, dopasowanie klient–oferta liczone przez AI w skali 0–100, generator opisów i asystent oparty na bazie wiedzy agencji. Web działa produkcyjnie z włączonymi płatnościami; natywne aplikacje iOS i Android są w App Store review.",
      en: "A multi-tenant CRM for Polish real estate agencies: integrations with four listing portals, AI client-to-property matching on a 0-100 scale, a listing description generator, and an assistant built on the agency's own knowledge base. The web product runs in production with live billing; native iOS and Android apps are in App Store review.",
    },
    longDescription: {
      pl: "Dzień pracy agenta nieruchomości to dziesiątki rozmów, notatek na kolanie i ta sama oferta wklejana ręcznie na cztery portale. Estalo powstało po to, żeby ten dzień uporządkować: jedna baza klientów i ofert, publikacja na portale jednym kliknięciem i AI, które robi robotę papierkową zamiast agenta.\n\nSercem produktu są integracje i sztuczna inteligencja. Oferty publikują się do Otodom (pełny OAuth i API), NOE 2.0, Domy.pl oraz Morizon-Gratka bezpośrednio z dashboardu. AI dopasowuje klientów do ofert w skali 0–100, generuje opisy marketingowe według modelu AIDA i odpowiada na pytania w chatbocie karmionym dokumentami agencji (RAG na pgvector). Agent może też podyktować notatkę po spotkaniu, a system sam rozłoży ją na dane w CRM. Całość jest wielonajemcowa: około 32 tabele z Row Level Security i pięciostopniowa hierarchia ról pilnują, żeby dane jednego biura nigdy nie przeciekły do drugiego.\n\nIzolację danych zrobiliśmy na poziomie bazy, nie aplikacji, bo w SaaS dla wielu firm jedno przeoczenie w kodzie nie może oznaczać wycieku. Z tego samego powodu aplikacje mobilne są w pełni natywne (SwiftUI i Kotlin/Compose) i łączą się z tą samą bazą przez te same reguły bezpieczeństwa, bez pośredniego API do utrzymania. Obok CRM działa osobny portal ogłoszeń na portal.estalo.pl, zintegrowany z CRM podpisywanym kryptograficznie API, więc oferta z CRM ląduje na portalu automatycznie, a lead z portalu wraca do agenta.\n\nEstalo jest naszym własnym produktem i działa produkcyjnie: rejestracja, 14-dniowy okres próbny i płatności są włączone na estalo.pl. Aplikacje mobilne przeszły przygotowanie pod wytyczne Apple i Google i czekają w procesie review.",
      en: "A real estate agent's workday is dozens of calls, notes scribbled in a hurry, and the same listing pasted by hand into four portals. Estalo exists to bring order to that day: one database of clients and listings, one-click publishing to the portals, and AI that does the paperwork instead of the agent.\n\nIntegrations and AI are the heart of the product. Listings publish to Otodom (full OAuth and API), NOE 2.0, Domy.pl, and Morizon-Gratka straight from the dashboard. AI scores client-to-property fit on a 0-100 scale, writes marketing descriptions following the AIDA model, and answers questions in a chatbot fed with the agency's documents (RAG on pgvector). An agent can also dictate a note after a meeting and the system breaks it down into CRM records. Everything is multi-tenant: around 32 tables with Row Level Security and a five-level role hierarchy make sure one agency's data never leaks into another's.\n\nWe enforce data isolation at the database level, not in application code, because in a SaaS serving many companies a single oversight must not become a breach. For the same reason, the mobile apps are fully native (SwiftUI and Kotlin/Compose) and connect to the same database under the same security rules, with no intermediate API to maintain. Alongside the CRM runs a separate listings portal at portal.estalo.pl, integrated with the CRM through a cryptographically signed API, so a listing flows to the portal automatically and a lead from the portal comes back to the agent.\n\nEstalo is our own product and runs in production: sign-up, a 14-day trial, and billing are live at estalo.pl. The mobile apps have been prepared for Apple and Google guidelines and are waiting in the review process.",
    },
    status: "live",
    statusLabel: {
      pl: "Web live z włączonymi płatnościami; aplikacje iOS i Android w App Store review",
      en: "Web live with billing enabled; iOS and Android apps in App Store review",
    },
    category: "produkty",
    liveUrl: "https://estalo.pl",
    metric: {
      pl: "4 portale · AI 0–100 · web + iOS + Android",
      en: "4 portals · AI 0-100 · web + iOS + Android",
    },
    metrics: [
      { value: "4", label: { pl: "integracje portali ogłoszeniowych", en: "listing portal integrations" } },
      { value: "0–100", label: { pl: "skala AI dopasowania klient–oferta", en: "AI client-to-property match scale" } },
      { value: "~32", label: { pl: "tabele z izolacją danych (RLS)", en: "tables with data isolation (RLS)" } },
      { value: "5", label: { pl: "poziomów ról i uprawnień", en: "role and permission levels" } },
    ],
    tech: ["Next.js", "TypeScript", "React", "Supabase", "pgvector", "OpenAI", "SwiftUI", "Kotlin", "Jetpack Compose", "Lemon Squeezy", "Drizzle", "Clerk"],
    features: {
      pl: [
        "Publikacja ofert na Otodom, NOE 2.0, Domy.pl i Morizon-Gratka jednym kliknięciem",
        "AI matchmaking — dopasowanie klienta do oferty w skali 0–100",
        "Chatbot RAG na bazie wiedzy agencji (pgvector)",
        "Generator opisów ofert według modelu AIDA",
        "Dyktowana notatka po spotkaniu rozkładana przez AI na dane CRM",
        "Wielonajemcowość z Row Level Security na każdej tabeli",
        "Pięć ról: Owner, Manager, Director, Agent, Assistant",
        "Osobny portal ogłoszeń portal.estalo.pl zsynchronizowany z CRM",
        "Natywne aplikacje iOS (SwiftUI) i Android (Kotlin/Compose)",
      ],
      en: [
        "One-click listing publication to Otodom, NOE 2.0, Domy.pl, and Morizon-Gratka",
        "AI matchmaking — client-to-property fit scored 0-100",
        "RAG chatbot built on the agency's knowledge base (pgvector)",
        "Listing description generator following the AIDA model",
        "Dictated post-meeting notes broken down into CRM records by AI",
        "Multi-tenancy with Row Level Security on every table",
        "Five roles: Owner, Manager, Director, Agent, Assistant",
        "Separate listings portal at portal.estalo.pl synced with the CRM",
        "Native iOS (SwiftUI) and Android (Kotlin/Compose) apps",
      ],
    },
    tags: ["SaaS", "CRM", "AI", "Nieruchomości"],
    accentColor: "#c8a951",
    bgColor: "#1a1a1a",
    year: "2026",
    role: {
      pl: "Programo — własny produkt, projekt i budowa całości",
      en: "Programo — our own product, designed and built end to end",
    },
    screenshots: ["/screenshots/v2/estalo-desktop.webp", "/screenshots/v2/estalo-mobile.webp"],
  },
  {
    slug: "eportal-prawny",
    title: "ePortal Prawny",
    subtitle: {
      pl: "Platforma łącząca klientów z prawnikami — z teczką sprawy i AI",
      en: "A platform connecting clients with lawyers — with a case file and AI",
    },
    description: {
      pl: "Platforma prawnicza budowana równolegle na trzech platformach: web, natywny iOS i natywny Android. Klient opisuje sprawę własnymi słowami, AI porządkuje opis i podpowiada dokumenty, a cała praca nad sprawą toczy się w jednej teczce: dokumenty, czat na żywo i zadania. Dane trzymamy na własnym serwerze w UE.",
      en: "A legal services platform built in parallel on three platforms: web, native iOS, and native Android. The client describes their case in their own words, AI structures the description and suggests documents, and all case work happens in a single case file: documents, live chat, and tasks. Data lives on our own server in the EU.",
    },
    longDescription: {
      pl: "Szukanie prawnika zwykle zaczyna się od chaosu: klient nie wie, jak nazwać swój problem, czego prawnik będzie potrzebował ani od czego zacząć. ePortal Prawny zaczyna dokładnie w tym miejscu. Klient opisuje sytuację własnymi słowami, a dwustopniowy pipeline AI (Claude) klasyfikuje sprawę, wyciąga fakty, daty i kwoty oraz układa checklistę potrzebnych dokumentów. System jest celowo obudowany barierą: dodatkowy klasyfikator pilnuje, żeby AI nigdy nie udzielało porady prawnej, a interfejs mówi to wprost.\n\nPo dopasowaniu prawnika praca przenosi się do teczki sprawy: wspólne dokumenty, czat działający w czasie rzeczywistym, zadania i historia statusów w jednym miejscu, zamiast rozproszenia po mailach i telefonach. Platformę budujemy równolegle w trzech technologiach: web w Next.js, iOS natywnie w SwiftUI i Android natywnie w Kotlinie z Jetpack Compose, wszystkie na wspólnym backendzie.\n\nBackend to self-hosted Supabase na naszym własnym serwerze w Unii Europejskiej. Przy danych tak wrażliwych jak sprawy prawne nie chcieliśmy zależeć od infrastruktury, nad którą nie mamy kontroli. Schemat bazy rozwijaliśmy przez 59 migracji, a po audycie bezpieczeństwa zamknęliśmy wykryte luki w regułach dostępu i pokryliśmy je 37 automatycznymi testami, które pilnują izolacji danych przy każdej zmianie.\n\nProdukt jest przed premierą. Strona z wyszukiwarką prawników i formularzem opisu sprawy działa już publicznie, a obie aplikacje mobilne mają zielone buildy i przygotowanie pod wymogi App Store i Google Play.",
      en: "Finding a lawyer usually starts with chaos: the client doesn't know what to call their problem, what the lawyer will need, or where to begin. ePortal Prawny starts exactly there. The client describes the situation in their own words, and a two-stage AI pipeline (Claude) classifies the case, extracts facts, dates, and amounts, and assembles a checklist of required documents. The system is deliberately fenced in: an additional classifier ensures the AI never gives legal advice, and the interface says so plainly.\n\nOnce a lawyer is matched, the work moves into the case file: shared documents, real-time chat, tasks, and a status history in one place instead of being scattered across emails and phone calls. We are building the platform in parallel across three technologies: web in Next.js, iOS natively in SwiftUI, and Android natively in Kotlin with Jetpack Compose, all on a shared backend.\n\nThe backend is self-hosted Supabase on our own server in the European Union. With data as sensitive as legal cases, we didn't want to depend on infrastructure we don't control. The database schema evolved through 59 migrations, and after a security audit we closed the access-rule gaps it uncovered and covered them with 37 automated tests that guard data isolation on every change.\n\nThe product is pre-launch. The website with a lawyer search and a case description form is already publicly available, and both mobile apps have green builds and are prepared for App Store and Google Play requirements.",
    },
    status: "coming-soon",
    statusLabel: {
      pl: "Premiera wkrótce — strona już publicznie dostępna",
      en: "Launching soon — the website is already publicly available",
    },
    category: "produkty",
    liveUrl: "https://eportalprawny.pl",
    metric: {
      pl: "3 platformy · self-host w UE",
      en: "3 platforms · self-hosted in the EU",
    },
    metrics: [
      { value: "3", label: { pl: "platformy budowane równolegle", en: "platforms built in parallel" } },
      { value: "59", label: { pl: "migracji schematu bazy danych", en: "database schema migrations" } },
      { value: "37", label: { pl: "automatycznych testów izolacji danych", en: "automated data-isolation tests" } },
    ],
    tech: ["Next.js", "TypeScript", "SwiftUI", "Kotlin", "Jetpack Compose", "Supabase (self-host)", "Claude AI", "Tailwind CSS"],
    features: {
      pl: [
        "Opis sprawy własnymi słowami — AI klasyfikuje, wyciąga fakty i układa checklistę dokumentów",
        "Bariera compliance: system nigdy nie udziela porady prawnej i mówi to wprost",
        "Teczka sprawy: dokumenty, czat w czasie rzeczywistym, zadania, historia statusów",
        "Wyszukiwarka prawników według specjalizacji i miasta",
        "Trzy platformy na wspólnym backendzie: web, natywny iOS, natywny Android",
        "Self-hosted Supabase na własnym serwerze w UE",
        "Audyt bezpieczeństwa reguł dostępu zamknięty 37 automatycznymi testami",
      ],
      en: [
        "Case described in plain words — AI classifies it, extracts facts, and builds a document checklist",
        "Compliance barrier: the system never gives legal advice and says so plainly",
        "Case file: documents, real-time chat, tasks, status history",
        "Lawyer search by specialization and city",
        "Three platforms on one shared backend: web, native iOS, native Android",
        "Self-hosted Supabase on our own EU server",
        "Access-rule security audit closed with 37 automated tests",
      ],
    },
    tags: ["Platforma", "AI", "LegalTech"],
    accentColor: "#b8a06a",
    bgColor: "#14120c",
    year: "2026",
    role: {
      pl: "Programo — własny produkt, projekt i budowa całości",
      en: "Programo — our own product, designed and built end to end",
    },
    screenshots: ["/screenshots/v2/eportal-prawny-desktop.webp", "/screenshots/v2/eportal-prawny-mobile.webp"],
  },
  {
    slug: "wks-poznan",
    title: "WKS Poznań",
    subtitle: {
      pl: "Strona klubu sportowego z panelem, którym klub zarządza sam",
      en: "A sports club website with a panel the club manages on its own",
    },
    description: {
      pl: "Pełna przebudowa strony Wielkopolskiego Klubu Sportowego w Poznaniu: ze statycznego HTML na Next.js z bazą Supabase i własnym panelem administracyjnym. Trenerka aktualizuje harmonogram, aktualności, galerię i obozy samodzielnie, bez kontaktu z nami.",
      en: "A complete rebuild of the Wielkopolski Sports Club website in Poznan: from static HTML to Next.js with a Supabase database and a custom admin panel. The coach updates the schedule, news, gallery, and camps herself, with no need to contact us.",
    },
    longDescription: {
      pl: "Poprzednia strona WKS Poznań była zbiorem statycznych plików HTML. Każda zmiana godziny treningu czy nowe zdjęcia z zawodów oznaczały prośbę do kogoś technicznego. Dla klubu z trzema sekcjami (pływanie, pływanie w płetwach, pięciobój nowoczesny) i harmonogramem, który żyje z tygodnia na tydzień, to był stały koszt czasu i cierpliwości.\n\nPrzebudowaliśmy stronę od podstaw na Next.js z bazą Supabase i zbudowaliśmy do niej dedykowany panel administracyjny: aktualności, harmonogram treningów per sekcja i poziom, profile trenerów, galeria, obozy oraz sekcja partnerów i projektów dotacyjnych. Osobnym pomysłem jest cotygodniowy opis, na czym aktualnie skupia się dana grupa treningowa; rodzice widzą go na stronie, a trenerka aktualizuje w panelu w minutę.\n\nZamiast gotowego CMS zbudowaliśmy panel skrojony pod klub, bo generyczne narzędzia wymagałyby od klientki nauki cudzego interfejsu i opłacania funkcji, których nigdy nie użyje. Zapis do bazy chronią reguły Row Level Security ograniczone do konta administratorki, a publiczna część strony jest tylko do odczytu.\n\nStrona działa na wkspoznan.pl i jest na co dzień prowadzona przez klub. Nasza rola po wdrożeniu sprowadza się do drobnych poprawek zgłaszanych mailem, a w stopce żywej strony stoi podpis Programo, który każdy może zweryfikować.",
      en: "The previous WKS Poznan website was a set of static HTML files. Every change to a training time or a new batch of competition photos meant asking someone technical for help. For a club with three sections (swimming, fin swimming, modern pentathlon) and a schedule that shifts week to week, that was a constant tax on time and patience.\n\nWe rebuilt the site from the ground up on Next.js with a Supabase database and built a dedicated admin panel for it: news, a training schedule per section and level, coach profiles, a gallery, camps, and a partners and grants section. A separate idea is the weekly note on what each training group is currently focusing on; parents see it on the site, and the coach updates it in the panel in a minute.\n\nInstead of an off-the-shelf CMS we built a panel tailored to the club, because a generic tool would have forced the client to learn someone else's interface and pay for features she would never use. Database writes are protected by Row Level Security rules limited to the administrator's account, and the public part of the site is read-only.\n\nThe site runs at wkspoznan.pl and is managed day to day by the club. Our post-launch role comes down to small fixes reported by email, and the footer of the live site carries a Programo credit anyone can verify.",
    },
    status: "live",
    statusLabel: {
      pl: "Live na wkspoznan.pl",
      en: "Live at wkspoznan.pl",
    },
    category: "dla-klientow",
    client: {
      pl: "Wielkopolski Klub Sportowy Poznań",
      en: "Wielkopolski Sports Club Poznan",
    },
    liveUrl: "https://wkspoznan.pl",
    metric: {
      pl: "3 sekcje sportowe · własny panel CMS",
      en: "3 sport sections · custom CMS panel",
    },
    metrics: [
      { value: "3", label: { pl: "sekcje sportowe klubu", en: "club sport sections" } },
      { value: "17", label: { pl: "podstron publicznych", en: "public pages" } },
      { value: "8", label: { pl: "modułów panelu administracyjnego", en: "admin panel modules" } },
    ],
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "Vercel"],
    features: {
      pl: [
        "Własny panel administracyjny: aktualności, harmonogram, trenerzy, galeria, obozy, partnerzy",
        "Klub aktualizuje treść samodzielnie — bez udziału wykonawcy",
        "Harmonogram treningów per sekcja, grupa i poziom",
        "Cotygodniowy opis pracy każdej grupy treningowej widoczny dla rodziców",
        "Sekcja partnerów i projektów dotacyjnych (Miasto Poznań, Urząd Marszałkowski)",
        "Row Level Security — zapis do bazy tylko z konta administratorki",
        "Podpis wykonawcy w stopce żywej strony",
      ],
      en: [
        "Custom admin panel: news, schedule, coaches, gallery, camps, partners",
        "The club updates content on its own — no vendor involved",
        "Training schedule per section, group, and level",
        "A weekly note on each training group's focus, visible to parents",
        "Partners and grant projects section (City of Poznan, Marshal's Office)",
        "Row Level Security — database writes only from the administrator's account",
        "Vendor credit in the footer of the live site",
      ],
    },
    tags: ["Sport", "Web", "CMS"],
    accentColor: "#c41e3a",
    bgColor: "#1a0a0a",
    year: "2026",
    role: {
      pl: "Programo — projekt, budowa i wdrożenie",
      en: "Programo — design, build, and deployment",
    },
    screenshots: ["/screenshots/v2/wks-poznan-desktop.webp", "/screenshots/v2/wks-poznan-mobile.webp"],
  },
  {
    slug: "skup-nieruchomosci",
    title: "Skup Nieruchomości",
    subtitle: {
      pl: "Kompletny lejek pozyskiwania klientów: strona, tracking i kampania Google Ads",
      en: "A complete lead funnel: website, tracking, and a Google Ads campaign",
    },
    description: {
      pl: "Serwis skupnieruchomoscipl.pl zbudowany pod jeden cel: telefon od właściciela nieruchomości w trudnej sytuacji. Sześć podstron dopasowanych do treści reklam, dwukrokowy widżet oddzwonienia, pełny pomiar konwersji (GA4, enhanced conversions, Meta Pixel, Consent Mode v2) i kampania Google Ads zbudowana oraz zoptymalizowana przez nas.",
      en: "The skupnieruchomoscipl.pl site built for a single goal: a phone call from a property owner in a difficult situation. Six pages matched to ad copy, a two-step callback widget, full conversion measurement (GA4, enhanced conversions, Meta Pixel, Consent Mode v2), and a Google Ads campaign we built and optimized.",
    },
    longDescription: {
      pl: "Właściciel mieszkania z lokatorem albo odziedziczonych udziałów w nieruchomości nie szuka ładnej strony, tylko kogoś, kto oddzwoni i powie, co dalej. Ten projekt zaczyna się od tej obserwacji i konsekwentnie podporządkowuje jej wszystko: treść, formularz i kampanię reklamową.\n\nZbudowaliśmy stronę główną oraz sześć podstron problemowych (lokator, spadek, udziały, długi i hipoteka, komornik, rozwód), z których każda odpowiada osobnej grupie reklam, więc obietnica z reklamy zgadza się co do słowa z treścią strony. Zamiast długiego formularza wyceny działa dwukrokowy widżet: wybór sytuacji jednym dotknięciem, potem sam numer telefonu. Pod spodem pracuje pełny pomiar: GA4, konwersje Google Ads z enhanced conversions, Meta Pixel, Consent Mode v2 z banerem zgód oraz własny zapis zdarzeń lejka w bazie Postgres, od wyświetlenia formularza po utworzenie leada.\n\nNajciekawsza decyzja w projekcie wzięła się z naszych własnych danych. Pierwsza wersja miała klasyczny formularz wyceny; analityka pokazała, że użytkownicy klikają w kafelki sytuacji, ale formularza nie kończą. Przebudowaliśmy lejek wokół tego zachowania. To samo podejście dotyczy techniki: atrybucja first-touch doklejana do każdego zgłoszenia, klucz idempotencji chroniący przed duplikatami i limit zapytań na API.\n\nCałość działa produkcyjnie razem z lekkim panelem CRM dla odbiorcy leadów i powiadomieniami e-mail oraz push o każdym zgłoszeniu. Kampanię Google Ads zbudowaliśmy, przepięliśmy na podstrony problemowe i zoptymalizowaliśmy, m.in. listą około stu fraz wykluczających.",
      en: "The owner of a flat with a sitting tenant or of inherited property shares isn't looking for a pretty website. They're looking for someone who will call back and say what happens next. This project starts from that observation and subordinates everything to it: the copy, the form, and the ad campaign.\n\nWe built the homepage and six problem-specific pages (tenant, inheritance, shares, debt and mortgage, bailiff, divorce), each matching its own ad group, so the promise in the ad matches the page word for word. Instead of a long valuation form there is a two-step callback widget: pick your situation with one tap, then leave just a phone number. Underneath runs full measurement: GA4, Google Ads conversions with enhanced conversions, Meta Pixel, Consent Mode v2 with a consent banner, and our own funnel event log in Postgres, from form view to lead creation.\n\nThe most interesting decision in the project came from our own data. The first version had a classic valuation form; analytics showed users tapping the situation tiles but never finishing the form. We rebuilt the funnel around that behavior. The same discipline applies to the engineering: first-touch attribution attached to every submission, an idempotency key preventing duplicates, and rate limiting on the API.\n\nEverything runs in production, together with a lightweight CRM panel for the lead recipient and email plus push notifications for every submission. We built the Google Ads campaign, pointed it at the problem pages, and optimized it, including a list of roughly one hundred negative keywords.",
    },
    status: "live",
    statusLabel: {
      pl: "Live na skupnieruchomoscipl.pl",
      en: "Live at skupnieruchomoscipl.pl",
    },
    category: "dla-klientow",
    client: {
      pl: "Firma skupująca nieruchomości",
      en: "A property-buying company",
    },
    scope: {
      pl: "Pełny zakres: strona, treść, tracking konwersji i budowa kampanii Google Ads",
      en: "Full scope: website, copy, conversion tracking, and Google Ads campaign build",
    },
    liveUrl: "https://skupnieruchomoscipl.pl",
    metric: {
      pl: "6 podstron pod reklamy · pełny tracking konwersji",
      en: "6 ad-matched pages · full conversion tracking",
    },
    metrics: [
      { value: "6", label: { pl: "podstron dopasowanych do grup reklam", en: "pages matched to ad groups" } },
      { value: "2", label: { pl: "kroki widżetu oddzwonienia", en: "callback widget steps" } },
      { value: "11", label: { pl: "zdarzeń własnego lejka analitycznego", en: "events in the custom analytics funnel" } },
      { value: "~100", label: { pl: "fraz wykluczających w kampanii", en: "negative keywords in the campaign" } },
    ],
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Neon Postgres", "Resend", "GA4", "Google Ads", "Meta Pixel", "Consent Mode v2"],
    features: {
      pl: [
        "Dwukrokowy widżet oddzwonienia: sytuacja jednym dotknięciem, potem tylko numer telefonu",
        "6 podstron problemowych zgodnych co do słowa z treścią reklam",
        "GA4 + konwersje Google Ads z enhanced conversions + Meta Pixel",
        "Consent Mode v2 — żaden piksel nie startuje bez zgody użytkownika",
        "Własny zapis lejka w Postgres: od wyświetlenia formularza po utworzenie leada",
        "Przebudowa lejka na podstawie danych z własnej analityki, nie domysłów",
        "Lekki panel CRM z leadami, statusami i notatkami",
        "Idempotencja zgłoszeń i limit zapytań na API",
        "Kampania Google Ads zbudowana i zoptymalizowana przez nas",
      ],
      en: [
        "Two-step callback widget: pick a situation with one tap, then just a phone number",
        "6 problem pages matching ad copy word for word",
        "GA4 + Google Ads conversions with enhanced conversions + Meta Pixel",
        "Consent Mode v2 — no pixel fires without user consent",
        "Custom funnel log in Postgres: from form view to lead creation",
        "Funnel rebuilt on our own analytics data, not guesswork",
        "Lightweight CRM panel with leads, statuses, and notes",
        "Idempotent submissions and API rate limiting",
        "Google Ads campaign built and optimized by us",
      ],
    },
    tags: ["Lead generation", "Google Ads", "Tracking", "Web"],
    accentColor: "#3f8f5f",
    bgColor: "#0a1a10",
    year: "2026",
    role: {
      pl: "Programo — strona, tracking i kampania end-to-end",
      en: "Programo — website, tracking, and campaign end to end",
    },
    screenshots: ["/screenshots/v2/skup-nieruchomosci-desktop.webp", "/screenshots/v2/skup-nieruchomosci-mobile.webp"],
  },
  {
    slug: "rejestr-pro",
    title: "Rejestr Pro",
    subtitle: {
      pl: "Wyszukiwarka firm z KRS na wyłącznie oficjalnych danych",
      en: "A KRS company search engine built exclusively on official data",
    },
    description: {
      pl: "Wyszukiwarka polskich firm po nazwie, numerze KRS, NIP i REGON. Dane wyłącznie z oficjalnego API Ministerstwa Sprawiedliwości, własny indeks wyszukiwania w Postgres, powiązania osób między spółkami i sprawdzanie Białej Listy VAT. Web działa produkcyjnie, aplikacja iOS istnieje jako wersja podglądowa.",
      en: "A search engine for Polish companies by name, KRS number, NIP, and REGON. Data sourced exclusively from the official Ministry of Justice API, a custom search index in Postgres, people connections across companies, and VAT Whitelist checks. The web app runs in production; the iOS app exists as a preview build.",
    },
    longDescription: {
      pl: "Zanim podpiszesz umowę z nową firmą, warto wiedzieć, kto za nią stoi. Rejestr Pro odpowiada na to pytanie: wpisujesz nazwę, KRS, NIP albo REGON i dostajesz profil spółki z oficjalnego odpisu, listę osób w zarządzie i radzie oraz inne firmy, z którymi te osoby są powiązane. Do tego sprawdzenie kontrahenta na Białej Liście VAT razem z rachunkami bankowymi i walidatory NIP i REGON.\n\nNajważniejsza decyzja w projekcie jest prawna, nie techniczna: korzystamy wyłącznie z oficjalnego, otwartego API Ministerstwa Sprawiedliwości i publicznego API Ministerstwa Finansów. Zero scrapingu, zero obchodzenia zabezpieczeń. Zamiast liczb finansowych, których oficjalne API nie udostępnia, pokazujemy wzmianki o złożonych sprawozdaniach i link do rządowego repozytorium dokumentów. Wolimy mniej danych niż dane wątpliwego pochodzenia.\n\nPod spodem działa własna warstwa inżynierska: indeks wyszukiwania w Postgres z dopasowaniem trigramowym, dzięki któremu literówka w nazwie spółki nie kończy wyszukiwania, oraz tabela powiązań osób budowana z odpisów KRS. Publiczne, udokumentowane API serwisu z limitem zapytań obsługuje jednocześnie stronę i natywną aplikację iOS w SwiftUI, utrzymaną w tym samym neobrutalistycznym stylu co web. Koszt infrastruktury całości: zero złotych miesięcznie.\n\nWersja webowa działa produkcyjnie z SSR i danymi strukturalnymi pod SEO, nagłówkami bezpieczeństwa i 23 testami automatycznymi; aplikacja iOS ma kolejnych 20 i pozostaje na razie wersją wewnętrzną, poza App Store.",
      en: "Before you sign a contract with a new company, it pays to know who is behind it. Rejestr Pro answers that question: type a name, KRS, NIP, or REGON and you get the company profile from the official registry extract, the people on its board, and the other companies those people are connected to. Plus a VAT Whitelist check with bank account numbers, and NIP and REGON validators.\n\nThe most important decision in this project is legal, not technical: we use only the official, open Ministry of Justice API and the public Ministry of Finance API. No scraping, no bypassing protections. Instead of financial figures, which the official API does not provide, we show filing mentions and a link to the government document repository. We would rather show less data than data of questionable origin.\n\nUnderneath runs our own engineering layer: a Postgres search index with trigram matching, so a typo in a company name doesn't kill the search, and a people-connections table built from KRS extracts. The service's public, documented, rate-limited API serves both the website and a native SwiftUI iOS app, kept in the same neo-brutalist style as the web. Infrastructure cost for the whole thing: zero per month.\n\nThe web version runs in production with SSR and structured data for SEO, security headers, and 23 automated tests; the iOS app has 20 more and remains an internal preview build, outside the App Store for now.",
    },
    status: "live",
    statusLabel: {
      pl: "Web live; aplikacja iOS w wersji podglądowej",
      en: "Web live; iOS app as a preview build",
    },
    category: "produkty",
    liveUrl: "https://rejestr-pro.vercel.app",
    metric: {
      pl: "Nazwa · KRS · NIP · REGON — oficjalne dane",
      en: "Name · KRS · NIP · REGON — official data",
    },
    metrics: [
      { value: "4", label: { pl: "kryteria wyszukiwania firm", en: "company search criteria" } },
      { value: "100%", label: { pl: "danych z oficjalnych API państwowych", en: "of data from official state APIs" } },
      { value: "43", label: { pl: "testy automatyczne (web + iOS)", en: "automated tests (web + iOS)" } },
      { value: "0 zł", label: { pl: "miesięczny koszt infrastruktury", en: "monthly infrastructure cost" } },
    ],
    tech: ["Next.js", "TypeScript", "React", "Neon Postgres", "pg_trgm", "SwiftUI", "Vercel", "API KRS", "API MF"],
    features: {
      pl: [
        "Wyszukiwanie firm po nazwie, numerze KRS, NIP i REGON",
        "Profile spółek z oficjalnego odpisu KRS",
        "Powiązania osób: zarządy, rady nadzorcze, prokurenci między firmami",
        "Biała Lista VAT z rachunkami bankowymi kontrahenta",
        "Wyszukiwanie odporne na literówki (indeks trigramowy w Postgres)",
        "Publiczne, udokumentowane API z limitem zapytań",
        "Wyłącznie oficjalne źródła danych — bez scrapingu",
        "Natywna aplikacja iOS (SwiftUI) na tym samym API",
      ],
      en: [
        "Company search by name, KRS number, NIP, and REGON",
        "Company profiles from the official KRS extract",
        "People connections: boards, supervisory boards, proxies across companies",
        "VAT Whitelist check with the counterparty's bank accounts",
        "Typo-tolerant search (trigram index in Postgres)",
        "Public, documented, rate-limited API",
        "Official data sources only — no scraping",
        "Native iOS app (SwiftUI) on the same API",
      ],
    },
    tags: ["Platforma", "Dane", "Web"],
    accentColor: "#0ea5e9",
    bgColor: "#0a1a24",
    year: "2026",
    role: {
      pl: "Programo — własny produkt, projekt i budowa całości",
      en: "Programo — our own product, designed and built end to end",
    },
    screenshots: ["/screenshots/v2/rejestr-pro-desktop.webp", "/screenshots/v2/rejestr-pro-mobile.webp"],
  },
  {
    slug: "solvio",
    title: "Solvio",
    subtitle: {
      pl: "Finanse osobiste i firmowe — od zdjęcia paragonu do raportu",
      en: "Personal and business finance — from a receipt photo to a report",
    },
    description: {
      pl: "Aplikacja do zarządzania wydatkami: zdjęcie paragonu zamienia się w skategoryzowane pozycje (OCR + AI), transakcje z banku wchodzą automatycznie przez PSD2, wydatki grupowe rozliczają się same, a raporty wychodzą w CSV, PDF i DOCX. Natywna aplikacja iOS plus wersja webowa. Tworzona we współpracy z PBDevs (Filip Piątek).",
      en: "An expense management app: a receipt photo becomes categorized line items (OCR + AI), bank transactions flow in automatically via PSD2, group expenses settle themselves, and reports export to CSV, PDF, and DOCX. A native iOS app plus a web version. Built in collaboration with PBDevs (Filip Piątek).",
    },
    longDescription: {
      pl: "Paragon jest najuczciwszym dokumentem finansowym, jaki dostajesz, i jednocześnie tym, którego nikt nie chce przepisywać. Solvio zaczyna od tego: robisz zdjęcie, OCR (Azure Document Intelligence) wyciąga pozycje i kwoty, AI przypisuje kategorie, a wydatek ląduje w budżecie bez klawiatury. Do tego dochodzi import transakcji prosto z konta bankowego przez PSD2 (GoCardless), więc obraz wydatków jest kompletny, nie wybiórczy.\n\nNa tej podstawie aplikacja robi rzeczy, które zwykle wymagają arkusza kalkulacyjnego i cierpliwości: budżety miesięczne per kategoria, podział wydatków w grupach z prośbami o zwrot, cele oszczędnościowe, AI-owy audyt zakupowy i porównywanie cen produktów. Raporty generują się w trzech formatach (CSV, PDF, DOCX), a cały interfejs działa po polsku i angielsku.\n\nGłówną platformą jest natywna aplikacja iOS w SwiftUI z ponad dwudziestoma modułami, bo paragony skanuje się telefonem, nie laptopem. Wersja webowa (Next.js, Neon Postgres, Drizzle) pełni rolę zaplecza i uzupełnienia. Solvio rozwijamy we współpracy z PBDevs Filipa Piątka; to wspólna praca dwóch zespołów widoczna w historii projektu, nie podwykonawstwo.\n\nProdukt jest w aktywnym rozwoju i nie jest jeszcze dostępny publicznie w App Store.",
      en: "A receipt is the most honest financial document you get, and also the one nobody wants to retype. Solvio starts there: you take a photo, OCR (Azure Document Intelligence) extracts the line items and amounts, AI assigns categories, and the expense lands in your budget without touching a keyboard. Add automatic bank transaction imports via PSD2 (GoCardless), and the picture of your spending is complete rather than selective.\n\nOn that foundation the app does the things that usually require a spreadsheet and patience: monthly budgets per category, group expense splitting with payment requests, savings goals, an AI shopping audit, and product price comparison. Reports generate in three formats (CSV, PDF, DOCX), and the whole interface works in Polish and English.\n\nThe primary platform is a native SwiftUI iOS app with more than twenty modules, because receipts get scanned with a phone, not a laptop. The web version (Next.js, Neon Postgres, Drizzle) serves as the backend and a companion. We are building Solvio in collaboration with Filip Piątek's PBDevs; it is joint work between two teams, visible in the project's history, not subcontracting.\n\nThe product is in active development and is not yet publicly available on the App Store.",
    },
    status: "development",
    statusLabel: {
      pl: "W rozwoju — tworzony we współpracy z PBDevs (Filip Piątek)",
      en: "In development — built in collaboration with PBDevs (Filip Piątek)",
    },
    category: "produkty",
    partner: "PBDevs (Filip Piątek)",
    liveUrl: "https://solvio-lac.vercel.app",
    metric: {
      pl: "OCR paragonów · import bankowy PSD2 · iOS + web",
      en: "Receipt OCR · PSD2 bank import · iOS + web",
    },
    metrics: [
      { value: "20+", label: { pl: "modułów aplikacji iOS", en: "iOS app modules" } },
      { value: "3", label: { pl: "formaty raportów: CSV, PDF, DOCX", en: "report formats: CSV, PDF, DOCX" } },
      { value: "2", label: { pl: "języki interfejsu: polski i angielski", en: "interface languages: Polish and English" } },
    ],
    tech: ["SwiftUI", "Next.js", "TypeScript", "Neon Postgres", "Drizzle", "Azure Document Intelligence", "Azure OpenAI", "GoCardless (PSD2)", "Vercel Blob"],
    features: {
      pl: [
        "Skanowanie paragonów: OCR wyciąga pozycje i kwoty, AI nadaje kategorie",
        "Import transakcji z konta bankowego przez PSD2 (GoCardless)",
        "Budżety miesięczne per kategoria wydatków",
        "Podział wydatków w grupach z prośbami o zwrot",
        "AI-owy audyt zakupowy i porównywanie cen produktów",
        "Raporty finansowe w CSV, PDF i DOCX",
        "Natywna aplikacja iOS (SwiftUI, 20+ modułów) + wersja webowa",
        "Pełna dwujęzyczność PL/EN",
      ],
      en: [
        "Receipt scanning: OCR extracts line items and amounts, AI assigns categories",
        "Bank transaction import via PSD2 (GoCardless)",
        "Monthly budgets per spending category",
        "Group expense splitting with payment requests",
        "AI shopping audit and product price comparison",
        "Financial reports in CSV, PDF, and DOCX",
        "Native iOS app (SwiftUI, 20+ modules) + web version",
        "Fully bilingual PL/EN",
      ],
    },
    tags: ["SaaS", "AI", "Fintech"],
    accentColor: "#5b8def",
    bgColor: "#0f1730",
    year: "2026",
    role: {
      pl: "Programo we współpracy z PBDevs (Filip Piątek)",
      en: "Programo in collaboration with PBDevs (Filip Piątek)",
    },
    screenshots: ["/screenshots/v2/solvio-desktop.webp", "/screenshots/v2/solvio-mobile.webp"],
  },
  {
    slug: "wsafefinanse",
    title: "W. Safe Finance",
    subtitle: {
      pl: "Strona doradcy finansowego, w której lead nie czeka w skrzynce",
      en: "A financial advisor's website where leads don't sit in an inbox",
    },
    description: {
      pl: "Strona firmowa doradztwa finansowego W. Safe Finance: oferta kredytów hipotecznych, gotówkowych i firmowych, leasingów oraz ubezpieczeń. Zapytanie z formularza trafia jednocześnie na e-mail i jako powiadomienie push na Telegram, więc właścicielka może zareagować w kilka minut. Dwie wersje językowe i ciemny motyw jako domyślny.",
      en: "The company website of financial advisory W. Safe Finance: mortgages, cash and business loans, leasing, and insurance. A form inquiry lands simultaneously in the inbox and as a Telegram push notification, so the owner can react within minutes. Two language versions and a dark theme by default.",
    },
    longDescription: {
      pl: "W doradztwie finansowym o zleceniu często decyduje to, kto pierwszy oddzwoni. Dlatego w tym projekcie najważniejszy element jest niewidoczny: zapytanie z formularza wysyła się dwoma kanałami naraz, na firmowy e-mail i jako natychmiastowe powiadomienie na Telegram. Doradczyni widzi nowe zapytanie na telefonie w momencie jego wysłania, nie przy wieczornym sprawdzaniu skrzynki.\n\nSama strona prezentuje pełną ofertę W. Safe Finance: kredyty hipoteczne jako produkt flagowy, kredyty gotówkowe i firmowe, leasingi oraz ubezpieczenia, wraz z formularzem kontaktowym i wymaganą zgodą RODO. Świadomie odwróciliśmy branżowy standard wizualny: zamiast jasnego, korporacyjnego szablonu strona domyślnie działa w ciemnym motywie, z opcją przełączenia na jasny. Do tego pełne wersje polska i angielska.\n\nTechnicznie to Next.js z TypeScriptem i Tailwindem, formularz z walidacją Zod i limitem zapytań chroniącym przed spamem, e-mail transakcyjny przez Resend i Telegram Bot API do powiadomień. Rozwiązanie powiadomień z tego projektu stało się naszym wewnętrznym wzorcem, do którego wracamy przy kolejnych stronach nastawionych na leady.\n\nStrona działa produkcyjnie na wsafefinance.pl i na co dzień obsługuje zapytania klientów doradczyni.",
      en: "In financial advisory, the deal often goes to whoever calls back first. That is why the most important part of this project is invisible: a form inquiry goes out through two channels at once, to the company inbox and as an instant Telegram push notification. The advisor sees a new inquiry on her phone the moment it is sent, not during an evening inbox check.\n\nThe site itself presents the full W. Safe Finance offer: mortgages as the flagship product, cash and business loans, leasing, and insurance, along with a contact form and the required GDPR consent. We deliberately inverted the industry's visual standard: instead of a bright corporate template, the site runs in a dark theme by default, with a light-mode toggle. Full Polish and English versions round it out.\n\nTechnically it is Next.js with TypeScript and Tailwind, a form with Zod validation and rate limiting against spam, transactional email via Resend, and the Telegram Bot API for notifications. The notification setup from this project became our internal reference pattern, one we return to on every lead-focused site since.\n\nThe site runs in production at wsafefinance.pl and handles the advisor's client inquiries daily.",
    },
    status: "live",
    statusLabel: {
      pl: "Live na wsafefinance.pl",
      en: "Live at wsafefinance.pl",
    },
    category: "dla-klientow",
    client: {
      pl: "W. Safe Finance, Rokietnica",
      en: "W. Safe Finance, Rokietnica",
    },
    liveUrl: "https://www.wsafefinance.pl",
    metric: {
      pl: "Lead w 2 kanałach · PL/EN",
      en: "Leads in 2 channels · PL/EN",
    },
    metrics: [
      { value: "2", label: { pl: "kanały powiadomień o zapytaniu: e-mail i Telegram", en: "inquiry notification channels: email and Telegram" } },
      { value: "2", label: { pl: "pełne wersje językowe", en: "full language versions" } },
      { value: "5", label: { pl: "linii usług w ofercie", en: "service lines in the offer" } },
    ],
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Zod", "Resend", "Telegram Bot API", "Vercel"],
    features: {
      pl: [
        "Zapytanie z formularza jednocześnie na e-mail i push na Telegram",
        "Formularz z walidacją Zod i limitem zapytań przeciw spamowi",
        "Ciemny motyw jako domyślny z przełącznikiem na jasny",
        "Pełne wersje polska i angielska",
        "Prezentacja oferty: hipoteki, kredyty, leasingi, ubezpieczenia",
        "Zgody RODO wpięte w proces wysyłki formularza",
      ],
      en: [
        "Form inquiries sent to email and Telegram push at the same time",
        "Form with Zod validation and anti-spam rate limiting",
        "Dark theme by default with a light-mode toggle",
        "Full Polish and English versions",
        "Offer presentation: mortgages, loans, leasing, insurance",
        "GDPR consents wired into the form submission flow",
      ],
    },
    tags: ["Finanse", "Web", "Lead generation"],
    accentColor: "#2563eb",
    bgColor: "#0a1025",
    year: "2026",
    role: {
      pl: "Programo — projekt, budowa i wdrożenie",
      en: "Programo — design, build, and deployment",
    },
    screenshots: ["/screenshots/v2/wsafefinanse-desktop.webp", "/screenshots/v2/wsafefinanse-mobile.webp"],
  },
  {
    slug: "domki-poznaniak",
    title: "Domki Poznaniak",
    subtitle: {
      pl: "Tracking konwersji i kampania Google Ads na istniejącej stronie klienta",
      en: "Conversion tracking and a Google Ads campaign on the client's existing website",
    },
    description: {
      pl: "Domki letniskowe nad morzem w Wiciu. Strony nie budowaliśmy — weszliśmy na istniejący WordPress klienta, wpięliśmy GA4 i śledzenie konwersji Google Ads z enhanced conversions, a następnie zbudowaliśmy i prowadzimy kampanię reklamową: budżet z twardym limitem, harmonogram emisji, korekty geograficzne i systematyczne czyszczenie fraz.",
      en: "Seaside holiday cabins in Wicie. We didn't build the website — we stepped into the client's existing WordPress, wired up GA4 and Google Ads conversion tracking with enhanced conversions, then built and now run the ad campaign: a hard-capped budget, an ad schedule, geographic adjustments, and systematic keyword pruning.",
    },
    longDescription: {
      pl: "Nie każda współpraca zaczyna się od budowy strony. Domki Poznaniak, wynajem drewnianych domków letniskowych dziesięć minut spacerem od plaży w Wiciu, miały już działającą stronę na WordPressie. Brakowało dwóch rzeczy: wiedzy, skąd przychodzą rezerwacje, i reklam, które nie przepalają budżetu.\n\nZaczęliśmy od pomiaru, bo prowadzenie kampanii bez niego to zgadywanie. Na istniejącej stronie wpięliśmy Google Analytics 4 oraz tag konwersji Google Ads z włączonymi enhanced conversions, tak żeby każda złotówka wydana na reklamę miała policzalny skutek. Wszystko działa w zgodzie z systemem zgód cookie, który już był na stronie.\n\nNa tej podstawie zbudowaliśmy kampanię Google Ads i prowadzimy ją operacyjnie: dzienny budżet z twardym miesięcznym limitem, emisja tylko w godzinach, w których ludzie realnie rezerwują, korekty stawek geograficzne i mobilne, rozszerzenia reklam oraz stale rosnąca lista około stu fraz wykluczających, która odsiewa ruch bez intencji rezerwacji. Frazy, które nie pracują, wstrzymujemy zamiast liczyć, że kiedyś zaskoczą.\n\nTen projekt pokazuje zakres, o którym rzadko piszą software house'y: potrafimy wejść na cudzą stronę, dołożyć pomiar i wziąć odpowiedzialność za kampanię, bez namawiania klienta na przebudowę czegoś, co działa.",
      en: "Not every engagement starts with building a website. Domki Poznaniak, a rental of wooden holiday cabins a ten-minute walk from the beach in Wicie, already had a working WordPress site. Two things were missing: knowing where bookings come from, and ads that don't burn the budget.\n\nWe started with measurement, because running a campaign without it is guessing. On the existing site we wired up Google Analytics 4 and the Google Ads conversion tag with enhanced conversions enabled, so that every zloty spent on advertising has a countable outcome. Everything works within the cookie consent system that was already on the site.\n\nOn that foundation we built the Google Ads campaign and run it operationally: a daily budget with a hard monthly cap, ads shown only during the hours people actually book, geographic and mobile bid adjustments, ad extensions, and a steadily growing list of about one hundred negative keywords filtering out traffic with no intent to book. Keywords that don't perform get paused rather than kept on hope.\n\nThis project shows a scope software studios rarely write about: we can step into someone else's website, add measurement, and take responsibility for the campaign, without talking the client into rebuilding something that works.",
    },
    status: "live",
    statusLabel: {
      pl: "Tracking i kampania Google Ads w prowadzeniu",
      en: "Tracking and Google Ads campaign under management",
    },
    category: "marketing",
    client: {
      pl: "Domki Poznaniak, Wicie",
      en: "Domki Poznaniak, Wicie",
    },
    scope: {
      pl: "Wyłącznie tracking i kampania Google Ads — strona klienta istniała wcześniej i nie jest naszym dziełem",
      en: "Tracking and Google Ads campaign only — the client's website existed before and is not our work",
    },
    liveUrl: "https://domkipoznaniak.pl",
    metric: {
      pl: "GA4 + enhanced conversions · kampania w prowadzeniu",
      en: "GA4 + enhanced conversions · campaign under management",
    },
    metrics: [
      { value: "~100", label: { pl: "fraz wykluczających w kampanii", en: "negative keywords in the campaign" } },
      { value: "15", label: { pl: "nagłówków reklam w rotacji", en: "ad headlines in rotation" } },
    ],
    tech: ["GA4", "Google Ads", "Enhanced conversions", "gtag.js"],
    features: {
      pl: [
        "GA4 i tag konwersji Google Ads wpięte na istniejącej stronie WordPress",
        "Enhanced conversions — dokładniejsze przypisanie rezerwacji do reklam",
        "Budżet dzienny z twardym limitem miesięcznym",
        "Harmonogram emisji reklam dopasowany do godzin rezerwacji",
        "Korekty stawek geograficzne i mobilne",
        "Systematyczne czyszczenie fraz: wykluczenia i wstrzymywanie słabych słów kluczowych",
      ],
      en: [
        "GA4 and the Google Ads conversion tag wired into the existing WordPress site",
        "Enhanced conversions — more accurate attribution of bookings to ads",
        "Daily budget with a hard monthly cap",
        "Ad schedule matched to booking hours",
        "Geographic and mobile bid adjustments",
        "Systematic keyword pruning: negatives and pausing weak keywords",
      ],
    },
    tags: ["Google Ads", "Tracking", "Marketing"],
    accentColor: "#d97706",
    bgColor: "#1a1206",
    year: "2026",
    role: {
      pl: "Programo — tracking konwersji i prowadzenie kampanii Google Ads",
      en: "Programo — conversion tracking and Google Ads campaign management",
    },
    screenshots: ["/screenshots/v2/domki-poznaniak-desktop.webp", "/screenshots/v2/domki-poznaniak-mobile.webp"],
  },
  {
    slug: "pooltimer",
    title: "PoolTimer",
    subtitle: {
      pl: "System pomiaru czasu dla klubów pływackich — od hardware'u po aplikacje",
      en: "A timing system for swimming clubs — from hardware to apps",
    },
    description: {
      pl: "Własny sprzęt pomiarowy na ESP32 z precyzją milisekundową, panel trenera i zawodnika w przeglądarce oraz natywne aplikacje iOS i Android w budowie. Panel webowy jest już używany produkcyjnie przez realny klub pływacki w ramach pilotażu.",
      en: "Our own ESP32-based timing hardware with millisecond precision, coach and swimmer web panels, and native iOS and Android apps in the works. The web panel is already used in production by a real swimming club as part of a pilot.",
    },
    longDescription: {
      pl: "Na większości treningów pływackich czas wciąż mierzy się stoperem, a wyniki zapisuje na kartce, która potem ginie między basenem a Excelem. PoolTimer to nasza odpowiedź na cały ten obieg: sprzęt, który mierzy, i oprogramowanie, które te pomiary zamienia w wiedzę trenera.\n\nWarstwa sprzętowa to touchpady i centralny moduł zbudowane na ESP32, komunikujące się radiowo przez ESP-NOW, z pomiarem o precyzji milisekundowej i integracją z pasami tętna Polar przez Bluetooth. System stawia własną lokalną sieć WiFi, więc działa na obiekcie bez internetu, z tablicą wyników na telewizorze włącznie. Firmware jest napisany i wgrany na fizyczne urządzenia; integracja pomiarów z chmurą to kolejny etap prac.\n\nWarstwa software'owa działa już produkcyjnie: panel trenera (plany treningowe z parserem tekstu, obecność, obciążenia, raporty CSV) i panel zawodnika na Next.js z bazą Supabase w europejskim regionie, z szyfrowaniem danych wrażliwych i izolacją danych każdego klubu na poziomie bazy. Równolegle budujemy natywne aplikacje trenera: iOS w SwiftUI i Android w Kotlinie z Compose, obie z zielonymi buildami i łącznie ponad 700 testami automatycznymi w całym projekcie.\n\nZ panelu korzysta na co dzień realny klub pływacki w ramach pilotażu, na prawdziwych danych swoich zawodników. To dla nas ważniejsze niż niejedna metryka: produkt jest kształtowany przez trenera przy basenie, nie przez nasze wyobrażenie o nim.",
      en: "At most swim practices, time is still measured with a stopwatch and written on a sheet of paper that then gets lost somewhere between the pool and a spreadsheet. PoolTimer is our answer to that entire loop: hardware that measures, and software that turns those measurements into something a coach can use.\n\nThe hardware layer is a set of touchpads and a central unit built on ESP32, communicating over ESP-NOW radio, with millisecond-precision timing and Polar heart-rate strap integration over Bluetooth. The system spins up its own local WiFi network, so it works at a venue with no internet, TV scoreboard included. The firmware is written and flashed onto physical devices; syncing measurements to the cloud is the next stage of work.\n\nThe software layer is already in production: a coach panel (training plans with a text parser, attendance, load tracking, CSV reports) and a swimmer panel on Next.js with a Supabase database in an EU region, with sensitive-data encryption and per-club data isolation at the database level. In parallel we are building native coach apps: iOS in SwiftUI and Android in Kotlin with Compose, both with green builds and over 700 automated tests across the whole project.\n\nA real swimming club uses the panel daily as part of a pilot, with its athletes' real data. That matters more to us than most metrics: the product is being shaped by a coach at the pool, not by our idea of one.",
    },
    status: "development",
    statusLabel: {
      pl: "W rozwoju — pilotaż z realnym klubem pływackim",
      en: "In development — piloting with a real swimming club",
    },
    category: "produkty",
    liveUrl: "https://swimplatform.vercel.app",
    metric: {
      pl: "Hardware + web + iOS + Android · pilotaż w klubie",
      en: "Hardware + web + iOS + Android · club pilot",
    },
    metrics: [
      { value: "4", label: { pl: "platformy: hardware, web, iOS, Android", en: "platforms: hardware, web, iOS, Android" } },
      { value: "700+", label: { pl: "testów automatycznych w projekcie", en: "automated tests across the project" } },
      { value: "1", label: { pl: "realny klub w pilotażu produkcyjnym", en: "real club in a production pilot" } },
    ],
    tech: ["ESP32", "ESP-NOW", "BLE (Polar)", "Next.js", "Supabase", "SwiftUI", "Kotlin", "Jetpack Compose", "WebSocket"],
    features: {
      pl: [
        "Touchpady i centralny moduł na ESP32 z pomiarem o precyzji milisekundowej",
        "Działa bez internetu na obiekcie — własna lokalna sieć i tablica wyników na TV",
        "Tętno na żywo z pasów Polar przez Bluetooth",
        "Panel trenera: plany treningowe, obecność, obciążenia, raporty CSV",
        "Panel zawodnika z planem dnia i wynikami",
        "Szyfrowanie danych wrażliwych i izolacja danych klubów na poziomie bazy",
        "Natywne aplikacje trenera na iOS i Android w budowie",
        "Pilotaż produkcyjny z realnym klubem pływackim",
      ],
      en: [
        "ESP32 touchpads and a central unit with millisecond-precision timing",
        "Works with no venue internet — its own local network and a TV scoreboard",
        "Live heart rate from Polar straps over Bluetooth",
        "Coach panel: training plans, attendance, load tracking, CSV reports",
        "Swimmer panel with the day's plan and results",
        "Sensitive-data encryption and per-club data isolation at the database level",
        "Native coach apps for iOS and Android in the works",
        "Production pilot with a real swimming club",
      ],
    },
    tags: ["Hardware", "SaaS", "Sport"],
    accentColor: "#0b59db",
    bgColor: "#07172d",
    year: "2026",
    role: {
      pl: "Programo — hardware, oprogramowanie i wdrożenie pilotażowe",
      en: "Programo — hardware, software, and the pilot deployment",
    },
    screenshots: ["/screenshots/v2/pooltimer-desktop.webp", "/screenshots/v2/pooltimer-mobile.webp"],
  },
];

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getAdjacentProjects(slug: string): { prev: Project | null; next: Project | null } {
  const index = projects.findIndex((p) => p.slug === slug);
  return {
    prev: index > 0 ? projects[index - 1] : null,
    next: index < projects.length - 1 ? projects[index + 1] : null,
  };
}
