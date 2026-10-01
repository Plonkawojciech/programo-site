import type { Metadata } from "next";
import FeaturedWork from "@/components/featured-work";
import DemosSection from "@/components/demos/demos-section";
import { demoViews } from "@/lib/demos";
import { projects } from "@/lib/projects";
import { OG_IMAGE } from "@/lib/og-image";
import {
  buildBreadcrumbs,
  buildCreativeWorkItemList,
  buildWebPage,
  ORGANIZATION_ID,
  renderGraph,
  STATIC_ROUTE_UPDATED_AT,
} from "@/lib/schema";

const PATH = "/projekty";
const demos = demoViews();
const TITLE = "Projekty, realizacje i dema stron | Programo";
const DESCRIPTION = `Portfolio Programo: ${projects.length} realizacji (aplikacje Jedmar, CRM Estalo, strony i kampanie) oraz ${demos.length} koncepcji stron dla firm z różnych branż. Realizacje możesz otworzyć i sprawdzić.`;

// /dema was merged into this route (2026-09-28) — its item list lives here now,
// as #demo-list on this page.
const demoList = buildCreativeWorkItemList(
  PATH,
  "Dema stron dla firm",
  demos.map((demo) => ({ name: demo.title.pl, description: demo.summary.pl, sameAs: demo.url })),
);

const pageGraph = renderGraph([
  buildWebPage({
    type: "CollectionPage",
    path: PATH,
    name: TITLE,
    description: DESCRIPTION,
    dateModified: STATIC_ROUTE_UPDATED_AT[PATH],
    about: { "@id": ORGANIZATION_ID },
  }),
  buildBreadcrumbs([
    { name: "Programo", path: "/" },
    { name: "Projekty", path: PATH },
  ]),
  demoList,
]);

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://programo.pl/projekty" },
  openGraph: {
    images: [OG_IMAGE],
    title: TITLE,
    description: DESCRIPTION,
    url: "https://programo.pl/projekty",
    siteName: "Programo",
    locale: "pl_PL",
    type: "website",
  },
};

export default function ProjektyPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: pageGraph }} />
      {/* The band carries up through the navbar clearance too, so there is no
          hairline seam on the body colour right under the nav. */}
      <div className="bg-card-band pt-20 md:pt-24">
        <FeaturedWork demoCount={demos.length} hideCta />
        <DemosSection demos={demos} />
      </div>
    </>
  );
}
