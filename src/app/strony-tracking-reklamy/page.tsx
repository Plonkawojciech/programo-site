import type { Metadata } from "next";
import MarketingTrackingLanding from "@/components/marketing-tracking";

// Metadata: content-deck-2026-07.md section 8.
export const metadata: Metadata = {
  title: "Strony internetowe z trackingiem i kampanią Google Ads | Programo",
  description:
    "Strona, pomiar konwersji (GA4, Consent Mode v2) i kampania Google Ads w jednych rękach. Pracujemy też na Twojej istniejącej stronie. Odpowiadamy w 24 h.",
  alternates: { canonical: "https://programo.pl/strony-tracking-reklamy" },
  openGraph: {
    title: "Strony internetowe z trackingiem i kampanią Google Ads | Programo",
    description:
      "Strona, pomiar konwersji (GA4, Consent Mode v2) i kampania Google Ads w jednych rękach.",
    url: "https://programo.pl/strony-tracking-reklamy",
    siteName: "Programo",
    locale: "pl_PL",
    type: "website",
  },
  robots: { index: true, follow: true },
  keywords: [
    "tracking konwersji strona internetowa",
    "kampania google ads dla firm",
    "consent mode v2",
    "enhanced conversions google ads",
    "ga4 wdrożenie",
    "strona pod reklamy google",
    "prowadzenie kampanii google ads",
    "software house poznań reklamy",
  ],
};

const breadcrumbJsonLd = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: "Programo", item: "https://programo.pl" },
    {
      "@type": "ListItem",
      position: 2,
      name: "Strony, tracking i reklamy",
      item: "https://programo.pl/strony-tracking-reklamy",
    },
  ],
};

const serviceJsonLd = {
  "@context": "https://schema.org",
  "@type": "Service",
  serviceType: "Strony internetowe, tracking konwersji i kampanie Google Ads",
  name: "Strony, tracking i reklamy Google — Programo",
  provider: { "@id": "https://programo.pl/#organization" },
  areaServed: [
    { "@type": "Country", name: "Polska" },
    { "@type": "City", name: "Poznań" },
  ],
  description:
    "Strona lub landing zaprojektowane pod jedno działanie, pomiar konwersji zgodny z Consent Mode v2 (GA4, enhanced conversions) i kampania Google Ads zbudowana oraz prowadzona przez Programo. Pracujemy też na istniejącej stronie klienta.",
  url: "https://programo.pl/strony-tracking-reklamy",
};

const faqs = [
  {
    q: "Mam już stronę. Czy musicie budować nową?",
    a: "Nie. Jeśli Twoja strona działa, wpinamy pomiar i prowadzimy kampanię na tym, co masz — dokładnie tak pracujemy z Domkami Poznaniak. Nową stronę proponujemy tylko wtedy, gdy obecna realnie blokuje konwersję, i wtedy pokazujemy dlaczego.",
  },
  {
    q: "Czy tracking jest zgodny z RODO?",
    a: "Tak. Wdrażamy Consent Mode v2 z banerem zgód, w którym „Odrzuć” działa naprawdę: bez zgody użytkownika żaden piksel reklamowy się nie uruchamia. Pomiar konwersji opieramy na rozwiązaniach Google zaprojektowanych do pracy w tym modelu.",
  },
  {
    q: "Jaki budżet reklamowy ma sens na start?",
    a: "To zależy od branży i stawek za kliknięcie, dlatego nie podamy jednej liczby w ciemno. Na pierwszej rozmowie sprawdzamy realne stawki dla Twoich fraz i rekomendujemy budżet z twardym limitem miesięcznym. Decyzja o uruchomieniu i wysokości budżetu zawsze należy do Ciebie.",
  },
];

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function StronyTrackingReklamyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <MarketingTrackingLanding />
    </>
  );
}
