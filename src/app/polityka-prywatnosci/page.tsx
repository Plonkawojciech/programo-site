import type { Metadata } from "next";
import { publicPageRobots } from "@/lib/page-robots";
import PrivacyPageClient from "./PrivacyPageClient";

export const metadata: Metadata = {
  title: "Polityka prywatności - Programo",
  description:
    "Polityka prywatności i informacja o przetwarzaniu danych osobowych przez Programo Studio.",
  alternates: {
    canonical: "https://programo.pl/polityka-prywatnosci",
  },
  robots: publicPageRobots,
};

export default function Page() {
  return <PrivacyPageClient />;
}
