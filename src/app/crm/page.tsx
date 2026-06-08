import type { Metadata } from "next";
import { cookies } from "next/headers";
import { CRM_COOKIE, verifyToken } from "@/lib/crm-auth";
import { getLeads, isLeadStoreConfigured } from "@/lib/leads";
import LoginForm from "./LoginForm";
import LeadsDashboard from "./LeadsDashboard";

export const metadata: Metadata = {
  title: "CRM — Programo",
  robots: { index: false, follow: false },
};

// Always render fresh (reads cookie + live leads).
export const dynamic = "force-dynamic";

export default async function CrmPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CRM_COOKIE)?.value;

  if (!verifyToken(token)) {
    return <LoginForm />;
  }

  const configured = isLeadStoreConfigured();
  const leads = configured ? await getLeads() : [];

  return <LeadsDashboard leads={leads} configured={configured} />;
}
