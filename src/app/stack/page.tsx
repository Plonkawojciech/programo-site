import type { Metadata } from "next";
import { OG_IMAGE } from "@/lib/og-image";
import TechStack from "@/components/tech-stack";
import {
  buildBreadcrumbs,
  buildWebPage,
  ORGANIZATION_ID,
  renderGraph,
  STATIC_ROUTE_UPDATED_AT,
} from "@/lib/schema";

const PATH = "/stack";

const pageGraph = renderGraph([
  buildWebPage({
    path: PATH,
    name: "Stack technologiczny - czym budujemy | Programo",
    description:
      "Nasz stack technologiczny: Next.js, React, TypeScript, Tailwind, Supabase, Neon, Vercel i więcej.",
    dateModified: STATIC_ROUTE_UPDATED_AT[PATH],
    about: { "@id": ORGANIZATION_ID },
  }),
  buildBreadcrumbs([
    { name: "Programo", path: "/" },
    { name: "Technologie", path: PATH },
  ]),
]);

export const metadata: Metadata = {
  title: "Stack technologiczny - czym budujemy | Programo",
  description:
    "Nasz stack technologiczny: Next.js, React, TypeScript, Tailwind, Supabase, Neon, Vercel i więcej.",
  alternates: { canonical: "https://programo.pl/stack" },
  openGraph: {
    images: [OG_IMAGE],
    title: "Stack technologiczny - czym budujemy | Programo",
    description: "Next.js, React, TypeScript, Tailwind, Supabase, Neon i więcej: technologie, których używamy, i dlaczego.",
    url: "https://programo.pl/stack",
    siteName: "Programo",
    locale: "pl_PL",
    type: "website",
  },
};

export default function StackPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: pageGraph }} />
      <div className="pt-20 md:pt-24">
        <TechStack />
      </div>
    </>
  );
}
