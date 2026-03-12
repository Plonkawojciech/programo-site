import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Programo — Software Studio",
  description:
    "We build software that works. A software studio by Wojciech Płonka & Bartosz Kołaj, based in Poznań, Poland.",
  keywords: [
    "software studio",
    "web development",
    "Next.js",
    "React Native",
    "Poznań",
    "Poland",
  ],
  authors: [
    { name: "Wojciech Płonka" },
    { name: "Bartosz Kołaj" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
