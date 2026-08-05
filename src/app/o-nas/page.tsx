import type { Metadata } from "next";
import About from "@/components/about";
import {
  buildBreadcrumbs,
  buildWebPage,
  ORGANIZATION_ID,
  renderGraph,
  STATIC_ROUTE_UPDATED_AT,
} from "@/lib/schema";

const PATH = "/o-nas";

const pageGraph = renderGraph([
  buildWebPage({
    path: PATH,
    name: "O nas - dwóch inżynierów z Poznania | Programo",
    description:
      "Programo s.j. to Wojciech Płonka i Bartosz Kolaj. Projektujemy i budujemy oprogramowanie sami - bez handlowców i podwykonawców.",
    dateModified: STATIC_ROUTE_UPDATED_AT[PATH],
    about: { "@id": ORGANIZATION_ID },
  }),
  buildBreadcrumbs([
    { name: "Programo", path: "/" },
    { name: "O nas", path: PATH },
  ]),
]);

export const metadata: Metadata = {
  title: "O nas - dwóch inżynierów z Poznania | Programo",
  description:
    "Programo s.j. to Wojciech Płonka i Bartosz Kolaj. Projektujemy i budujemy oprogramowanie sami - bez handlowców i podwykonawców. Poznań, cała Polska zdalnie.",
  alternates: { canonical: "https://programo.pl/o-nas" },
  openGraph: {
    title: "O nas - dwóch inżynierów z Poznania | Programo",
    description: "Programo s.j. to Wojciech Płonka i Bartosz Kolaj. Projektujemy i budujemy oprogramowanie sami.",
    url: "https://programo.pl/o-nas",
    siteName: "Programo",
    locale: "pl_PL",
    type: "website",
  },
};

export default function ONasPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: pageGraph }} />
      <div className="pt-20 md:pt-24">
        <About />
      </div>
    </>
  );
}
