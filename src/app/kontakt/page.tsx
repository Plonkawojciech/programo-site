import type { Metadata } from "next";
import QuickContact from "@/components/quick-contact";

export const metadata: Metadata = {
  title: "Kontakt — Programo",
  description:
    "Skontaktuj się z Programo Studio. Email, telefon, formularz kontaktowy. Odezwiemy się w ciągu 24 godzin.",
  alternates: { canonical: "https://programo.pl/kontakt" },
};

export default function KontaktPage() {
  return (
    <div className="pt-24 md:pt-32">
      <QuickContact />
    </div>
  );
}
