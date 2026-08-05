import type { Metadata } from "next";
import QuickContact from "@/components/quick-contact";
import CompactLeadForm from "@/components/compact-lead-form";
import ContactHero from "./contact-hero";
import {
  buildBreadcrumbs,
  buildWebPage,
  ORGANIZATION_ID,
  renderGraph,
  STATIC_ROUTE_UPDATED_AT,
} from "@/lib/schema";

const PATH = "/kontakt";

const pageGraph = renderGraph([
  buildWebPage({
    path: PATH,
    name: "Kontakt - odpowiadamy w 24 h | Programo",
    description:
      "Zadzwoń: 509 123 434 albo zostaw numer w formularzu. Porozmawiajmy o Twojej aplikacji, sklepie lub stronie.",
    dateModified: STATIC_ROUTE_UPDATED_AT[PATH],
    about: { "@id": ORGANIZATION_ID },
  }),
  buildBreadcrumbs([
    { name: "Programo", path: "/" },
    { name: "Kontakt", path: PATH },
  ]),
]);

export const metadata: Metadata = {
  title: "Kontakt - odpowiadamy w 24 h | Programo",
  description:
    "Zadzwoń: 509 123 434 albo zostaw numer w formularzu. Porozmawiajmy o Twojej aplikacji, sklepie lub stronie. Programo, Poznań.",
  alternates: { canonical: "https://programo.pl/kontakt" },
};

export default function KontaktPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: pageGraph }} />
      <div className="pt-20 md:pt-24">
        <ContactHero />
        {/* Low-friction 2-field catcher first; full brief below for those who want it. */}
        <CompactLeadForm formId="kontakt-compact" projectType="Zapytanie z /kontakt" />
        <QuickContact formId="kontakt-full" />
      </div>
    </>
  );
}
