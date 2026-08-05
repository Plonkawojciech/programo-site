import type { Metadata } from "next";
import TechStack from "@/components/tech-stack";

export const metadata: Metadata = {
  title: "Technologie - Programo",
  description:
    "Nasz stack technologiczny: Next.js, React, TypeScript, Tailwind, Supabase, Neon, Vercel i więcej.",
  alternates: { canonical: "https://programo.pl/stack" },
};

export default function StackPage() {
  return (
    <div className="pt-20 md:pt-24">
      <TechStack />
    </div>
  );
}
