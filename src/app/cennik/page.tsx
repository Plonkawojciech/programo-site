import type { Metadata } from "next";
import Pricing from "@/components/pricing";

export const metadata: Metadata = {
  title: "Cennik — Programo",
  description:
    "Przejrzysty model rozliczeń. Orientacyjne zakresy cen dla stron, aplikacji SaaS i projektów customowych.",
  alternates: { canonical: "https://programo.pl/cennik" },
};

export default function CennikPage() {
  return (
    <div className="pt-24 md:pt-32">
      <Pricing />
    </div>
  );
}
