export type ProjectStatus = "live" | "development" | "planned";

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
  category: "nasze-systemy" | "strony-zrobione" | "projekty";
  liveUrl?: string;
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
    slug: "estalo",
    title: "Estalo",
    subtitle: {
      pl: "CRM dla nieruchomości — Solo, Enterprise + Portal",
      en: "CRM for Real Estate — Solo, Enterprise + Portal",
    },
    description: {
      pl: "Kompletna platforma SaaS CRM dla polskich biur nieruchomości. 2 plany: Solo (indywidualni agenci) i Enterprise (biura). Integracje z Otodom, NOE 2.0, Domy.pl, Morizon-Gratka. AI matchmaking, RAG chatbot, generator opisów. Aplikacja mobilna Capacitor 8.",
      en: "Complete SaaS CRM platform for Polish real estate agencies. 2 plans: Solo (individual agents) and Enterprise (agencies). Integrations with Otodom, NOE 2.0, Domy.pl, Morizon-Gratka. AI matchmaking, RAG chatbot, listing generator. 23 tables with RLS, 28+ dashboard views, 791 tests. Capacitor 8 mobile app.",
    },
    longDescription: {
      pl: "Co robi:\nEstalo to enterprise CRM dla polskich biur nieruchomości. W jednym miejscu prowadzimy bazę klientów i ofert, integrujemy się z portalami (Otodom, Domy.pl, Morizon-Gratka, NOE 2.0), automatyzujemy publikacje, dopasowujemy klientów do mieszkań przez AI i zarządzamy całym pipeline'em sprzedażowym. Dostępny w dwóch planach: Solo dla pojedynczych agentów i Enterprise dla biur z wieloma użytkownikami i kontrolą uprawnień.\n\nNa czym jest zbudowany:\nNext.js 15.5 (App Router, server actions) + TypeScript + React 19, baza danych Supabase Postgres z Row Level Security, AI: Azure OpenAI + pgvector (embeddings dla RAG), płatności Lemon Squeezy, maile Resend, aplikacja mobilna Capacitor 8 (iOS/Android z tego samego kodu).\n\nDlaczego tak:\n• Next.js + server actions — chcieliśmy jeden codebase dla web/mobile, bez osobnego API. Server actions załatwiają walidację, autoryzację i mutacje w jednym miejscu.\n• Supabase + RLS — multi-tenant SaaS wymaga twardej izolacji danych między biurami; RLS robi to na poziomie bazy, nie aplikacji.\n• pgvector zamiast osobnego vector store — embeddings siedzą obok danych biznesowych, jeden Postgres, jedna kopia zapasowa, brak synchronizacji.\n• Azure OpenAI zamiast OpenAI bezpośrednio — dane klientów polskich biur muszą zostawać w UE (GDPR), region we Frankfurcie.\n• Capacitor 8 — aplikacja mobilna z tego samego kodu webowego, zero duplikacji.",
      en: "What it does:\nEstalo is an enterprise CRM for Polish real estate agencies. Single source of truth for client and listing data, integrations with portals (Otodom, Domy.pl, Morizon-Gratka, NOE 2.0), automated publishing, AI-powered client↔property matching, and full sales pipeline management. Two plans: Solo for individual agents and Enterprise for multi-user agencies with RBAC.\n\nStack:\nNext.js 15.5 (App Router, server actions) + TypeScript + React 19, Supabase Postgres with Row Level Security, AI: Azure OpenAI + pgvector (RAG embeddings), Lemon Squeezy payments, Resend email, Capacitor 8 mobile app (iOS/Android from the same codebase).\n\nWhy:\n• Next.js + server actions — one codebase for web/mobile, no separate API; validation, auth, and mutations in one place.\n• Supabase + RLS — multi-tenant SaaS needs hard data isolation between agencies; RLS enforces it at the DB level, not in app code.\n• pgvector instead of a separate vector store — embeddings live next to business data; one Postgres, one backup, no sync to maintain.\n• Azure OpenAI over OpenAI directly — Polish client data must stay in the EU (GDPR), Frankfurt region.\n• Capacitor 8 — mobile app from the same web code, zero duplication.",
    },
    status: "live",
    category: "nasze-systemy",
    liveUrl: "https://estalo.pl",
    tech: ["Next.js 15.5", "TypeScript", "React 19", "Supabase", "Azure OpenAI", "pgvector", "Capacitor 8", "Lemon Squeezy", "Resend", "TipTap", "Recharts", "Zod"],
    features: {
      pl: [
        "2 plany: Solo (indywidualni agenci) + Enterprise (biura z zespołem)",
        "AI matchmaking — dopasowywanie klient-nieruchomość (scoring 0-100)",
        "RAG chatbot z pgvector — asystent AI z bazą wiedzy agencji",
        "Generator opisów nieruchomości (model AIDA, Azure OpenAI)",
        "Szybka notatka — AI ekstrakcja danych ze swobodnego tekstu",
        "Brain — AI analiza pipeline, trendy i rekomendacje",
        "Integracja Otodom (OAuth 2.0, REST API, XML feed, webhooks)",
        "Integracja NOE 2.0, Domy.pl, Morizon-Gratka (XML + FTP)",
        "Estalo Portal — własny portal nieruchomości z webhook sync",
        "RBAC 5-poziomowy (Owner → Manager → Director → Agent → Assistant)",
        "Dashboard dyrektora — analityka zespołu, cele, KPI",
        "Pipeline sprzedażowy Kanban z drag & drop",
        "System leadów z auto-przypisywaniem (round-robin)",
        "Kalendarz z eksportem ICS i sync Google Calendar",
        "23 tabele z Row Level Security, 28+ widoków dashboard",
        "",
        "Aplikacja mobilna iOS/Android (Capacitor 8)",
        "Pełna dwujęzyczność PL/EN (1498 kluczy tłumaczeń)",
      ],
      en: [
        "2 plans: Solo (individual agents) + Enterprise (teams)",
        "AI matchmaking — client-property scoring (0-100 scale)",
        "RAG chatbot with pgvector — AI assistant with agency knowledge base",
        "Property listing generator (AIDA model, Azure OpenAI)",
        "Quick Note — AI data extraction from free-form text",
        "Brain — AI pipeline analysis, trends, and recommendations",
        "Otodom integration (OAuth 2.0, REST API, XML feed, webhooks)",
        "NOE 2.0, Domy.pl, Morizon-Gratka integration (XML + FTP)",
        "Estalo Portal — proprietary marketplace with webhook sync",
        "5-level RBAC (Owner → Manager → Director → Agent → Assistant)",
        "Director dashboard — team analytics, goals, KPIs",
        "Kanban sales pipeline with drag & drop",
        "Lead system with auto-assignment (round-robin)",
        "Calendar with ICS export and Google Calendar sync",
        "",
        "",
        "iOS/Android mobile app (Capacitor 8)",
        "Full PL/EN bilingual support (1,498 translation keys)",
      ],
    },
    tags: ["SaaS", "CRM", "AI", "Enterprise"],
    accentColor: "#c8a951",
    bgColor: "#1a1a1a",
    year: "2026",
    role: {
      pl: "Programo — projektowanie i development",
      en: "Programo — design and development",
    },
    screenshots: ["/screenshots/estalo-hero.png", "/screenshots/estalo-otodom.png", "/screenshots/estalo-portal.png"],
  },
  {
    slug: "athlix",
    title: "Athlix",
    subtitle: {
      pl: "Ekosystem dla sportowców",
      en: "Athlete Ecosystem",
    },
    description: {
      pl: "Trzy aplikacje sportowe, które razem tworzą kompletny ekosystem treningowy. TrainPilot to osobisty hub — synchronizacja z Garmin, AI trener i śledzenie żywienia. TrainMate łączy sportowców — znajdź partnera, dołącz do sesji, rywalizuj. Health analizuje regenerację — monitoring tętna, sen i gotowość do treningu.",
      en: "Three sport apps that together create a complete training ecosystem. TrainPilot is a personal hub — Garmin sync, AI coach, and nutrition tracking. TrainMate connects athletes — find a partner, join sessions, compete. Health analyzes recovery — heart rate monitoring, sleep, and training readiness.",
    },
    longDescription: {
      pl: "Co robi:\nAthlix to ekosystem trzech aplikacji sportowych dla zaawansowanych sportowców. TrainPilot synchronizuje się z Garminem, prowadzi dziennik treningowy i żywieniowy, generuje codzienne briefingi AI i rysuje wykres formy. TrainMate to społeczność — swipe-matching partnerów treningowych, real-time czat, integracja ze Stravą, moduł siłowni z rekordami. Health analizuje regenerację — łączy się przez Bluetooth z czujnikami tętna (Polar, Garmin, Wahoo, Coospo), liczy 20+ algorytmów HRV, ocenia sen i obciążenie treningowe.\n\nNa czym jest zbudowany:\nNext.js 16.1 + TypeScript + React 19, Neon (serverless Postgres) z Drizzle ORM, Anthropic Claude (AI briefingi i coach), Web Bluetooth API (sensory tętna), Pusher (real-time czat w TrainMate), integracje Strava + Garmin Connect, Capacitor 8 (iOS/Android), Recharts (wykresy formy i HRV).\n\nDlaczego tak:\n• Neon zamiast tradycyjnego Postgresa — serverless skaluje się do zera między sesjami treningowymi, płacimy za to, czego naprawdę używamy.\n• Drizzle ORM zamiast Prismy — pełna kontrola nad zapytaniami SQL przy zachowaniu type safety, kluczowe przy złożonych agregacjach treningowych.\n• Web Bluetooth zamiast natywnego SDK — pozwala działać tym samym kodem w przeglądarce i w Capacitorze, sportowiec może użyć Health od ręki bez instalacji.\n• Pusher dla czatu zamiast WebSocketów na własnym serwerze — utrzymywanie persistent connections przy mobile użytkownikach jest drogie i kruche, Pusher to robi za nas.\n• Capacitor 8 — push notifications i sklepy, ale ten sam React codebase co web.",
      en: "What it does:\nAthlix is a three-app ecosystem for serious athletes. TrainPilot syncs with Garmin, logs training and meals, generates daily AI briefings, and charts fitness. TrainMate is the community — swipe-matching for training partners, real-time chat, Strava integration, gym module with PRs. Health analyzes recovery — Bluetooth heart rate sensors (Polar, Garmin, Wahoo, Coospo), 20+ HRV algorithms, sleep and training load scoring.\n\nStack:\nNext.js 16.1 + TypeScript + React 19, Neon (serverless Postgres) with Drizzle ORM, Anthropic Claude (AI briefings and coach), Web Bluetooth API (heart rate sensors), Pusher (real-time chat in TrainMate), Strava + Garmin Connect integrations, Capacitor 8 (iOS/Android), Recharts (fitness and HRV charts).\n\nWhy:\n• Neon over traditional Postgres — serverless scales to zero between training sessions; we pay only for what we actually use.\n• Drizzle ORM over Prisma — full control over SQL queries with type safety, critical for complex training aggregations.\n• Web Bluetooth over native SDKs — the same code runs in browser and Capacitor; athletes can try Health instantly without installing anything.\n• Pusher for chat over self-hosted WebSockets — maintaining persistent connections for mobile users is expensive and fragile; Pusher handles it.\n• Capacitor 8 — push notifications and app stores, but the same React codebase as web.",
    },
    status: "live",
    category: "nasze-systemy",
    liveUrl: "https://athlix-trainpilot.vercel.app",
    tech: ["Next.js 16.1", "TypeScript", "React 19", "Neon", "Drizzle", "Capacitor 8", "Anthropic Claude", "Web Bluetooth", "Pusher", "Strava API", "Garmin Connect", "Google Maps", "Recharts"],
    features: {
      pl: [
        "3 aplikacje w jednym ekosystemie — trening, społeczność i regeneracja",
        "Synchronizacja z Garmin i Stravą — automatyczny import aktywności, tętna i mocy",
        "AI trener — codzienne briefing, rekomendacje treningowe i planowanie posiłków",
        "Wykres formy — śledzenie kondycji, zmęczenia i gotowości do treningu w czasie",
        "Śledzenie żywienia — zdjęcie posiłku, skan kodu kreskowego, baza polskich produktów",
        "Monitoring tętna Bluetooth — Polar, Garmin, Wahoo, Coospo i inne czujniki",
        "20+ algorytmów HRV — zaawansowana analiza zmienności rytmu serca",
        "Analiza zmienności tętna — 20+ algorytmów HRV oceniających stan organizmu",
        "Scoring regeneracji — ocena 0-100 na podstawie snu, tętna spoczynkowego i HRV",
        "Obciążenie treningowe — ile stresu zadajesz ciału i czy jesteś w strefie ryzyka",
        "Analiza snu — fazy głębokiego snu, REM i lekkiego snu, dług senny, efektywność",
        "Znajdź partnera treningowego — swipe, dopasowywanie i czat w czasie rzeczywistym",
        "Moduł siłowni — check-in, logi treningowe, rekordy osobiste i wyszukiwanie siłowni",
        "Forum i rankingi — dyskusje, huby sportowe, leaderboard i plany treningowe",
        "Pomiary ciała — waga, obwody, fałdy skórne i automatyczne obliczanie tkanki tłuszczowej",
        "Suplementacja — automatyczne protokoły dostosowane do fazy sezonu treningowego",
        "Aplikacja mobilna — instalacja z przeglądarki, tryb offline, powiadomienia push",
      ],
      en: [
        "3 apps in one ecosystem — training, community, and recovery",
        "Garmin & Strava sync — automatic import of activities, heart rate, and power",
        "AI coach — daily briefings, training recommendations, and meal planning",
        "Fitness chart — track fitness, fatigue, and training readiness over time",
        "Nutrition tracking — meal photos, barcode scanning, Polish food database",
        "Bluetooth heart rate — Polar, Garmin, Wahoo, Coospo, and other sensors",
        "20+ HRV algorithms — advanced heart rate variability analysis",
        "Heart rate variability — 20+ HRV algorithms assessing body state",
        "Recovery scoring — 0-100 rating based on sleep, resting heart rate, and HRV",
        "Training load — how much stress you put on your body and injury risk zones",
        "Sleep analysis — deep, REM, and light sleep phases, sleep debt, efficiency",
        "Find a training partner — swipe, match, and real-time chat",
        "Gym module — check-in, workout logs, personal records, and gym finder",
        "Forum & leaderboards — discussions, sport hubs, rankings, and training plans",
        "Body measurements — weight, circumferences, skin folds, and auto body fat calculation",
        "Supplements — automated protocols adjusted to your training season phase",
        "Mobile app — install from browser, offline mode, push notifications",
      ],
    },
    tags: ["Mobile", "Sport", "Health", "AI"],
    accentColor: "#6abf69",
    bgColor: "#1a2e1a",
    year: "2026",
    role: {
      pl: "Programo — projektowanie i development",
      en: "Programo — design and development",
    },
    screenshots: ["/screenshots/athlix-trainpilot-1.png"],
    subProducts: [
      {
        name: "TrainPilot",
        tagline: {
          pl: "Osobisty hub treningowy",
          en: "Personal Training Hub",
        },
        description: {
          pl: "Synchronizacja z Garmin Connect, codzienny briefing AI, śledzenie posiłków ze zdjęć i kodów kreskowych, wykres formy, profil mocy, suplementacja sezonowa i eksport do Google Calendar.",
          en: "Garmin Connect sync, daily AI briefing, meal tracking from photos and barcodes, fitness chart, power profile, seasonal supplements, and Google Calendar export.",
        },
        icon: "/screenshots/athlix-trainpilot-icon.png",
        screenshots: [
          "/screenshots/athlix-trainpilot-1.png",
        ],
        liveUrl: "https://athlix-trainpilot.vercel.app",
        accentColor: "#6366f1",
      },
      {
        name: "TrainMate",
        tagline: {
          pl: "Społeczność sportowców",
          en: "Athlete Community",
        },
        description: {
          pl: "Swipe i dopasowywanie partnerów treningowych, czat w czasie rzeczywistym, integracja ze Stravą, moduł siłowni z rekordami, organizacja sesji treningowych, forum i rankingi.",
          en: "Swipe and match training partners, real-time chat, Strava integration, gym module with personal records, training session organizer, forum and leaderboards.",
        },
        icon: "/screenshots/athlix-trainmate-icon.png",
        screenshots: [
          "/screenshots/athlix-trainmate-1.png",
          "/screenshots/athlix-trainmate-2.png",
        ],
        liveUrl: "https://athlix-trainmate.vercel.app",
        accentColor: "#F97316",
      },
      {
        name: "Health",
        tagline: {
          pl: "Analityka zdrowia i regeneracji",
          en: "Health & Recovery Analytics",
        },
        description: {
          pl: "Monitoring tętna przez Bluetooth (Polar, Garmin, Wahoo, Coospo), 20+ algorytmów HRV, scoring regeneracji i obciążenia treningowego, analiza snu z fazami, AI coach zdrowotny i wykrywanie przeciążenia.",
          en: "Bluetooth heart rate monitoring, 20+ heart rate variability algorithms, recovery and training load scoring, sleep analysis with stages, AI health coach, and overtraining detection.",
        },
        icon: "/screenshots/athlix-health-icon.png",
        screenshots: [
          "/screenshots/athlix-health-1.png",
          "/screenshots/athlix-health-2.png",
        ],
        liveUrl: "https://athlix-health.vercel.app",
        accentColor: "#00e676",
      },
    ],
  },
  {
    slug: "jedmar",
    title: "Jedmar",
    subtitle: {
      pl: "E-commerce dla centrum narzędziowego",
      en: "E-commerce for a tool center",
    },
    description: {
      pl: "Nowoczesny sklep internetowy dla Jedmar Centrum Narzędziowe w Poznaniu. 1460 produktów, 190 kategorii, 32 marki. Integracja z PrestaShop API, koszyk, checkout, konto klienta. Monorepo z Turborepo.",
      en: "Modern online store for Jedmar Tool Center in Poznan. 1460 products, 190 categories, 32 brands. PrestaShop API integration, cart, checkout, customer accounts. Turborepo monorepo.",
    },
    longDescription: {
      pl: "Co robi:\nNowoczesny frontend e-commerce dla Jedmar Centrum Narzędziowe w Poznaniu — sklep z 1460 produktami, 190 kategoriami i 32 markami. Klient przegląda katalog z filtrami (cena, marka, dostępność), wrzuca do koszyka, finalizuje zamówienie i ma własny panel z historią zakupów. Wszystkie dane produktów, zamówienia i klienci żyją w istniejącym backendzie PrestaShop — my zbudowaliśmy szybką, nowoczesną warstwę prezentacji.\n\nNa czym jest zbudowany:\nNext.js 15 + TypeScript + Tailwind CSS, PrestaShop REST API jako backend, Turborepo (monorepo), Vercel (hosting + CDN), analytics: GA4 + GTM + edrone, PWA.\n\nDlaczego tak:\n• Frontend Next.js zamiast przebudowywać PrestaShop — klient ma w PS lata danych i procesów; wymiana tego byłaby ryzykowna i droga, frontend dało się zrobić niezależnie.\n• Turborepo — UI components, utilities i typy współdzielone między aplikacją sklepu a panelem admin, cache buildów oszczędza minuty na każdym CI.\n• PrestaShop REST API — istniejące zamówienia i klienci automatycznie pojawiają się w starym panelu administracyjnym, bez migracji danych.\n• Vercel + ISR — 1460 stron produktowych pre-renderowanych statycznie, rewalidacja co X minut, instant load i SEO bez kosztów serwera.\n• edrone obok GA4 — klient już używa edrone do remarketingu i automation; podpięcie obu daje pełny obraz lejka.",
      en: "What it does:\nA modern e-commerce frontend for Jedmar Tool Center in Poznan — a store with 1,460 products, 190 categories, and 32 brands. Customers browse with filters (price, brand, availability), add to cart, check out, and manage orders in their account panel. All product data, orders, and customers live in the existing PrestaShop backend — we built a fast, modern presentation layer on top.\n\nStack:\nNext.js 15 + TypeScript + Tailwind CSS, PrestaShop REST API as backend, Turborepo (monorepo), Vercel (hosting + CDN), analytics: GA4 + GTM + edrone, PWA.\n\nWhy:\n• Next.js frontend instead of rebuilding PrestaShop — the client has years of PS data and processes; replacing that would be risky and expensive, the frontend could be done independently.\n• Turborepo — UI components, utilities, and types shared between the store and admin panel; build caching saves minutes on every CI run.\n• PrestaShop REST API — new orders and customers flow straight back into the existing admin panel, with no data migration.\n• Vercel + ISR — 1,460 product pages pre-rendered statically with periodic revalidation; instant load and SEO without server cost.\n• edrone alongside GA4 — the client already uses edrone for remarketing and automation; running both gives a complete funnel view.",
    },
    status: "live" as ProjectStatus,
    category: "strony-zrobione" as const,
    liveUrl: "https://jedmar.pl",
    tech: ["Next.js 15", "TypeScript", "Tailwind CSS", "PrestaShop API", "Turborepo", "Vercel"],
    features: {
      pl: ["1460 produktów z PrestaShop API", "190 kategorii z filtrami", "Koszyk i checkout", "Konto klienta", "GA4 + GTM + edrone", "PWA mobile-first"],
      en: ["1460 products via PrestaShop API", "190 categories with filters", "Cart and checkout", "Customer accounts", "GA4 + GTM + edrone", "PWA mobile-first"],
    },
    tags: ["E-commerce", "Web", "B2B"],
    accentColor: "#ffd333",
    bgColor: "#1a1a0a",
    year: "2026",
    role: {
      pl: "Programo — projektowanie i development",
      en: "Programo — design and development",
    },
    screenshots: ["/screenshots/jedmar-hero.png", "/screenshots/jedmar-clean1.png", "/screenshots/jedmar-clean2.png"],
  },
  {
    slug: "wks-poznan",
    title: "WKS Poznań",
    subtitle: {
      pl: "Strona Wielkopolskiego Klubu Sportowego",
      en: "Wielkopolski Sports Club Website",
    },
    description: {
      pl: "Nowoczesna strona internetowa dla WKS Poznań. Sekcje pływania, pływania w płetwach i pięcioboju nowoczesnego. Galeria, trenerzy, treningi, dotacje.",
      en: "Modern website for WKS Poznan sports club. Swimming, fin swimming, and modern pentathlon sections. Gallery, trainers, schedule, grants.",
    },
    longDescription: {
      pl: "Co robi:\nStrona Wielkopolskiego Klubu Sportowego w Poznaniu prezentująca trzy sekcje sportowe — pływanie, pływanie w płetwach i pięciobój nowoczesny. Rodzice znajdą tu profile trenerów, harmonogram treningów, galerię zawodów, informacje o dotacjach i formularz kontaktowy. 7 podstron w spójnej narracji.\n\nNa czym jest zbudowana:\nHTML5 + CSS + Vanilla JavaScript, hosting na Vercelu z automatycznym SSL.\n\nDlaczego tak:\n• Statyczne HTML/CSS/JS zamiast frameworka — strona klubu nie potrzebuje paneli administracyjnych ani logowania; klient miał dostać szybką, łatwą w utrzymaniu wizytówkę.\n• Zero build step — każdą poprawkę (nowy trener, zdjęcia z zawodów) można wrzucić ręcznie bez kompilacji.\n• Vercel — darmowy hosting dla strony non-profit, automatyczne wdrożenia z gita, globalne CDN.\n• Mobile-first — rodzice sprawdzają harmonogram na telefonie pod halą sportową.",
      en: "What it does:\nWebsite for Wielkopolski Sports Club in Poznan, showcasing three sport sections — swimming, fin swimming, and modern pentathlon. Parents find trainer profiles, training schedules, a competition gallery, grant information, and a contact form. 7 pages in a consistent narrative.\n\nStack:\nHTML5 + CSS + Vanilla JavaScript, hosted on Vercel with automatic SSL.\n\nWhy:\n• Static HTML/CSS/JS over a framework — the club site needs no admin panels or login; the client wanted a fast, easy-to-maintain showcase.\n• No build step — every fix (new trainer, competition photos) can be pushed manually with no compilation.\n• Vercel — free hosting for a non-profit, auto-deploys from git, global CDN.\n• Mobile-first — parents check the schedule on their phone outside the sports hall.",
    },
    status: "live" as ProjectStatus,
    category: "strony-zrobione" as const,
    liveUrl: "https://wks-strona.vercel.app",
    tech: ["HTML", "CSS", "JavaScript", "Vercel"],
    features: {
      pl: ["7 responsywnych podstron", "Profile trenerów", "Harmonogram treningów", "Galeria zdjęć", "Animacje przejść", "Formularz kontaktowy"],
      en: ["7 responsive pages", "Trainer profiles", "Training schedule", "Photo gallery", "Page transitions", "Contact form"],
    },
    tags: ["Sport", "Web", "Design"],
    accentColor: "#c41e3a",
    bgColor: "#1a0a0a",
    year: "2026",
    role: {
      pl: "Programo — projektowanie i development",
      en: "Programo — design and development",
    },
    screenshots: ["/screenshots/wks-hero.png", "/screenshots/wks-cap2.png", "/screenshots/wks-cap3.png"],
  },
  {
    slug: "wsafefinanse",
    title: "WSafeFinanse",
    subtitle: {
      pl: "Bezpieczne decyzje finansowe",
      en: "Safe financial decisions",
    },
    description: {
      pl: "Strona firmowa W. Safe Finance — doradztwo finansowe i bezpieczne rozwiązania dla klientów indywidualnych i firm.",
      en: "Corporate website for W. Safe Finance — financial advisory and safe solutions for individuals and businesses.",
    },
    longDescription: {
      pl: "Co robi:\nStrona firmowa W. Safe Finance — firmy zajmującej się consultingiem finansowym dla klientów indywidualnych i firm. Prezentuje ofertę usług, profil zespołu, opinie klientów i prowadzi kontakt: formularz wysyła zapytanie bezpośrednio na maila firmowego oraz powiadomienie na Telegrama, dzięki czemu właściciel reaguje na lead w kilka minut.\n\nNa czym jest zbudowana:\nNext.js + TypeScript + Tailwind CSS, formularz kontaktowy z walidacją Zod i rate limitingiem, Resend (e-mail transakcyjny), Telegram Bot API (powiadomienia push), hosting Vercel, dwa języki PL/EN, dark theme jako default.\n\nDlaczego tak:\n• Next.js + SSR — strona musi być świetnie zaindeksowana pod hasłami branżowymi; SSR + statyczne metadane dają najwyższy SEO score.\n• Resend zamiast SMTP — czysty API, niezawodna dostarczalność, brak konfiguracji serwera SMTP.\n• Telegram Bot zamiast SMS — bezpłatne powiadomienia push z bogatym formatowaniem, prywatny kanał dla właściciela, brak kosztów SMS.\n• Tailwind + dark theme — branża finansowa kojarzy się z powagą i premium; ciemny motyw odróżnia od konkurencji w jasnym corporate.\n• Vercel — natychmiastowy deploy z gita, edge CDN, zero kosztu hostingu dla małej strony.",
      en: "What it does:\nCorporate website for W. Safe Finance — a financial consulting firm serving individuals and businesses. Presents services, team profile, client testimonials, and handles inquiries: the contact form sends submissions straight to the company inbox plus a Telegram push notification, so the owner reacts to a lead within minutes.\n\nStack:\nNext.js + TypeScript + Tailwind CSS, contact form with Zod validation and rate limiting, Resend (transactional email), Telegram Bot API (push notifications), Vercel hosting, PL/EN bilingual, dark theme as default.\n\nWhy:\n• Next.js + SSR — the site has to rank well on industry keywords; SSR + static metadata produce the highest SEO scores.\n• Resend over SMTP — clean API, reliable deliverability, no SMTP server to configure.\n• Telegram Bot instead of SMS — free push notifications with rich formatting, a private channel for the owner, no per-message cost.\n• Tailwind + dark theme — finance feels serious and premium; dark mode sets the brand apart from the usual bright corporate look.\n• Vercel — instant git-based deploys, edge CDN, zero hosting cost for a small site.",
    },
    status: "live" as ProjectStatus,
    category: "strony-zrobione" as const,
    liveUrl: "https://www.wsafefinance.pl",
    tech: ["Web", "Design", "SEO"],
    features: {
      pl: ["Strona korporacyjna", "Prezentacja usług", "Formularz kontaktowy", "Responsywny design", "Optymalizacja SEO"],
      en: ["Corporate website", "Service presentation", "Contact form", "Responsive design", "SEO optimization"],
    },
    tags: ["Finance", "Corporate", "Web"],
    accentColor: "#2563eb",
    bgColor: "#0a1025",
    year: "2026",
    role: {
      pl: "Programo — projektowanie i development",
      en: "Programo — design and development",
    },
    screenshots: ["/screenshots/wsafefinanse-hero.png", "/screenshots/wsafefinanse-cap2.png", "/screenshots/wsafefinanse-cap3.png"],
  },
  {
    slug: "solvio",
    title: "Solvio",
    subtitle: {
      pl: "AI do śledzenia wydatków — paragony, grupy, raporty",
      en: "AI expense tracking — receipts, groups, reports",
    },
    description: {
      pl: "SaaS do zarządzania wydatkami z AI: skanowanie paragonów (OCR), grupy kosztów, porównywanie cen między sklepami i raporty finansowe. Wersja webowa + aplikacja iOS.",
      en: "AI-powered expense SaaS: receipt scanning (OCR), cost groups, cross-store price comparison, and financial reports. Web app + iOS app.",
    },
    longDescription: {
      pl: "Co robi:\nSolvio porządkuje wydatki bez ręcznego przepisywania. Robisz zdjęcie paragonu, AI (OCR) wyciąga pozycje i kwoty, przypisuje je do grup kosztów, porównuje ceny produktów między sklepami i generuje czytelne raporty. Dostępne jako aplikacja webowa i natywna aplikacja iOS.\n\nNa czym jest zbudowane:\nNext.js + TypeScript + React, baza Neon Postgres z Drizzle ORM, pliki na Vercel Blob, OCR przez Azure, kategoryzacja i podsumowania przez OpenAI. Aplikacja mobilna w SwiftUI.\n\nDlaczego tak:\n• OCR + LLM zdejmują z użytkownika najnudniejszą część — ręczne wpisywanie paragonów.\n• Neon + Drizzle — typowane zapytania i szybki, serverless Postgres pod zmienne obciążenie.\n• SwiftUI — natywne, płynne UI tam, gdzie ludzie realnie skanują paragony: na telefonie.",
      en: "What it does:\nSolvio organizes spending without manual entry. You photograph a receipt, AI (OCR) extracts line items and amounts, assigns them to cost groups, compares product prices across stores, and generates clear reports. Available as a web app and a native iOS app.\n\nStack:\nNext.js + TypeScript + React, Neon Postgres with Drizzle ORM, Vercel Blob storage, Azure OCR, OpenAI for categorization and summaries. Mobile app in SwiftUI.\n\nWhy:\n• OCR + LLM remove the most tedious part — typing receipts by hand.\n• Neon + Drizzle — typed queries and fast serverless Postgres for variable load.\n• SwiftUI — native, smooth UI where people actually scan receipts: on the phone.",
    },
    status: "live",
    category: "nasze-systemy",
    liveUrl: "https://solvio-lac.vercel.app",
    tech: ["Next.js", "TypeScript", "React", "Neon", "Drizzle", "Vercel Blob", "Azure OCR", "OpenAI", "SwiftUI"],
    features: {
      pl: [
        "Skanowanie paragonów (OCR) — pozycje i kwoty ze zdjęcia",
        "Grupy kosztów i kategorie wydatków",
        "Porównywanie cen produktów między sklepami",
        "Raporty finansowe i podsumowania AI",
        "Aplikacja iOS (SwiftUI) + wersja webowa",
        "Dwujęzyczność PL/EN",
      ],
      en: [
        "Receipt scanning (OCR) — items and amounts from a photo",
        "Cost groups and spending categories",
        "Cross-store product price comparison",
        "Financial reports and AI summaries",
        "iOS app (SwiftUI) + web version",
        "PL/EN bilingual",
      ],
    },
    tags: ["SaaS", "AI", "Fintech"],
    accentColor: "#5b8def",
    bgColor: "#0f1730",
    year: "2026",
    role: {
      pl: "Programo — projektowanie i development",
      en: "Programo — design and development",
    },
    screenshots: ["/screenshots/solvio-hero.png", "/screenshots/solvio-cap2.png", "/screenshots/solvio-cap3.png"],
  },
  {
    slug: "rejestr-pro",
    title: "Rejestr Pro",
    subtitle: {
      pl: "Wyszukiwarka firm z KRS — profile, powiązania, sprawozdania",
      en: "KRS company search — profiles, links, filings",
    },
    description: {
      pl: "Platforma do wyszukiwania polskich firm po nazwie, NIP i numerze KRS. Oficjalne dane z API Ministerstwa Sprawiedliwości, profile spółek, powiązania osób i linki do sprawozdań finansowych (RDF). Web + aplikacja iOS.",
      en: "Platform to search Polish companies by name, NIP, and KRS number. Official Ministry of Justice API data, company profiles, people connections, and links to financial filings (RDF). Web + iOS app.",
    },
    longDescription: {
      pl: "Co robi:\nRejestr Pro to wyszukiwarka i przeglądarka rejestru firm (model zbliżony do Rejestr.io / Aleo). Szukasz po nazwie, NIP lub numerze KRS, dostajesz profil spółki z oficjalnego odpisu KRS, powiązania osób między firmami oraz odnośniki do sprawozdań finansowych w repozytorium RDF.\n\nNa czym jest zbudowane:\nNext.js + TypeScript + React (web), worker w TypeScript z własnym indeksem w PostgreSQL (wyszukiwanie po nazwie/NIP), aplikacja iOS w Swift. Dane z oficjalnego API KRS Ministerstwa Sprawiedliwości.\n\nDlaczego tak:\n• Tylko oficjalne źródła — odpis z API KRS i link do RDF, bez obchodzenia zabezpieczeń (zgodność prawna i RODO).\n• Własny indeks organiczny w Postgres (indeks trigramowy) — szybkie wyszukiwanie po nazwie i NIP.\n• Wspólne web-API dla strony i aplikacji iOS — jedna logika, dwa kanały.",
      en: "What it does:\nRejestr Pro is a company-registry search and viewer (similar to Rejestr.io / Aleo). Search by name, NIP, or KRS number to get a company profile from the official KRS extract, people connections across companies, and links to financial filings in the RDF repository.\n\nStack:\nNext.js + TypeScript + React (web), a TypeScript worker with its own PostgreSQL index (name/NIP search), iOS app in Swift. Data from the official Ministry of Justice KRS API.\n\nWhy:\n• Official sources only — KRS API extract and an RDF link, no bypassing protections (legal & GDPR compliant).\n• Own organic Postgres index (trigram) — fast search by name and NIP.\n• Shared web API for the site and the iOS app — one logic, two channels.",
    },
    status: "live",
    category: "nasze-systemy",
    liveUrl: "https://rejestr-pro.vercel.app",
    tech: ["Next.js", "TypeScript", "React", "PostgreSQL", "Swift", "Vercel", "API KRS"],
    features: {
      pl: [
        "Wyszukiwanie firm po nazwie, NIP i numerze KRS",
        "Profile spółek z oficjalnego odpisu KRS",
        "Powiązania osób między firmami",
        "Linki do sprawozdań finansowych (RDF)",
        "Własny indeks organiczny (PostgreSQL, trigram)",
        "Aplikacja iOS (Swift) + wersja webowa",
      ],
      en: [
        "Company search by name, NIP, and KRS number",
        "Company profiles from the official KRS extract",
        "People connections across companies",
        "Links to financial filings (RDF)",
        "Own organic index (PostgreSQL, trigram)",
        "iOS app (Swift) + web version",
      ],
    },
    tags: ["Platform", "Dane", "Web"],
    accentColor: "#0ea5e9",
    bgColor: "#0a1a24",
    year: "2026",
    role: {
      pl: "Programo — projektowanie i development",
      en: "Programo — design and development",
    },
    screenshots: ["/screenshots/rejestr-pro-hero.png", "/screenshots/rejestr-pro-cap2.png", "/screenshots/rejestr-pro-cap4.png"],
  }
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
