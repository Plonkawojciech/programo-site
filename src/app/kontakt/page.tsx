import type { Metadata } from "next";
import QuickContact from "@/components/quick-contact";
import CompactLeadForm from "@/components/compact-lead-form";

export const metadata: Metadata = {
  title: "Kontakt — Programo",
  description:
    "Skontaktuj się z Programo Studio. Email, telefon, formularz kontaktowy. Odezwiemy się w ciągu 24 godzin.",
  alternates: { canonical: "https://programo.pl/kontakt" },
};

export default function KontaktPage() {
  return (
    <div className="pt-24 md:pt-32">
      {/* Low-friction 3-field catcher first; full brief below for those who want it. */}
      <CompactLeadForm
        formId="kontakt-compact"
        projectType="Zapytanie z /kontakt"
        eyebrow="Najszybciej"
        heading="Zostaw numer — oddzwonimy z wyceną"
      />
      <QuickContact />
    </div>
  );
}
