import type { Metadata } from "next";
import FeaturedWork from "@/components/featured-work";

export const metadata: Metadata = {
  title: "Projekty — Programo",
  description:
    "Archiwum naszych realizacji. Strony internetowe, aplikacje SaaS, integracje AI i więcej.",
  alternates: { canonical: "https://programo.pl/projekty" },
};

export default function ProjektyPage() {
  return (
    <div className="pt-24 md:pt-32">
      <FeaturedWork />
    </div>
  );
}
