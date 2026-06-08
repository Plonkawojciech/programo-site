import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { CRM_COOKIE, verifyToken } from "@/lib/crm-auth";
import { getLeads } from "@/lib/leads";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get(CRM_COOKIE)?.value;

  if (!verifyToken(token)) {
    return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 });
  }

  const leads = await getLeads();
  return NextResponse.json({ leads });
}
