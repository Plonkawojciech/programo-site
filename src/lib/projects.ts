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
  // Optional presentation hint. "mobile-app" → the detail page shows screenshots
  // inside App-Store-style phone frames instead of the default editorial grid.
  kind?: "mobile-app";
  category: "nasze-systemy" | "strony-zrobione" | "projekty";
  liveUrl?: string;
  // Short, real headline metric shown on cards (e.g. "1460 produktów · 190 kategorii").
  metric?: { pl: string; en: string };
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
      en: "Complete SaaS CRM platform for Polish real estate agencies. 2 plans: Solo (individual agents) and Enterprise (agencies). Integrations with Otodom, NOE 2.0, Domy.pl, Morizon-Gratka. AI matchmaking, RAG chatbot, listing generator. Capacitor 8 mobile app.",
    },
    longDescription: {
      pl: "Co robi:\nEstalo to enterprise CRM dla polskich biur nieruchomości. W jednym miejscu prowadzimy bazę klientów i ofert, integrujemy się z portalami (Otodom, Domy.pl, Morizon-Gratka, NOE 2.0), automatyzujemy publikacje, dopasowujemy klientów do mieszkań przez AI i zarządzamy całym pipeline'em sprzedażowym. Premiera wkrótce — w dwóch planach: Solo dla pojedynczych agentów i Enterprise dla biur z wieloma użytkownikami i kontrolą uprawnień.\n\nNa czym jest zbudowany:\nNext.js 15.5 (App Router, server actions) + TypeScript + React 19, baza danych Supabase Postgres z Row Level Security, AI: Azure OpenAI + pgvector (embeddings dla RAG), płatności Lemon Squeezy, maile Resend, aplikacja mobilna Capacitor 8 (iOS/Android z tego samego kodu).\n\nDlaczego tak:\n• Next.js + server actions — chcieliśmy jeden codebase dla web/mobile, bez osobnego API. Server actions załatwiają walidację, autoryzację i mutacje w jednym miejscu.\n• Supabase + RLS — multi-tenant SaaS wymaga twardej izolacji danych między biurami; RLS robi to na poziomie bazy, nie aplikacji.\n• pgvector zamiast osobnego vector store — embeddings siedzą obok danych biznesowych, jeden Postgres, jedna kopia zapasowa, brak synchronizacji.\n• Azure OpenAI zamiast OpenAI bezpośrednio — dane klientów polskich biur muszą zostawać w UE (GDPR), region we Frankfurcie.\n• Capacitor 8 — aplikacja mobilna z tego samego kodu webowego, zero duplikacji.",
      en: "What it does:\nEstalo is an enterprise CRM for Polish real estate agencies. Single source of truth for client and listing data, integrations with portals (Otodom, Domy.pl, Morizon-Gratka, NOE 2.0), automated publishing, AI-powered client↔property matching, and full sales pipeline management. Launching soon — in two plans: Solo for individual agents and Enterprise for multi-user agencies with RBAC.\n\nStack:\nNext.js 15.5 (App Router, server actions) + TypeScript + React 19, Supabase Postgres with Row Level Security, AI: Azure OpenAI + pgvector (RAG embeddings), Lemon Squeezy payments, Resend email, Capacitor 8 mobile app (iOS/Android from the same codebase).\n\nWhy:\n• Next.js + server actions — one codebase for web/mobile, no separate API; validation, auth, and mutations in one place.\n• Supabase + RLS — multi-tenant SaaS needs hard data isolation between agencies; RLS enforces it at the DB level, not in app code.\n• pgvector instead of a separate vector store — embeddings live next to business data; one Postgres, one backup, no sync to maintain.\n• Azure OpenAI over OpenAI directly — Polish client data must stay in the EU (GDPR), Frankfurt region.\n• Capacitor 8 — mobile app from the same web code, zero duplication.",
    },
    status: "planned",
    category: "nasze-systemy",
    liveUrl: "https://estalo.pl",
    metric: { pl: "Solo · Enterprise · Portal — wkrótce", en: "Solo · Enterprise · Portal — soon" },
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
    screenshots: ["/screenshots/estalo-hero.webp", "/screenshots/estalo-otodom.webp", "/screenshots/estalo-portal.webp"],
  },
  {
    slug: "jedmar",
    title: "Jedmar",
    subtitle: {
      pl: "Aplikacja mobilna iOS + Android dla Centrum Narzędziowego Jedmar",
      en: "iOS + Android mobile app for the Jedmar Tool Center",
    },
    description: {
      pl: "Natywna aplikacja mobilna (iOS i Android) dla Centrum Narzędziowego Jedmar w Poznaniu. Cały sklep w kieszeni klienta: katalog z kategoriami i markami, koszyk, konto i historia zamówień — spięte z istniejącym backendem sklepu (PrestaShop). Nie budowaliśmy całego sklepu — zbudowaliśmy aplikację mobilną do niego.",
      en: "A native mobile app (iOS and Android) for the Jedmar Tool Center in Poznan. The whole store in the customer's pocket: a catalog with categories and brands, cart, account, and order history — wired to the store's existing backend (PrestaShop). We didn't build the whole store — we built the mobile app for it.",
    },
    longDescription: {
      pl: "Co zrobiliśmy:\nZaprojektowaliśmy i zbudowaliśmy natywną aplikację mobilną na iOS i Android dla Centrum Narzędziowego Jedmar w Poznaniu. To było konkretne zlecenie od klienta — nie cały sklep, lecz dedykowana apka mobilna do istniejącego sklepu narzędziowego. Klient przegląda pełny katalog z kategoriami i markami, korzysta z wyszukiwarki i filtrów, dodaje produkty do koszyka, zakłada konto, składa zamówienie i śledzi jego historię — wszystko z poziomu telefonu, także w terenie i na budowie.\n\nJak jest zbudowane:\nDwie w pełni natywne aplikacje: iOS w Swift / SwiftUI i Android w Kotlinie — każda zbudowana w natywnym SDK swojej platformy, dla maksymalnej płynności, wydajności i pełnego dostępu do funkcji telefonu. Dane produktów, koszyk i zamówienia pobieramy z istniejącego backendu sklepu (PrestaShop) przez jego API, dzięki czemu aplikacja działa na tych samych danych i procesach co sklep — bez migracji i bez drugiej bazy do utrzymania.\n\nDlaczego tak:\n• Natywnie zamiast hybrydy (Capacitor / React Native) — pełna płynność, szybkość i dostęp do aparatu, powiadomień i gestów; aplikacja działa i wygląda jak część systemu, nie jak strona w opakowaniu.\n• Integracja z PrestaShop przez API — zamówienia i klienci z apki trafiają do systemu, w którym sklep już pracuje; nie duplikujemy katalogu ani stanu magazynowego.\n• Mobile-first — zakupy w narzędziówce robi się szybko, z telefonu, często jedną ręką na budowie; aplikacja jest do tego zaprojektowana lepiej niż mobilna wersja strony.\n\nEfekt:\nKlient Jedmar dostał własną, markową aplikację zakupową na iOS i Android, działającą na danych jego sklepu. Aplikacja jest gotowa i przetestowana; nie jest jeszcze opublikowana w App Store ani Google Play — publikacja to kolejny krok.",
      en: "What we did:\nWe designed and built a native mobile app for iOS and Android for the Jedmar Tool Center in Poznan. This was a specific client commission — not the whole store, but a dedicated mobile app for the existing tool store. Customers browse the full catalog with categories and brands, use search and filters, add products to the cart, create an account, place an order, and track its history — all from their phone, including on-site and on the job.\n\nHow it's built:\nTwo fully native apps: iOS in Swift / SwiftUI and Android in Kotlin — each built with its platform's native SDK for maximum fluidity, performance, and full access to device features. Product data, cart, and orders are pulled from the store's existing backend (PrestaShop) through its API, so the app runs on the same data and processes as the store — no migration and no second database to maintain.\n\nWhy this way:\n• Native instead of hybrid (Capacitor / React Native) — full fluidity, speed, and access to the camera, notifications, and gestures; the app works and feels like part of the OS, not a web page in a wrapper.\n• PrestaShop API integration — orders and customers from the app land in the system the store already runs on; we don't duplicate the catalog or stock.\n• Mobile-first — tool shopping happens fast, from the phone, often one-handed on a site; the app is designed for that better than the mobile web version.\n\nOutcome:\nJedmar got its own branded shopping app for iOS and Android, running on its store's data. The app is complete and tested; it is not yet published on the App Store or Google Play — publishing is the next step.",
    },
    status: "live" as ProjectStatus,
    category: "strony-zrobione" as const,
    kind: "mobile-app",
    liveUrl: "https://jedmar-shop.vercel.app",
    metric: { pl: "iOS + Android · natywnie", en: "iOS + Android · native" },
    tech: ["iOS", "Android", "Swift", "SwiftUI", "Kotlin", "PrestaShop API"],
    features: {
      pl: [
        "iOS + Android natywnie — osobne aplikacje w Swift / SwiftUI i Kotlinie, dopracowane pod każdą platformę",
        "Katalog produktów — kategorie, marki i karty produktów prosto z backendu sklepu",
        "Wyszukiwarka i filtry — szybkie znajdowanie sprzętu po nazwie i kategorii",
        "Koszyk i składanie zamówień — pełny proces zakupowy z poziomu telefonu",
        "Konto klienta — logowanie, dane i historia zamówień w aplikacji",
        "Integracja z PrestaShop — apka działa na danych i procesach istniejącego sklepu",
        "Mobile-first UX — interfejs zaprojektowany pod zakupy z telefonu, także w terenie",
        "Spójna marka Jedmar — własna aplikacja w identyfikacji wizualnej sklepu",
      ],
      en: [
        "Native iOS + Android — separate Swift / SwiftUI and Kotlin apps, polished for each platform",
        "Product catalog — categories, brands, and product pages straight from the store backend",
        "Search and filters — quickly find gear by name and category",
        "Cart and checkout — the full purchase flow from the phone",
        "Customer account — sign-in, details, and order history in the app",
        "PrestaShop integration — the app runs on the existing store's data and processes",
        "Mobile-first UX — an interface designed for shopping on the phone, including on-site",
        "Consistent Jedmar brand — a dedicated app in the store's visual identity",
      ],
    },
    tags: ["Mobile", "iOS", "Android", "E-commerce"],
    accentColor: "#ffd333",
    bgColor: "#1a1a0a",
    year: "2026",
    role: {
      pl: "Programo — projektowanie i development",
      en: "Programo — design and development",
    },
    screenshots: ["/screenshots/jedmar-app1.webp", "/screenshots/jedmar-app2.webp", "/screenshots/jedmar-app3.webp"],
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
    metric: { pl: "7 podstron · 3 sekcje sportowe", en: "7 pages · 3 sport sections" },
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
    screenshots: ["/screenshots/wks-hero.webp", "/screenshots/wks-cap2.webp", "/screenshots/wks-cap3.webp"],
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
    metric: { pl: "PL/EN · Email + Telegram lead", en: "PL/EN · Email + Telegram lead" },
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
    screenshots: ["/screenshots/wsafefinanse-hero.webp", "/screenshots/wsafefinanse-cap2.webp", "/screenshots/wsafefinanse-cap3.webp"],
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
    status: "planned",
    category: "nasze-systemy",
    liveUrl: "https://solvio-lac.vercel.app",
    metric: { pl: "OCR + AI · iOS + web", en: "OCR + AI · iOS + web" },
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
    screenshots: ["/screenshots/solvio-hero.webp", "/screenshots/solvio-cap2.webp", "/screenshots/solvio-cap3.webp"],
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
    metric: { pl: "Dane KRS · iOS + web", en: "KRS data · iOS + web" },
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
    screenshots: ["/screenshots/rejestr-pro-hero.webp", "/screenshots/rejestr-pro-cap2.webp", "/screenshots/rejestr-pro-cap4.webp"],
  },
  {
    slug: "pool-system",
    title: "Pool System",
    subtitle: {
      pl: "Od ściany basenu po klubowe command center",
      en: "From the pool wall to the club command center",
    },
    description: {
      pl: "Kompletny system pomiaru czasu dla klubów pływackich: hardware SwimTimer (±5 ms), aplikacja trenera i zawodnika oraz command center z planowaniem i analityką. Timing działa lokalnie — bez internetu na obiekcie — a live sesja wraca do planu i raportu bez przepisywania.",
      en: "A complete timing system for swimming clubs: SwimTimer hardware (±5 ms), coach and athlete apps, and a command center with planning and analytics. Timing runs locally — no venue internet needed — and the live session flows back into the plan and report with no re-entry.",
    },
    longDescription: {
      pl: "Co robi:\nPool System (SwimPlatform) to kompletny system pomiaru czasu dla klubów pływackich — od ściany basenu po klubowe command center. Dedykowany hardware SwimTimer mierzy czasy na torach z dokładnością ±5 ms, aplikacja trenera prowadzi sesję na żywo przy brzegu, a zawodnik widzi swój plan dnia, splity, tętno i postęp w telefonie. Całość domyka się w panelu klubu: planowanie mikrocykli, kontrola obciążeń, wyniki, starty i raporty. Jeden obieg danych zamiast stopera, kartki i Excela.\n\nNa czym jest zbudowany:\nHardware: touchpady start/meta na ESP32-C3 i centralny box na ESP32-S3, komunikacja ESP-NOW, pomiar tętna przez BLE (Polar), lokalny access point z WebSocket — timing i tablica wyników działają nawet bez internetu na obiekcie. Aplikacje: natywny klient iOS (SwiftUI) oraz webowe coach cockpit i athlete app (Next.js + Supabase), spięte z boxem w czasie rzeczywistym. Command center: planowanie, analityka obciążeń i raporty z eksportem LENEX / CSV.\n\nDlaczego tak:\nWłasny hardware daje pełną kontrolę nad dokładnością pomiaru i niezależność od drogich, zamkniętych systemów. ESP-NOW i lokalny AP eliminują zależność od WiFi obiektu — start serii nigdy nie czeka na sieć. Jeden model danych dla hardware, aplikacji i analityki sprawia, że live sesja realnie wraca do planu i raportu. Klub zaczyna od pilota na jednym torze i skaluje wdrożenie w swoim tempie — do ośmiu torów i pełnej pływalni.",
      en: "What it does:\nPool System (SwimPlatform) is a complete timing system for swimming clubs — from the pool wall to the club command center. Dedicated SwimTimer hardware measures lane times to ±5 ms, the coach app runs the session live at poolside, and each swimmer sees their daily plan, splits, heart rate and progress on their phone. It all closes in the club panel: microcycle planning, load control, results, meets and reports. One data loop instead of a stopwatch, paper and Excel.\n\nStack:\nHardware: start/finish touchpads on ESP32-C3 and a central box on ESP32-S3, ESP-NOW radio, heart rate over BLE (Polar), a local access point with WebSocket — timing and the scoreboard work even without venue internet. Apps: a native iOS client (SwiftUI) plus web coach cockpit and athlete app (Next.js + Supabase), paired with the box in real time. Command center: planning, load analytics and reports with LENEX / CSV export.\n\nWhy:\nOwn hardware means full control over measurement accuracy and independence from expensive, closed systems. ESP-NOW and a local AP remove any dependence on venue WiFi — a heat never waits for the network. One data model across hardware, apps and analytics means the live session actually flows back into the plan and report. A club starts with a one-lane pilot and scales at its own pace — up to eight lanes and a full pool.",
    },
    status: "development",
    category: "nasze-systemy",
    liveUrl: "https://swimplatform.vercel.app",
    metric: { pl: "Timing ±5 ms · 1–8 torów · hardware + apki + SaaS", en: "±5 ms timing · 1–8 lanes · hardware + apps + SaaS" },
    tech: ["ESP32", "ESP-NOW", "BLE / Polar HR", "SwiftUI", "Next.js", "Supabase", "WebSocket", "TFT_eSPI", "Vercel"],
    features: {
      pl: [
        "Timing ±5 ms — touchpady start/meta i centralny box SwimTimer mierzą serie z autorytatywną dokładnością",
        "Coach cockpit na żywo — trener prowadzi sesję z iPada: tory, splity, obecność i tętno na jednym ekranie",
        "Aplikacja zawodnika — plan dnia, splity, PB i feedback w telefonie, bez czekania na raport trenera",
        "Command center klubu — planowanie mikrocykli, obciążenia, wyniki i raporty w jednym panelu",
        "Tętno na żywo — paski Polar przez BLE spięte z sesją i obciążeniem, strefy liczone na bieżąco",
        "Działa bez internetu — lokalny access point i ESP-NOW; timing oraz tablica nie zależą od sieci obiektu",
        "Eksport LENEX / CSV — wyniki i raporty wychodzą z systemu gotowe do dalszej obróbki",
        "Od 1 do 8 torów — start od pilota na jednym torze, skalowanie do pełnej pływalni",
      ],
      en: [
        "±5 ms timing — SwimTimer start/finish touchpads and a central box measure heats with authoritative accuracy",
        "Live coach cockpit — the coach runs the session from an iPad: lanes, splits, attendance and heart rate on one screen",
        "Athlete app — daily plan, splits, PBs and feedback on the phone, no waiting for the coach's report",
        "Club command center — microcycle planning, load, results and reports in a single panel",
        "Live heart rate — Polar straps over BLE tied to the session and load, zones computed on the fly",
        "Works offline — a local access point and ESP-NOW; timing and the scoreboard never depend on venue WiFi",
        "LENEX / CSV export — results and reports leave the system ready for further processing",
        "From 1 to 8 lanes — start with a one-lane pilot, scale to a full pool",
      ],
    },
    tags: ["Hardware", "Timing", "Mobile"],
    accentColor: "#0b59db",
    bgColor: "#07172d",
    year: "2026",
    role: {
      pl: "Programo — hardware, design i development",
      en: "Programo — hardware, design and development",
    },
    screenshots: ["/screenshots/pool-system-hero.webp", "/screenshots/pool-system-cap2.webp", "/screenshots/pool-system-cap3.webp"],
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
