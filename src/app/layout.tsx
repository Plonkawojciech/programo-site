import type { Metadata } from "next";
import { Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import Providers from "@/components/providers";

const GA_ID = "G-TGLPLMVV91";
const CLARITY_ID = "wxezq44wx0";


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
  title: "Programo — Studio Software z Poznania",
  description:
    "Projektujemy i budujemy oprogramowanie. Studio software Wojciecha Płonki i Bartosza Kolaja z Poznania.",
  metadataBase: new URL("https://programo.pl"),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  keywords: [
    "software studio",
    "web development",
    "Next.js",
    "React",
    "TypeScript",
    "Poznań",
    "Poland",
    "Programo",
  ],
  authors: [
    { name: "Wojciech Płonka" },
    { name: "Bartosz Kolaj" },
  ],
  openGraph: {
    title: "Programo — Studio Software z Poznania",
    description:
      "Projektujemy i budujemy oprogramowanie. Studio software Wojciecha Płonki i Bartosza Kolaja z Poznania.",
    url: "https://programo.pl",
    siteName: "Programo",
    locale: "pl_PL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Programo — Studio Software z Poznania",
    description:
      "Projektujemy i budujemy oprogramowanie. Studio software z Poznania.",
  },
  alternates: {
    canonical: "https://programo.pl",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "@id": "https://programo.pl/#organization",
  name: "Programo",
  alternateName: ["Programo Software House", "Programo Studio"],
  description:
    "Software house z Poznania — oprogramowanie na zamówienie: strony, aplikacje webowe i mobilne, systemy SaaS oraz integracje AI.",
  url: "https://programo.pl",
  logo: "https://programo.pl/programo-logo-gradient.svg",
  image: "https://programo.pl/opengraph-image",
  email: "biuro@programo.pl",
  telephone: "+48797222363",
  priceRange: "$$",
  knowsLanguage: ["pl", "en"],
  founders: [
    { "@type": "Person", name: "Wojciech Płonka", jobTitle: "Design & Product" },
    { "@type": "Person", name: "Bartosz Kolaj", jobTitle: "Engineering" },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Poznań",
    addressRegion: "wielkopolskie",
    addressCountry: "PL",
  },
  areaServed: [
    { "@type": "City", name: "Poznań" },
    { "@type": "AdministrativeArea", name: "Wielkopolska" },
    { "@type": "Country", name: "Polska" },
  ],
  sameAs: [
    "https://github.com/programo",
    "https://linkedin.com/company/programo",
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
        {/* Preconnect to third-party (analytics) origins for faster first contact */}
        <link rel="preconnect" href="https://www.googletagmanager.com" />
        <link rel="preconnect" href="https://www.clarity.ms" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://www.clarity.ms" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('programo-theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}else{document.documentElement.setAttribute('data-theme','light');}}catch(e){}})();`,
          }}
        />
        {/* Google Consent Mode v2 — defaults set BEFORE gtag.js loads */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});var s=null;try{s=localStorage.getItem('programo-consent-v1');}catch(e){}if(s){try{var c=JSON.parse(s);gtag('consent','update',{ad_storage:c.marketing?'granted':'denied',ad_user_data:c.marketing?'granted':'denied',ad_personalization:c.marketing?'granted':'denied',analytics_storage:c.analytics?'granted':'denied'});}catch(e){}}`,
          }}
        />
        {/* Google tag (gtag.js) — inlined directly in <head> for Search Console verification */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `gtag('js', new Date());gtag('config', '${GA_ID}');`,
          }}
        />
        {/* Microsoft Clarity — only loaded if user has granted analytics consent */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var s=localStorage.getItem('programo-consent-v1');if(!s)return;var c=JSON.parse(s);if(!c||!c.analytics)return;(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window, document, "clarity", "script", "${CLARITY_ID}");}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased bg-surface text-on-surface overflow-x-hidden">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
