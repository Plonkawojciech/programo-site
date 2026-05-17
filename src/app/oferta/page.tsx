import type { Metadata } from "next";
import Offer from "@/components/offer";

export const metadata: Metadata = {
  title: "Oferta — Programo",
  description:
    "Co robimy: strony internetowe, aplikacje SaaS, aplikacje mobilne, integracje AI, doradztwo techniczne.",
  alternates: { canonical: "https://programo.pl/oferta" },
};

export default function OfertaPage() {
  return (
    <div className="pt-24 md:pt-32">
      <Offer />
    </div>
  );
}
