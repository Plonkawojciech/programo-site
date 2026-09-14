import { existsSync } from "node:fs";
import { join } from "node:path";
import type { Metadata } from "next";
import { OG_IMAGE } from "@/lib/og-image";
import DemoPageContent from "@/components/demos/demo-page-content";
import { demos } from "@/lib/demos";
import {
  buildBreadcrumbs,
  buildCreativeWorkItemList,
  buildWebPage,
  ORGANIZATION_ID,
  ref,
  renderGraph,
  STATIC_ROUTE_UPDATED_AT,
} from "@/lib/schema";

const PATH = "/dema";
const TITLE = "Dema stron dla firm - darmowe demo nowej strony | Programo";
const DESCRIPTION = "Zobacz 22 dema stron dla firm. Budujemy bezpłatne demo z prawdziwymi treściami, zdjęciami marki i wersją mobilną, zanim podejmiesz decyzję.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "https://programo.pl/dema" },
  openGraph: {
    images: [OG_IMAGE],
    title: TITLE,
    description: DESCRIPTION,
    url: "https://programo.pl/dema",
    siteName: "Programo",
    locale: "pl_PL",
    type: "website",
  },
};

const itemList = buildCreativeWorkItemList(
  PATH,
  "Dema stron dla firm",
  demos.map((demo) => ({
    name: demo.name,
    description: demo.summary.pl,
    sameAs: demo.url,
  })),
);

const pageGraph = renderGraph([
  buildWebPage({
    type: "CollectionPage",
    path: PATH,
    name: TITLE,
    description: DESCRIPTION,
    dateModified: STATIC_ROUTE_UPDATED_AT[PATH],
    about: { "@id": ORGANIZATION_ID },
    mainEntity: ref(itemList),
  }),
  buildBreadcrumbs([
    { name: "Programo", path: "/" },
    { name: "Dema stron dla firm", path: PATH },
  ]),
  itemList,
]);

export default function DemaPage() {
  const demosWithScreenshots = demos.map((demo) => ({
    ...demo,
    hasDesktopScreenshot: existsSync(
      join(process.cwd(), "public", "screenshots", "demos", `${demo.slug}-desktop.webp`),
    ),
  }));

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: pageGraph }} />
      <DemoPageContent demos={demosWithScreenshots} />
    </>
  );
}
