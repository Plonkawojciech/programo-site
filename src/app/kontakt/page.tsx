import type { Metadata } from "next";
import QuickContact from "@/components/quick-contact";
import CompactLeadForm from "@/components/compact-lead-form";
import ContactHero from "./contact-hero";

export const metadata: Metadata = {
  title: "Kontakt — odpowiadamy w 24 h | Programo",
  description:
    "Zadzwoń: 509 123 434 albo zostaw numer w formularzu. Porozmawiajmy o Twojej aplikacji, sklepie lub stronie. Programo, Poznań.",
  alternates: { canonical: "https://programo.pl/kontakt" },
};

export default function KontaktPage() {
  return (
    <div className="pt-24 md:pt-32">
      <ContactHero />
      {/* Low-friction 2-field catcher first; full brief below for those who want it. */}
      <CompactLeadForm formId="kontakt-compact" projectType="Zapytanie z /kontakt" />
      <QuickContact formId="kontakt-full" />
    </div>
  );
}
