import type { Metadata } from "next";
import { Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";


const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  preload: true,
  style: ["normal", "italic"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  preload: true,
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Software House Poznań — Programo | Tworzenie oprogramowania, SaaS, aplikacje webowe",
  description:
    "Programo — software house z Poznania. Tworzymy oprogramowanie na zamówienie, systemy SaaS, aplikacje webowe i mobilne. Next.js, React, TypeScript, AI. Bezpłatna wycena.",
  metadataBase: new URL("https://programo.pl"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  keywords: [
    "software house Poznań",
    "software house poznan",
    "software house",
    "tworzenie oprogramowania Poznań",
    "agencja software Poznań",
    "studio software Poznań",
    "tworzenie aplikacji webowych Poznań",
    "tworzenie aplikacji mobilnych Poznań",
    "programowanie na zlecenie Poznań",
    "SaaS Poznań",
    "Next.js Poznań",
    "React developer Poznań",
    "Programo",
  ],
  authors: [
    { name: "Wojciech Płonka" },
    { name: "Bartosz Kolaj" },
  ],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: "Software House Poznań — Programo",
    description:
      "Software house z Poznania. Systemy SaaS, aplikacje webowe i mobilne. Next.js, React, TypeScript, AI.",
    url: "https://programo.pl",
    siteName: "Programo",
    locale: "pl_PL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Software House Poznań — Programo",
    description:
      "Software house z Poznania. SaaS, aplikacje webowe i mobilne. Next.js, React, AI.",
  },
  alternates: {
    canonical: "https://programo.pl",
    languages: {
      "pl-PL": "https://programo.pl",
      "en-US": "https://programo.pl?lang=en",
    },
  },
  verification: {
    // Po założeniu Google Search Console wklej token tutaj:
    // google: "twoj-token-google-search-console",
  },
};

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://programo.pl/#organization",
  name: "Programo",
  alternateName: ["Programo Software House", "Programo Studio"],
  description:
    "Software house z Poznania. Tworzymy oprogramowanie na zamówienie — systemy SaaS, aplikacje webowe i mobilne, integracje AI. Next.js, React, TypeScript.",
  url: "https://programo.pl",
  logo: "https://programo.pl/apple-touch-icon.png",
  image: "https://programo.pl/apple-touch-icon.png",
  email: "kontakt@programo.pl",
  telephone: "+48797222363",
  priceRange: "$$",
  founders: [
    { "@type": "Person", name: "Wojciech Płonka", jobTitle: "Design & Product" },
    { "@type": "Person", name: "Bartosz Kolaj", jobTitle: "Engineering Lead" },
  ],
  foundingDate: "2026",
  taxID: "7792604466",
  vatID: "PL7792604466",
  identifier: [
    { "@type": "PropertyValue", propertyID: "NIP", value: "7792604466" },
    { "@type": "PropertyValue", propertyID: "KRS", value: "0001233841" },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Poznań",
    addressRegion: "wielkopolskie",
    addressCountry: "PL",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 52.4064,
    longitude: 16.9252,
  },
  areaServed: [
    { "@type": "City", name: "Poznań" },
    { "@type": "AdministrativeArea", name: "Wielkopolska" },
    { "@type": "Country", name: "Poland" },
    { "@type": "Country", name: "Polska" },
  ],
  serviceType: [
    "Software house",
    "Tworzenie oprogramowania",
    "Tworzenie aplikacji webowych",
    "Tworzenie aplikacji mobilnych",
    "Systemy SaaS",
    "Integracje AI",
    "Web development",
    "Custom software development",
  ],
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Usługi Programo",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Tworzenie aplikacji webowych",
          description:
            "Aplikacje webowe na zamówienie w Next.js, React, TypeScript.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Systemy SaaS",
          description:
            "Projektowanie i wdrożenia platform SaaS — multi-tenant, billing, role.",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Aplikacje mobilne",
          description: "Aplikacje iOS i Android (Capacitor, PWA, native).",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Integracje AI",
          description:
            "Wdrażanie modeli LLM, RAG, OCR, AI agentów w produktach klientów.",
        },
      },
    ],
  },
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+48797222363",
      email: "wojciech.plonka@programo.pl",
      contactType: "sales",
      areaServed: "PL",
      availableLanguage: ["Polish", "English"],
    },
    {
      "@type": "ContactPoint",
      telephone: "+48509123434",
      email: "bartosz.kolaj@programo.pl",
      contactType: "technical support",
      areaServed: "PL",
      availableLanguage: ["Polish", "English"],
    },
  ],
  sameAs: ["https://github.com/programo"],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://programo.pl/#website",
  url: "https://programo.pl",
  name: "Programo — Software House Poznań",
  inLanguage: "pl-PL",
  publisher: { "@id": "https://programo.pl/#organization" },
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Czy Programo to software house z Poznania?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tak. Programo to software house z siedzibą w Poznaniu, prowadzony przez Wojciecha Płonkę i Bartosza Kolaja. Tworzymy oprogramowanie na zamówienie — systemy SaaS, aplikacje webowe i mobilne.",
      },
    },
    {
      "@type": "Question",
      name: "Jakie technologie wykorzystuje software house Programo?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Next.js, React, TypeScript, Node.js, PostgreSQL (Neon, Supabase), Tailwind CSS, Capacitor (iOS/Android), Azure OpenAI, Anthropic Claude, Vercel. Specjalizujemy się w nowoczesnym stacku z integracjami AI.",
      },
    },
    {
      "@type": "Question",
      name: "Ile kosztuje stworzenie aplikacji w software house Programo?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Wycena zależy od zakresu projektu. Małe aplikacje webowe od kilku tysięcy złotych, kompletne systemy SaaS od kilkudziesięciu tysięcy. Skontaktuj się przez kontakt@programo.pl, by otrzymać bezpłatną wycenę.",
      },
    },
    {
      "@type": "Question",
      name: "Czy software house Programo realizuje projekty zdalnie poza Poznaniem?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Tak. Choć siedziba mieści się w Poznaniu, realizujemy projekty zdalnie dla klientów z całej Polski i z zagranicy. Komunikacja po polsku i angielsku.",
      },
    },
    {
      "@type": "Question",
      name: "Co odróżnia Programo od innych software house'ów w Poznaniu?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Jesteśmy butikowym, dwuosobowym studiem — bezpośrednia praca z założycielami, brak warstw pośredników, własne produkty SaaS w portfolio (Estalo CRM, Baulx, Athlix). AI-first podejście do każdego projektu.",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={`${newsreader.variable} ${jakarta.variable} selection:bg-primary/20 selection:text-primary`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('programo-theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}else{document.documentElement.setAttribute('data-theme','dark');}}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      </head>
      <body className="antialiased bg-surface text-on-surface overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
