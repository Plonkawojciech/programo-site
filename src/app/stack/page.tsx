import type { Metadata } from "next";
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
    name: "Technologie - Programo",
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
  title: "Technologie - Programo",
  description:
    "Nasz stack technologiczny: Next.js, React, TypeScript, Tailwind, Supabase, Neon, Vercel i więcej.",
  alternates: { canonical: "https://programo.pl/stack" },
};

export default function StackPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: pageGraph }} />
      <div className="pt-24 md:pt-32">
        <TechStack />
      </div>
    </>
  );
}
