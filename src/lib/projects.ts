export type ProjectStatus = "live" | "development" | "planned";

export interface Project {
  slug: string;
  title: string;
  subtitle: { pl: string; en: string };
  description: { pl: string; en: string };
  longDescription: { pl: string; en: string };
  status: ProjectStatus;
  liveUrl?: string;
  tech: string[];
  features: { pl: string[]; en: string[] };
  tags: string[];
  accentColor: string;
  bgColor: string;
  year: string;
  role: { pl: string; en: string };
  screenshots?: string[];
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
      pl: "Estalo to enterprise-grade SaaS CRM zaprojektowany specjalnie dla polskich biur nieruchomości.\n\nDwa plany:\n• Solo — dla indywidualnych agentów i małych biur\n• Enterprise — dla większych biur z zarządzaniem zespołem\n\nFunkcje AI:\n• Inteligentne dopasowywanie klient-nieruchomość (scoring 0-100)\n• RAG chatbot z pgvector embeddings\n• Generator opisów nieruchomości (model AIDA)\n• Szybka notatka — AI ekstrakcja danych ze swobodnego tekstu\n• Generator profesjonalnych emaili\n• Brain — analiza pipeline i trendy\n\nIntegracje z portalami:\n• Otodom (OAuth 2.0 + REST API + XML + webhooks)\n• NOE 2.0, Domy.pl, Morizon-Gratka (XML feed + FTP)\n• Estalo Portal — własny portal nieruchomości (webhook sync)\n\nEnterprise:\n• RBAC (5 ról: Owner, Manager, Director, Agent, Assistant)\n• Dashboard dyrektora z analityką zespołu\n• Audit logging (17+ typów zdarzeń)\n• System zaproszeń z kodami\n\nBezpieczeństwo:\n• 217 testów security (XSS, IDOR, prompt injection, upload validation)\n• Szyfrowanie FTP AES-256-GCM\n• Walidacja Zod na 28 server actions\n• CSP headers z dynamicznym Azure endpoint",
      en: "Estalo is an enterprise-grade SaaS CRM designed specifically for Polish real estate agencies.\n\nTwo plans:\n• Solo — for individual agents and small agencies\n• Enterprise — for larger agencies with team management\n\nAI Features:\n• Intelligent client-property matching (scoring 0-100)\n• RAG chatbot with pgvector embeddings\n• Property listing generator (AIDA model)\n• Quick Note — AI data extraction from free-form text\n• Professional email generator\n• Brain — pipeline analysis and trend detection\n\nPortal Integrations:\n• Otodom (OAuth 2.0 + REST API + XML + webhooks)\n• NOE 2.0, Domy.pl, Morizon-Gratka (XML feed + FTP)\n• Estalo Portal — proprietary property marketplace (webhook sync)\n\nEnterprise:\n• RBAC (5 roles: Owner, Manager, Director, Agent, Assistant)\n• Director dashboard with team analytics\n• Audit logging (17+ event types)\n• Invite system with codes\n\nSecurity:\n• 217 security tests (XSS, IDOR, prompt injection, upload validation)\n• FTP password encryption AES-256-GCM\n• Zod validation on 28 server actions\n• CSP headers with dynamic Azure endpoint",
    },
    status: "live",
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
      pl: "Projektowanie i development full-stack",
      en: "Full-stack Design & Development",
    },
    screenshots: ["/PLACEHOLDER_ESTALO_HERO.png", "/PLACEHOLDER_ESTALO_DASHBOARD.png", "/PLACEHOLDER_ESTALO_MATCHMAKING.png", "/PLACEHOLDER_ESTALO_PORTAL.png"],
  },
  {
    slug: "baulx",
    title: "Baulx",
    subtitle: {
      pl: "Platforma CNC dla budownictwa drewnianego — 10 produktów",
      en: "CNC Timber Platform — 10 Products",
    },
    description: {
      pl: "Ekosystem 10 produktów dla prefabrykacji drewnianej. Viewer 3D (BTLx/WUP/TCN/IFC), Convert (5 post-procesorów CNC), Wall/Roof/Floor (parametryczne projektanty), Calc (Eurocode 5, 20 modułów), CNC Studio, Nest, API. ",
      en: "Ecosystem of 10 products for timber prefabrication. 3D Viewer (BTLx/WUP/TCN/IFC), Convert (5 CNC post-processors), Wall/Roof/Floor (parametric designers), Calc (Eurocode 5, 20 modules), CNC Studio, Nest, API. ",
    },
    longDescription: {
      pl: "Baulx to kompletny ekosystem oprogramowania dla branży budownictwa drewnianego i prefabrykacji CNC.\n\n Darmowe:\n• Viewer — przeglądarka BTLx/WUP/TCN/G-code/IFC z wizualizacją 3D, rysunki warsztatowe, etykiety QR, plany transportu, BOM\n• Thermo — kalkulatory U-value (EN ISO 6946), analiza kondensacji, mostki cieplne\n\n Płatne:\n• Convert — konwersja WUP/BTLx → TCN/G-code, 5 post-procesorów (Weinmann WBS/WBZ, Hundegger K2, WBZ 160 HOMAG 5-osi, Fanuc 0i-MF, Mafell erika), batch processing\n• Wall — parametryczny 2D/3D projektant ścian (Konva.js + Three.js), kołki, poszycie, CLT, nisze instalacyjne, AI generator ścian (Claude API)\n• Roof — projektant dachów (5 typów), auto-timber, łacenie, dormery, świetliki, obliczenia obciążenia wiatrem, baza dachówek\n• Floor — projektant stropów z kontrolą ugięcia, złącza drewniane, belki stalowe, biblioteka okuć\n• Calc — kalkulator Eurocode 5 (EN 1995), 20 modułów: belki, słupy, kratownice, wiaty, złącza, kotwy, obciążenia śnieg/wiatr, pożar, nacięcia, profile stalowe (EC3), AI D-bot\n• CNC — edytor G-code + symulator z feedback wizualnym, 6 post-procesorów, CNC Studio HMI\n• Nest — optymalizator nestingu paneli (algorytm FFDH)\n• API — REST API v1 dla developerów, auth Bearer/JWT, rate limiting\n\n Baulx Pro — pakiet wszystkich płatnych produktów\n\nTech: Vanilla JS (zero bundlera), Three.js v0.170, Konva.js v9, Python serverless (Vercel), Supabase, PWA z Service Worker, dark/light theme, PL/EN.",
      en: "Baulx is a complete software ecosystem for the timber construction and CNC prefabrication industry.\n\n Free:\n• Viewer — BTLx/WUP/TCN/G-code/IFC viewer with 3D visualization, shop drawings, QR labels, transport plans, BOM\n• Thermo — U-value calculators (EN ISO 6946), condensation analysis, thermal bridges\n\n Paid:\n• Convert — WUP/BTLx → TCN/G-code conversion, 5 post-processors (Weinmann WBS/WBZ, Hundegger K2, WBZ 160 HOMAG 5-axis, Fanuc 0i-MF, Mafell erika), batch processing\n• Wall — parametric 2D/3D wall designer (Konva.js + Three.js), studs, sheathing, CLT, installation niches, AI wall generator (Claude API)\n• Roof — roof designer (5 types), auto-timber, battens, dormers, skylights, wind load calculations, tile database\n• Floor — floor designer with deflection checking, timber connections, steel beams, hardware library\n• Calc — Eurocode 5 calculator (EN 1995), 20 modules: beams, columns, trusses, carports, connections, anchoring, snow/wind loads, fire, notch, steel profiles (EC3), AI D-bot\n• CNC — G-code editor + simulator with visual feedback, 6 post-processors, CNC Studio HMI\n• Nest — panel nesting optimizer (FFDH algorithm)\n• API — REST API v1 for developers, Bearer/JWT auth, rate limiting\n\n Baulx Pro — all paid products bundle\n\nTech: Vanilla JS (zero bundler), Three.js v0.170, Konva.js v9, Python serverless (Vercel), Supabase, PWA with Service Worker, dark/light theme, PL/EN.",
    },
    status: "live",
    liveUrl: "https://baulx.pl",
    tech: ["JavaScript", "Python", "Three.js", "Konva.js", "Supabase", "Anthropic Claude", "Vercel Serverless", "Eurocode 5"],
    features: {
      pl: [
        "10 produktów w modelu JetBrains (2 darmowe + 8 płatnych + bundle Pro)",
        "Viewer 3D — BTLx/WUP/TCN/G-code/IFC, rysunki warsztatowe, QR, BOM, plany transportu",
        "Convert — 5 post-procesorów CNC (Weinmann, Hundegger K2, HOMAG 5-osi, Fanuc, Mafell)",
        "Wall — parametryczny projektant ścian 2D/3D, CLT, AI generator ścian (Claude API)",
        "Roof — projektant dachów (5 typów), dormery, świetliki, łacenie, baza dachówek",
        "Floor — projektant stropów, kontrola ugięcia, złącza, belki stalowe, biblioteka okuć",
        "Calc — Eurocode 5 (20 modułów): belki, słupy, kratownice, złącza, pożar, AI D-bot",
        "CNC Studio — edytor G-code + symulator z wizualizacją, HMI maszyn",
        "Nest — optymalizator nestingu paneli FFDH",
        "REST API v1 — auth Bearer/JWT, 12 endpointów, rate limiting",
        "",
        "",
        "PWA z Service Worker v10, tryb offline, dark/light theme",
        "Pełna dwujęzyczność PL/EN, WCAG 2.1 AA",
      ],
      en: [
        "10 products in JetBrains model (2 free + 8 paid + Pro bundle)",
        "3D Viewer — BTLx/WUP/TCN/G-code/IFC, shop drawings, QR, BOM, transport plans",
        "Convert — 5 CNC post-processors (Weinmann, Hundegger K2, HOMAG 5-axis, Fanuc, Mafell)",
        "Wall — parametric 2D/3D wall designer, CLT, AI wall generator (Claude API)",
        "Roof — roof designer (5 types), dormers, skylights, battens, tile database",
        "Floor — floor designer, deflection checking, joints, steel beams, hardware library",
        "Calc — Eurocode 5 (20 modules): beams, columns, trusses, joints, fire, AI D-bot",
        "CNC Studio — G-code editor + simulator with visualization, machine HMI",
        "Nest — FFDH panel nesting optimizer",
        "REST API v1 — Bearer/JWT auth, 12 endpoints, rate limiting",
        "",
        "",
        "PWA with Service Worker v10, offline mode, dark/light theme",
        "Full PL/EN bilingual, WCAG 2.1 AA",
      ],
    },
    tags: ["Platform", "CNC", "Engineering", "3D"],
    accentColor: "#22c55e",
    bgColor: "#080f1e",
    year: "2026",
    role: {
      pl: "Projektowanie i development full-stack",
      en: "Full-stack Design & Development",
    },
    screenshots: ["/PLACEHOLDER_BAULX_HERO.png", "/PLACEHOLDER_BAULX_3D_VIEWER.png", "/PLACEHOLDER_BAULX_NESTING.png", "/PLACEHOLDER_BAULX_WALL_DESIGNER.png"],
  },
  {
    slug: "athlix",
    title: "Athlix",
    subtitle: {
      pl: "Ekosystem dla sportowców — TrainPilot + TrainMate + Health",
      en: "Athlete Ecosystem — TrainPilot + TrainMate + Health",
    },
    description: {
      pl: "Trzy aplikacje, jeden cel — lepszy trening. TrainPilot synchronizuje Garmin i planuje posiłki ze zdjęć. TrainMate łączy sportowców w okolicy i organizuje wspólne sesje. Health monitoruje tętno przez Bluetooth i ocenia regenerację jak WHOOP — za darmo.",
      en: "Three apps, one goal — better training. TrainPilot syncs your Garmin and plans meals from photos. TrainMate connects nearby athletes and organizes group sessions. Health monitors heart rate via Bluetooth and scores recovery like WHOOP — for free.",
    },
    longDescription: {
      pl: "Athlix to ekosystem 3 aplikacji sportowych, które razem zastępują WHOOP, Stravę i MyFitnessPal.\n\nTrainPilot — Twój osobisty hub treningowy. Synchronizacja z Garmin Connect, codzienny briefing AI z rekomendacjami, śledzenie posiłków ze zdjęć i kodów kreskowych, wykres formy PMC, profil mocy, suplementacja sezonowa i eksport do Google Calendar.\n\nTrainMate — społeczność sportowców. Swipe i dopasowywanie partnerów treningowych, czat w czasie rzeczywistym, integracja ze Stravą, moduł siłowni z rekordami, organizacja sesji treningowych, forum i rankingi.\n\nHealth — darmowa alternatywa WHOOP. Monitoring tętna przez Bluetooth (Polar, Garmin, Wahoo, WHOOP), 20+ algorytmów analizy zmienności rytmu serca, scoring regeneracji i obciążenia treningowego, analiza snu z fazami, AI coach zdrowotny i wykrywanie przeciążenia.",
      en: "Athlix is an ecosystem of 3 sport apps that together replace WHOOP, Strava, and MyFitnessPal.\n\nTrainPilot — your personal training hub. Garmin Connect sync, daily AI briefing with recommendations, meal tracking from photos and barcodes, PMC fitness chart, power profile, seasonal supplements, and Google Calendar export.\n\nTrainMate — athlete community. Swipe and match training partners, real-time chat, Strava integration, gym module with personal records, training session organizer, forum and leaderboards.\n\nHealth — free WHOOP alternative. Bluetooth heart rate monitoring (Polar, Garmin, Wahoo, WHOOP), 20+ heart rate variability algorithms, recovery and training load scoring, sleep analysis with stages, AI health coach, and overtraining detection.",
    },
    status: "live",
    liveUrl: "https://trainpilot.vercel.app",
    tech: ["Next.js 16.1", "TypeScript", "React 19", "Neon", "Drizzle", "Capacitor 8", "Anthropic Claude", "Web Bluetooth", "Pusher", "Strava API", "Garmin Connect", "Google Maps", "Recharts"],
    features: {
      pl: [
        "3 aplikacje w jednym ekosystemie — trening, społeczność i regeneracja",
        "Synchronizacja z Garmin i Stravą — automatyczny import aktywności, tętna i mocy",
        "AI trener — codzienne briefing, rekomendacje treningowe i planowanie posiłków",
        "Wykres formy — śledzenie kondycji, zmęczenia i gotowości do treningu w czasie",
        "Śledzenie żywienia — zdjęcie posiłku, skan kodu kreskowego, baza polskich produktów",
        "Monitoring tętna Bluetooth — Polar, Garmin, Wahoo, WHOOP i inne czujniki",
        "Integracja z WHOOP — synchronizacja danych z opaski, dostęp do historii pomiarów",
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
        "Bluetooth heart rate — Polar, Garmin, Wahoo, WHOOP, and other sensors",
        "WHOOP integration — sync band data and access measurement history",
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
      pl: "Projektowanie i development full-stack",
      en: "Full-stack Design & Development",
    },
    screenshots: ["/screenshots/athlix-trainpilot-1.png", "/screenshots/athlix-health-1.png", "/screenshots/athlix-trainmate-1.png", "/screenshots/athlix-health-1.png"],
  },
  {
    slug: "learnai",
    title: "LearnAI",
    subtitle: {
      pl: "Platforma kursowa nowej generacji",
      en: "Next-gen Course Platform",
    },
    description: {
      pl: "Platforma edukacyjna do tworzenia i sprzedaży kursów online. Kreator kursów, system lekcji z wideo/quizami, panel ucznia, certyfikaty, płatności Stripe, analityka postępów.",
      en: "Educational platform for creating and selling online courses. Course builder, lesson system with video/quizzes, student dashboard, certificates, Stripe payments, progress analytics.",
    },
    longDescription: {
      pl: "LearnAI to nowoczesna platforma kursowa umożliwiająca tworzenie, publikowanie i sprzedaż kursów online. System zapewnia kompletne narzędzia dla autorów kursów (kreator lekcji, wideo, quizy, zadania) oraz dla uczniów (panel postępów, certyfikaty, notatki).\n\nPlatforma integruje AI do generowania podsumowań lekcji, rekomendacji kolejnych kursów i personalizacji ścieżki nauki. Płatności obsługiwane przez Stripe, hosting wideo, system ocen i recenzji.",
      en: "LearnAI is a modern course platform for creating, publishing and selling online courses. The system provides complete tools for course authors (lesson builder, video, quizzes, assignments) and for students (progress dashboard, certificates, notes).\n\nThe platform integrates AI for generating lesson summaries, recommending next courses, and personalizing learning paths. Payments handled by Stripe, video hosting, rating and review system.",
    },
    status: "planned",
    tech: ["Next.js", "TypeScript", "Supabase", "Stripe", "Azure OpenAI"],
    features: {
      pl: [
        "Kreator kursów — lekcje, wideo, quizy, zadania",
        "Panel ucznia — postępy, certyfikaty, notatki",
        "System płatności Stripe (jednorazowe + subskrypcje)",
        "AI podsumowania lekcji i rekomendacje kursów",
        "Analityka postępów i zaangażowania",
        "System ocen i recenzji",
        "Responsywna aplikacja webowa",
      ],
      en: [
        "Course builder — lessons, video, quizzes, assignments",
        "Student dashboard — progress, certificates, notes",
        "Stripe payment system (one-time + subscriptions)",
        "AI lesson summaries and course recommendations",
        "Progress and engagement analytics",
        "Rating and review system",
        "Responsive web application",
      ],
    },
    tags: ["EdTech", "SaaS", "AI"],
    accentColor: "#8b5cf6",
    bgColor: "#1a1625",
    year: "2026",
    role: {
      pl: "Projektowanie i development full-stack",
      en: "Full-stack Design & Development",
    },
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
