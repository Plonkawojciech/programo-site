import type { Metadata } from "next";
import Pricing from "@/components/pricing";

export const metadata: Metadata = {
  title: "Wycena — Programo",
  description:
    "Każdy projekt wyceniamy indywidualnie. Po krótkiej rozmowie przygotowujemy konkretną wycenę z widełkami i podziałem na etapy — przejrzyście i bez ukrytych kosztów.",
  alternates: { canonical: "https://programo.pl/cennik" },
};

export default function CennikPage() {
  return (
    <div className="pt-24 md:pt-32">
      <Pricing />
    </div>
  );
}
