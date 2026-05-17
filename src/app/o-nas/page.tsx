import type { Metadata } from "next";
import About from "@/components/about";

export const metadata: Metadata = {
  title: "O nas — Programo",
  description:
    "Dwóch inżynierów, jedno studio. Programo to studio software założone przez Wojciecha Płonkę i Bartosza Kolaja w Poznaniu.",
  alternates: { canonical: "https://programo.pl/o-nas" },
};

export default function ONasPage() {
  return (
    <div className="pt-24 md:pt-32">
      <About />
    </div>
  );
}
