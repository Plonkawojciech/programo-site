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
  screenshot?: string;
}

export const projects: Project[] = [
  {
    slug: "estalo",
    title: "Estalo",
    subtitle: {
      pl: "CRM dla nieruchomości",
      en: "CRM for Real Estate",
    },
    description: {
      pl: "Platforma SaaS CRM dla polskich biur nieruchomości. Zarządzanie ofertami, leadami, SMS-ami oraz integracje z portalami Otodom, NOE 2.0 i Domy.pl. Wspierana przez Azure AI.",
      en: "SaaS CRM platform for Polish real estate agencies. Manages property listings, leads, SMS communications, and integrations with Otodom, NOE 2.0, and Domy.pl portals. Powered by Azure AI.",
    },
    longDescription: {
      pl: "Estalo to kompletna platforma CRM zaprojektowana specjalnie dla polskich biur nieruchomości. System umożliwia centralne zarządzanie ofertami nieruchomości, automatyczne publikowanie ogłoszeń na głównych portalach, obsługę leadów i komunikację SMS z klientami. Dzięki integracji z Azure AI, platforma oferuje inteligentne dopasowywanie ofert do zapytań klientów oraz automatyczne generowanie opisów nieruchomości.",
      en: "Estalo is a complete CRM platform designed specifically for Polish real estate agencies. The system enables centralized property listing management, automatic publishing to major portals, lead handling, and SMS communication with clients. Thanks to Azure AI integration, the platform offers intelligent matching of listings to client inquiries and automatic property description generation.",
    },
    status: "live",
    liveUrl: "https://estalo.pl",
    tech: ["Next.js", "TypeScript", "Supabase", "Azure AI", "Capacitor"],
    features: {
      pl: [
        "Zarządzanie ofertami nieruchomości",
        "System leadów i CRM",
        "Komunikacja SMS z klientami",
        "Integracja z Otodom",
        "Integracja z NOE 2.0 i Domy.pl",
        "Inteligentne dopasowywanie ofert (AI)",
        "Aplikacja mobilna (Capacitor)",
      ],
      en: [
        "Property listings management",
        "Leads and CRM system",
        "SMS communication with clients",
        "Otodom integration",
        "NOE 2.0 and Domy.pl integration",
        "Intelligent listing matching (AI)",
        "Mobile app (Capacitor)",
      ],
    },
    tags: ["SaaS", "CRM", "AI"],
    accentColor: "#c8a951",
    bgColor: "#1a1a1a",
    year: "2025",
    role: {
      pl: "Projektowanie i development full-stack",
      en: "Full-stack Design & Development",
    },
    screenshot: "/screenshots/estalo-hero.png",
  },
  {
    slug: "baulx",
    title: "Baulx",
    subtitle: {
      pl: "Inżynieria CNC drewna",
      en: "CNC Timber Engineering",
    },
    description: {
      pl: "Wielofunkcyjna platforma CNC z konwersją plików (WUP, BTLx, TCN, G-code), parametrycznymi projektantami ścian, dachów i stropów, kalkulatorami konstrukcyjnymi i wizualizacją 3D.",
      en: "Multi-featured CNC platform with file conversion (WUP, BTLx, TCN, G-code), parametric designers for walls, roofs and floors, structural calculators, and 3D visualization tools.",
    },
    longDescription: {
      pl: "Baulx to zaawansowana platforma inżynierska stworzona dla branży budownictwa drewnianego. Umożliwia konwersję plików między formatami CNC (WUP, BTLx, TCN, G-code), projektowanie parametryczne konstrukcji ścian, dachów i stropów, a także kalkulacje strukturalne. Wbudowana wizualizacja 3D pozwala na podgląd projektów w czasie rzeczywistym.",
      en: "Baulx is an advanced engineering platform built for the timber construction industry. It enables file conversion between CNC formats (WUP, BTLx, TCN, G-code), parametric design of wall, roof, and floor structures, and structural calculations. Built-in 3D visualization allows real-time project preview.",
    },
    status: "live",
    liveUrl: "https://btlx-viewer.vercel.app",
    tech: ["Next.js", "TypeScript", "Three.js"],
    features: {
      pl: [
        "Konwersja plików WUP/BTLx/TCN/G-code",
        "Parametryczny projektant ścian",
        "Parametryczny projektant dachów",
        "Parametryczny projektant stropów",
        "Kalkulatory konstrukcyjne",
        "Wizualizacja 3D w przeglądarce",
      ],
      en: [
        "WUP/BTLx/TCN/G-code file conversion",
        "Parametric wall designer",
        "Parametric roof designer",
        "Parametric floor designer",
        "Structural calculators",
        "3D visualization in browser",
      ],
    },
    tags: ["Platform", "3D", "Engineering"],
    accentColor: "#5ba4c9",
    bgColor: "#0f1b2d",
    year: "2024",
    role: {
      pl: "Projektowanie i development full-stack",
      en: "Full-stack Design & Development",
    },
    screenshot: "/screenshots/baulx-hero.png",
  },
  {
    slug: "sporttrack",
    title: "SportTrack",
    subtitle: {
      pl: "Ekosystem dla sportowców",
      en: "Athlete Ecosystem",
    },
    description: {
      pl: "Ekosystem dla sportowców — plany treningowe, śledzenie wyników, analityka wydajności i integracja z trenerami.",
      en: "Ecosystem for athletes — training plans, performance tracking, analytics, and coach integration.",
    },
    longDescription: {
      pl: "SportTrack to kompleksowy ekosystem cyfrowy zaprojektowany dla sportowców i trenerów. Platforma obejmuje aplikację mobilną i panel webowy, umożliwiając tworzenie planów treningowych, śledzenie treningów w czasie rzeczywistym, zaawansowaną analitykę wydajności oraz komunikację między sportowcem a trenerem.",
      en: "SportTrack is a comprehensive digital ecosystem designed for athletes and coaches. The platform includes a mobile app and web dashboard, enabling training plan creation, real-time workout tracking, advanced performance analytics, and athlete-coach communication.",
    },
    status: "planned",
    tech: ["React Native", "Next.js", "TypeScript", "Supabase"],
    features: {
      pl: [
        "Tworzenie planów treningowych",
        "Śledzenie treningów w czasie rzeczywistym",
        "Analityka wydajności",
        "Integracja z trenerami",
        "Historia i statystyki",
        "Powiadomienia i przypomnienia",
      ],
      en: [
        "Training plan creation",
        "Real-time workout tracking",
        "Performance analytics",
        "Coach integration",
        "History and statistics",
        "Notifications and reminders",
      ],
    },
    tags: ["Mobile", "Health", "Analytics"],
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
