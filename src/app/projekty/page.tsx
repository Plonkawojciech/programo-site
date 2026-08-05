import type { Metadata } from "next";
import FeaturedWork from "@/components/featured-work";
import {
  buildBreadcrumbs,
  buildWebPage,
  ORGANIZATION_ID,
  renderGraph,
  STATIC_ROUTE_UPDATED_AT,
} from "@/lib/schema";

const PATH = "/projekty";

const pageGraph = renderGraph([
  buildWebPage({
    path: PATH,
    name: "Projekty i realizacje - produkty i praca dla klientów | Programo",
    description:
      "Portfolio Programo: natywne aplikacje Jedmar w App Store i Google Play, CRM Estalo, strony i kampanie Google Ads.",
    dateModified: STATIC_ROUTE_UPDATED_AT[PATH],
    about: { "@id": ORGANIZATION_ID },
  }),
  buildBreadcrumbs([
    { name: "Programo", path: "/" },
    { name: "Projekty", path: PATH },
  ]),
]);

export const metadata: Metadata = {
  title: "Projekty i realizacje - produkty i praca dla klientów | Programo",
  description:
    "Portfolio Programo: natywne aplikacje Jedmar w App Store i Google Play, CRM Estalo, strony i kampanie Google Ads. Każdy projekt można kliknąć i sprawdzić.",
  alternates: { canonical: "https://programo.pl/projekty" },
};

export default function ProjektyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: pageGraph }} />
      <div className="pt-20 md:pt-24">
        <FeaturedWork />
      </div>
    </>
  );
}
