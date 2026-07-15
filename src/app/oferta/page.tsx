import type { Metadata } from "next";
import Offer from "@/components/offer";

export const metadata: Metadata = {
  title: "Oferta — aplikacje, sklepy, strony i reklamy Google | Programo",
  description:
    "Aplikacje webowe i SaaS, natywne aplikacje iOS i Android, sklepy internetowe oraz strony z trackingiem i kampaniami Google Ads. Widełki wyceny w 24 h.",
  alternates: { canonical: "https://programo.pl/oferta" },
  openGraph: {
    title: "Oferta — aplikacje, sklepy, strony i reklamy Google | Programo",
    description:
      "Aplikacje webowe i SaaS, natywne aplikacje iOS i Android, sklepy internetowe oraz strony z trackingiem i kampaniami Google Ads.",
    url: "https://programo.pl/oferta",
    siteName: "Programo",
    locale: "pl_PL",
    type: "website",
  },
};

export default function OfertaPage() {
  return (
    <div className="pt-24 md:pt-32">
      <Offer />
    </div>
  );
}
