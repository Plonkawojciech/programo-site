import type { Metadata } from "next";
import FeaturedWork from "@/components/featured-work";

export const metadata: Metadata = {
  title: "Projekty i realizacje - produkty i praca dla klientów | Programo",
  description:
    "Portfolio Programo: natywne aplikacje Jedmar w App Store i Google Play, CRM Estalo, strony i kampanie Google Ads. Każdy projekt można kliknąć i sprawdzić.",
  alternates: { canonical: "https://programo.pl/projekty" },
};

export default function ProjektyPage() {
  return (
    <div className="pt-20 md:pt-24">
      <FeaturedWork />
    </div>
  );
}
