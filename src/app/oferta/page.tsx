import type { Metadata } from "next";
import Offer from "@/components/offer";
import {
  buildBreadcrumbs,
  buildWebPage,
  ORGANIZATION_ID,
  renderGraph,
  STATIC_ROUTE_UPDATED_AT,
} from "@/lib/schema";

const PATH = "/oferta";

const pageGraph = renderGraph([
  buildWebPage({
    path: PATH,
    name: "Oferta - aplikacje, sklepy, strony i reklamy Google | Programo",
    description:
      "Aplikacje webowe i SaaS, natywne aplikacje iOS i Android, sklepy internetowe oraz strony z trackingiem i kampaniami Google Ads.",
    dateModified: STATIC_ROUTE_UPDATED_AT[PATH],
    about: { "@id": ORGANIZATION_ID },
  }),
  buildBreadcrumbs([
    { name: "Programo", path: "/" },
    { name: "Oferta", path: PATH },
  ]),
]);

export const metadata: Metadata = {
  title: "Oferta - aplikacje, sklepy, strony i reklamy Google | Programo",
  description:
    "Aplikacje webowe i SaaS, natywne aplikacje iOS i Android, sklepy internetowe oraz strony z trackingiem i kampaniami Google Ads. Widełki wyceny w 24 h.",
  alternates: { canonical: "https://programo.pl/oferta" },
  openGraph: {
    title: "Oferta - aplikacje, sklepy, strony i reklamy Google | Programo",
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
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: pageGraph }} />
      <div className="pt-20 md:pt-24">
        <Offer />
      </div>
    </>
  );
}
