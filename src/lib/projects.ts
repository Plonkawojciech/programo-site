import type { Lang } from "./i18n";

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
      pl: "Platforma SaaS CRM dla polskich biur nieruchomości. 2 plany: Solo (indywidualni agenci) i Enterprise (biura). Integracje z Otodom, NOE 2.0, Domy.pl. Azure AI. W przygotowaniu: Estalo Portal — polski portal nieruchomości nowej generacji.",
      en: "SaaS CRM platform for Polish real estate agencies. 2 plans: Solo (individual agents) and Enterprise (agencies). Integrations with Otodom, NOE 2.0, Domy.pl. Azure AI. Coming soon: Estalo Portal — next-gen Polish property marketplace.",
    },
    longDescription: {
      pl: "Estalo to kompletna platforma CRM zaprojektowana specjalnie dla polskich biur nieruchomości, dostępna w dwóch planach:\n\n• Estalo Solo — plan dla indywidualnych agentów i małych biur. Zarządzanie ofertami, leady, komunikacja SMS, integracja z Otodom, inteligentne dopasowywanie ofert AI.\n\n• Estalo Enterprise — plan dla większych biur nieruchomości. Wszystko z Solo + zarządzanie zespołem agentów, zaawansowane raportowanie, multi-integracja (NOE 2.0, Domy.pl, Morizon), automatyzacja workflow, API.\n\nW przygotowaniu: Estalo Portal — polski portal nieruchomości nowej generacji, alternatywa dla Otodom. Nowoczesny marketplace z AI-powered wyszukiwaniem, lepszym UX i niższymi prowizjami dla biur.",
      en: "Estalo is a complete CRM platform designed specifically for Polish real estate agencies, available in two plans:\n\n• Estalo Solo — plan for individual agents and small agencies. Listing management, leads, SMS communication, Otodom integration, AI-powered listing matching.\n\n• Estalo Enterprise — plan for larger real estate agencies. Everything from Solo + agent team management, advanced reporting, multi-integration (NOE 2.0, Domy.pl, Morizon), workflow automation, API.\n\nComing soon: Estalo Portal — next-generation Polish property marketplace, an alternative to Otodom. Modern marketplace with AI-powered search, better UX, and lower fees for agencies.",
    },
    status: "live",
    liveUrl: "https://estalo.pl",
    tech: ["Next.js", "TypeScript", "Supabase", "Azure AI", "Capacitor", "Resend"],
    features: {
      pl: [
        "Estalo Solo — CRM dla indywidualnych agentów i małych biur",
        "Estalo Enterprise — CRM dla biur z zespołem, raportowanie, multi-integracja",
        "Integracja z Otodom, NOE 2.0, Domy.pl",
        "System leadów, komunikacja SMS (SMSAPI.pl)",
        "Inteligentne dopasowywanie ofert (Azure AI)",
        "Automatyczne generowanie opisów nieruchomości",
        "Aplikacja mobilna (Capacitor)",
        "🔜 Estalo Portal — portal nieruchomości nowej generacji (coming soon)",
      ],
      en: [
        "Estalo Solo — CRM for individual agents and small agencies",
        "Estalo Enterprise — CRM for teams, reporting, multi-integration",
        "Integration with Otodom, NOE 2.0, Domy.pl",
        "Lead system, SMS communication (SMSAPI.pl)",
        "Intelligent listing matching (Azure AI)",
        "Automatic property description generation",
        "Mobile app (Capacitor)",
        "🔜 Estalo Portal — next-gen property marketplace (coming soon)",
      ],
    },
    tags: ["SaaS", "CRM", "AI", "Marketplace"],
    accentColor: "#c8a951",
    bgColor: "#1a1a1a",
    year: "2025–2026",
    role: {
      pl: "Projektowanie i development full-stack",
      en: "Full-stack Design & Development",
    },
    screenshots: ["/screenshots/estalo-1.png", "/screenshots/estalo-2.png"],
  },
  {
    slug: "baulx",
    title: "Baulx",
    subtitle: {
      pl: "Platforma CNC dla budownictwa drewnianego — 4 produkty + 1 w drodze",
      en: "CNC Platform for Timber Construction — 4 Products + 1 Coming Soon",
    },
    description: {
      pl: "Ekosystem 4 produktów dla prefabrykacji drewnianej: Convert (konwersja CNC), Design (projektanci parametryczni), Calc (inżynieria EC5) i Platform (pakiet 3w1). Piąty produkt — Baulx Sell (CRM) — w przygotowaniu.",
      en: "Ecosystem of 4 products for timber prefabrication: Convert (CNC conversion), Design (parametric designers), Calc (EC5 engineering), and Platform (all-in-one bundle). Fifth product — Baulx Sell (CRM) — coming soon.",
    },
    longDescription: {
      pl: "Baulx to kompletny ekosystem oprogramowania dla branży budownictwa drewnianego i prefabrykacji CNC. Platforma składa się z 4 samodzielnych produktów, które razem tworzą pełny pipeline od projektu po maszynę CNC:\n\n• Baulx Convert — konwersja plików WUP → TCN, BTLx → G-code, 5 post-procesorów, przetwarzanie wsadowe, BOM, REST API i CNC Studio HMI.\n\n• Baulx Design — parametryczne projektanty ścian, dachów, stropów i budynków w przeglądarce. CLT panele, nisze instalacyjne, dormery, system łacenia, rysunki warsztatowe, generator AI ścian.\n\n• Baulx Calc — kalkulator konstrukcyjny Eurocode 5 z 12 modułami, złącza ciesielskie, przeglądarka IFC, nesting paneli FFDH, asystent AI EC5, kalkulatory U-Value i fundamentów.\n\n• Baulx Platform — pakiet 3w1 łączący Convert + Design + Calc w jednej subskrypcji z 20% rabatem.\n\nW przygotowaniu: Baulx Sell — CRM dla producentów domów drewnianych, zarządzanie klientami, ofertami i procesem sprzedaży.",
      en: "Baulx is a complete software ecosystem for the timber construction and CNC prefabrication industry. The platform consists of 4 standalone products that together form a full pipeline from design to CNC machine:\n\n• Baulx Convert — WUP → TCN, BTLx → G-code file conversion, 5 post-processors, batch processing, BOM, REST API, and CNC Studio HMI.\n\n• Baulx Design — parametric wall, roof, floor and building designers in the browser. CLT panels, installation niches, dormers, batten system, shop drawings, AI wall generator.\n\n• Baulx Calc — Eurocode 5 structural calculator with 12 modules, timber joints, IFC viewer, FFDH panel nesting, AI EC5 assistant, U-Value and foundation calculators.\n\n• Baulx Platform — all-in-one bundle combining Convert + Design + Calc in one subscription at 20% discount.\n\nComing soon: Baulx Sell — CRM for timber house manufacturers, managing clients, quotes, and sales pipeline.",
    },
    status: "live",
    liveUrl: "https://baulx.pl",
    tech: ["JavaScript", "Python", "Three.js", "Konva.js", "Vercel", "Eurocode 5"],
    features: {
      pl: [
        "Baulx Convert — konwersja WUP/BTLx → TCN/G-code, 5 post-procesorów, CNC Studio HMI",
        "Baulx Design — projektanty ścian, dachów, stropów i budynków, CLT, dormery, generator AI",
        "Baulx Calc — kalkulator EC5 (12 modułów), IFC viewer, nesting, złącza, U-Value",
        "Baulx Platform — pakiet 3w1 (Convert + Design + Calc), -20%",
        "20+ narzędzi inżynierskich dostępnych w przeglądarce bez instalacji",
        "Przetwarzanie wsadowe, BOM, REST API do integracji z ERP/MES",
        "Wizualizacja 3D, rysunki warsztatowe SVG, plan transportu",
        "🔜 Baulx Sell — CRM dla producentów domów drewnianych (coming soon)",
      ],
      en: [
        "Baulx Convert — WUP/BTLx → TCN/G-code conversion, 5 post-processors, CNC Studio HMI",
        "Baulx Design — wall, roof, floor & building designers, CLT, dormers, AI generator",
        "Baulx Calc — EC5 calculator (12 modules), IFC viewer, nesting, joints, U-Value",
        "Baulx Platform — all-in-one bundle (Convert + Design + Calc), -20%",
        "20+ engineering tools available in browser with no installation",
        "Batch processing, BOM, REST API for ERP/MES integration",
        "3D visualization, SVG shop drawings, transport planning",
        "🔜 Baulx Sell — CRM for timber house manufacturers (coming soon)",
      ],
    },
    tags: ["Platform", "CNC", "Engineering", "SaaS"],
    accentColor: "#22c55e",
    bgColor: "#080f1e",
    year: "2024–2026",
    role: {
      pl: "Projektowanie i development full-stack",
      en: "Full-stack Design & Development",
    },
    screenshots: ["/screenshots/baulx-1.png", "/screenshots/baulx-2.png"],
  },
  {
    slug: "athlix",
    title: "Athlix",
    subtitle: {
      pl: "Ekosystem dla sportowców — Pilot + TrainMate",
      en: "Athlete Ecosystem — Pilot + TrainMate",
    },
    description: {
      pl: "Ekosystem dla sportowców i trenerów — planowanie treningów, śledzenie wyników, analityka wydajności, integracja z urządzeniami ANT+/BLE. Dwa moduły: Athlix Pilot (nawigacja + trening) i Athlix TrainMate (trener AI).",
      en: "Ecosystem for athletes and coaches — training planning, performance tracking, analytics, ANT+/BLE device integration. Two modules: Athlix Pilot (navigation + training) and Athlix TrainMate (AI coach).",
    },
    longDescription: {
      pl: "Athlix to kompleksowy ekosystem cyfrowy dla sportowców i trenerów, rozwijany w ramach spółki cywilnej Programo. Platforma obejmuje aplikację mobilną i panel webowy z dwoma głównymi modułami:\n\n• Athlix Pilot — nawigacja treningowa, śledzenie aktywności w czasie rzeczywistym, integracja z czujnikami ANT+/BLE (pulsometry, mierniki mocy, kadencji), mapy tras.\n\n• Athlix TrainMate — asystent treningowy AI, tworzenie planów treningowych, analityka wydajności, komunikacja sportowiec-trener, rekomendacje oparte na danych.",
      en: "Athlix is a comprehensive digital ecosystem for athletes and coaches, developed under the Programo civil partnership. The platform includes a mobile app and web dashboard with two main modules:\n\n• Athlix Pilot — training navigation, real-time activity tracking, ANT+/BLE sensor integration (heart rate monitors, power meters, cadence sensors), route maps.\n\n• Athlix TrainMate — AI training assistant, training plan creation, performance analytics, athlete-coach communication, data-driven recommendations.",
    },
    status: "planned",
    tech: ["React Native", "Expo", "Next.js", "TypeScript", "Supabase"],
    features: {
      pl: [
        "Athlix Pilot — nawigacja treningowa i śledzenie aktywności",
        "Athlix TrainMate — asystent treningowy AI",
        "Integracja ANT+/BLE (pulsometry, mierniki mocy)",
        "Tworzenie i zarządzanie planami treningowymi",
        "Zaawansowana analityka wydajności",
        "Komunikacja sportowiec–trener",
        "Aplikacja mobilna (React Native + Expo)",
      ],
      en: [
        "Athlix Pilot — training navigation and activity tracking",
        "Athlix TrainMate — AI training assistant",
        "ANT+/BLE integration (HR monitors, power meters)",
        "Training plan creation and management",
        "Advanced performance analytics",
        "Athlete–coach communication",
        "Mobile app (React Native + Expo)",
      ],
    },
    tags: ["Mobile", "Sport", "AI", "Analytics"],
    accentColor: "#6abf69",
    bgColor: "#1a2e1a",
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
