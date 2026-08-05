import type { Metadata } from "next";
import { cookies } from "next/headers";
import { CRM_COOKIE, verifyToken } from "@/lib/crm-auth";
import { getAnalyticsDashboardData } from "@/lib/analytics/query";
import LoginForm from "../LoginForm";
import AnalyticsDashboard from "./AnalyticsDashboard";

export const metadata: Metadata = {
  title: "Analityka - Programo CRM",
  robots: { index: false, follow: false },
};

// Always render fresh (reads cookie + live event store) — same contract as /crm.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default async function CrmAnalyticsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CRM_COOKIE)?.value;

  if (!verifyToken(token)) {
    return <LoginForm />;
  }

  const data = await getAnalyticsDashboardData();

  return <AnalyticsDashboard data={data} />;
}
