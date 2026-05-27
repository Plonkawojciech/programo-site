import type { Metadata } from "next";
import { Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Providers from "@/components/providers";

const GA_ID = "G-TGLPLMVV91";


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
  "@type": "Organization",
  name: "Programo",
  url: "https://programo.pl",
  founders: [
    { "@type": "Person", name: "Wojciech Płonka" },
    { "@type": "Person", name: "Bartosz Kolaj" },
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Poznań",
    addressCountry: "PL",
  },
  sameAs: ["https://github.com/programo"],
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
            __html: `(function(){try{var t=localStorage.getItem('programo-theme');if(t==='light'||t==='dark'){document.documentElement.setAttribute('data-theme',t);}else{document.documentElement.setAttribute('data-theme','light');}}catch(e){}})();`,
          }}
        />
        {/* Google Consent Mode v2 — defaults set BEFORE gtag.js loads */}
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',functionality_storage:'granted',security_storage:'granted',wait_for_update:500});var s=null;try{s=localStorage.getItem('programo-consent-v1');}catch(e){}if(s){try{var c=JSON.parse(s);gtag('consent','update',{ad_storage:c.marketing?'granted':'denied',ad_user_data:c.marketing?'granted':'denied',ad_personalization:c.marketing?'granted':'denied',analytics_storage:c.analytics?'granted':'denied'});}catch(e){}}`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased bg-surface text-on-surface overflow-x-hidden">
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
