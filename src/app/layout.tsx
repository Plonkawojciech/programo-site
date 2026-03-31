import type { Metadata } from "next";
import { Newsreader, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { LenisProvider } from "@/components/ui/lenis-provider";

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
    <html lang="pl" className={`${newsreader.variable} ${jakarta.variable} selection:bg-coral/20 selection:text-coral`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased bg-dark text-text overflow-x-hidden">
        <LenisProvider>
          <div className="noise" />
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
