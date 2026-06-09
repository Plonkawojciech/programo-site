import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { CRM_COOKIE, verifyToken } from "@/lib/crm-auth";
import {
  getLeads,
  updateLeadMeta,
  LEAD_STATUSES,
  type LeadStatus,
} from "@/lib/leads";

async function isAuthed(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifyToken(cookieStore.get(CRM_COOKIE)?.value);
}

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 });
  }
  const leads = await getLeads();
  return NextResponse.json({ leads });
}

// Update a lead's sales status and/or note. Token-gated (same cookie as GET).
export async function POST(request: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Nieprawidłowe żądanie" }, { status: 400 });
  }

  const { id, status, note } =
    (body as { id?: unknown; status?: unknown; note?: unknown }) || {};

  if (typeof id !== "string" || !id) {
    return NextResponse.json({ error: "Brak identyfikatora leada" }, { status: 400 });
  }

  const patch: { status?: LeadStatus; note?: string } = {};

  if (status !== undefined) {
    if (
      typeof status !== "string" ||
      !(LEAD_STATUSES as readonly string[]).includes(status)
    ) {
      return NextResponse.json({ error: "Nieprawidłowy status" }, { status: 400 });
    }
    patch.status = status as LeadStatus;
  }

  if (note !== undefined) {
    if (typeof note !== "string") {
      return NextResponse.json({ error: "Nieprawidłowa notatka" }, { status: 400 });
    }
    patch.note = note.slice(0, 2000);
  }

  if (patch.status === undefined && patch.note === undefined) {
    return NextResponse.json({ error: "Nic do zaktualizowania" }, { status: 400 });
  }

  const saved = await updateLeadMeta(id, patch);
  if (!saved) {
    return NextResponse.json(
      { error: "Nie udało się zapisać (magazyn niedostępny?)" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true, meta: saved });
}
