import type { Metadata } from "next";
import About from "@/components/about";

export const metadata: Metadata = {
  title: "O nas - dwóch inżynierów z Poznania | Programo",
  description:
    "Programo s.j. to Wojciech Płonka i Bartosz Kolaj. Projektujemy i budujemy oprogramowanie sami - bez handlowców i podwykonawców. Poznań, cała Polska zdalnie.",
  alternates: { canonical: "https://programo.pl/o-nas" },
  openGraph: {
    title: "O nas - dwóch inżynierów z Poznania | Programo",
    description: "Programo s.j. to Wojciech Płonka i Bartosz Kolaj. Projektujemy i budujemy oprogramowanie sami.",
    url: "https://programo.pl/o-nas",
    siteName: "Programo",
    locale: "pl_PL",
    type: "website",
  },
};

export default function ONasPage() {
  return (
    <div className="pt-20 md:pt-24">
      <About />
    </div>
  );
}
