import type { Metadata } from "next";
import { OG_IMAGE } from "@/lib/og-image";
import QuickContact from "@/components/quick-contact";
import CompactLeadForm from "@/components/compact-lead-form";
import ContactHero from "./contact-hero";
import ContactPeople from "./contact-people";
import {
  buildBreadcrumbs,
  buildWebPage,
  ORGANIZATION_ID,
  renderGraph,
  STATIC_ROUTE_UPDATED_AT,
} from "@/lib/schema";

const PATH = "/kontakt";
const DESCRIPTION =
  "Kontakt z Programo w Poznaniu: strony i sklepy internetowe dla firm. Zadzwoń: 509 123 434 lub napisz: biuro@programo.pl. Odpowiadamy w ciągu 24 godzin.";

const pageGraph = renderGraph([
  buildWebPage({
    path: PATH,
    name: "Kontakt - odpowiadamy w 24 h | Programo",
    description: DESCRIPTION,
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
  description: DESCRIPTION,
  alternates: { canonical: "https://programo.pl/kontakt" },
  openGraph: {
    images: [OG_IMAGE],
    title: "Kontakt - odpowiadamy w 24 h | Programo",
    description: DESCRIPTION,
    url: "https://programo.pl/kontakt",
    siteName: "Programo",
    locale: "pl_PL",
    type: "website",
  },
};

export default function KontaktPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: pageGraph }} />
      <div className="pt-20 md:pt-24">
        <ContactHero />
        {/* Low-friction 2-field catcher first; full brief below for those who want it. */}
        <CompactLeadForm
          formId="kontakt-compact"
          projectType="Zapytanie z /kontakt"
          headingKey="compact.kontaktHeading"
          subKey="compact.kontaktSub"
        />
        <ContactPeople />
        <QuickContact formId="kontakt-full" />
      </div>
    </>
  );
}
