import type { Metadata } from "next";
import Pricing from "@/components/pricing";
import {
  buildBreadcrumbs,
  buildWebPage,
  ORGANIZATION_ID,
  renderGraph,
  STATIC_ROUTE_UPDATED_AT,
} from "@/lib/schema";

const PATH = "/cennik";

const pageGraph = renderGraph([
  buildWebPage({
    path: PATH,
    name: "Wycena - proces i czynniki ceny | Programo",
    description:
      "Rozmowa, widełki w 24 h, stała wycena przed startem. Sprawdź, co wpływa na cenę aplikacji, sklepu lub strony.",
    dateModified: STATIC_ROUTE_UPDATED_AT[PATH],
    about: { "@id": ORGANIZATION_ID },
  }),
  buildBreadcrumbs([
    { name: "Programo", path: "/" },
    { name: "Wycena", path: PATH },
  ]),
]);

export const metadata: Metadata = {
  title: "Wycena - proces i czynniki ceny | Programo",
  description:
    "Rozmowa, widełki w 24 h, stała wycena przed startem. Sprawdź, co wpływa na cenę aplikacji, sklepu lub strony. Bez ukrytych kosztów w trakcie projektu.",
  alternates: { canonical: "https://programo.pl/cennik" },
  openGraph: {
    title: "Wycena - proces i czynniki ceny | Programo",
    description: "Rozmowa, widełki w 24 h, stała wycena przed startem. Bez ukrytych kosztów w trakcie projektu.",
    url: "https://programo.pl/cennik",
    siteName: "Programo",
    locale: "pl_PL",
    type: "website",
  },
};

export default function CennikPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: pageGraph }} />
      <div className="pt-24 md:pt-32">
        <Pricing />
      </div>
    </>
  );
}
