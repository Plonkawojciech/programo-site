import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { CRM_COOKIE, verifyToken } from "@/lib/crm-auth";
import {
  getLeads,
  updateLeadMeta,
  updateLead,
  deleteLead,
  LEAD_STATUSES,
  EDITABLE_LEAD_FIELDS,
  type LeadStatus,
  type LeadPatch,
  type EditableLeadField,
} from "@/lib/leads";

async function isAuthed(): Promise<boolean> {
  const cookieStore = await cookies();
  return verifyToken(cookieStore.get(CRM_COOKIE)?.value);
}

// Max length per editable field (defensive cap on stored data).
const FIELD_MAX: Record<EditableLeadField, number> = {
  name: 200,
  email: 320,
  phone: 50,
  subject: 100,
  message: 2000,
  projectType: 100,
  budget: 100,
};

export async function GET() {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 });
  }
  const leads = await getLeads();
  return NextResponse.json({ leads });
}

// Update a lead's sales status and/or note (meta). Token-gated.
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

// Edit a lead's core fields (name/email/phone/subject/message/projectType/budget). Token-gated.
export async function PATCH(request: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Nieprawidłowe żądanie" }, { status: 400 });
  }

  const obj = (body as Record<string, unknown>) || {};
  const id = obj.id;
  if (typeof id !== "string" || !id) {
    return NextResponse.json({ error: "Brak identyfikatora leada" }, { status: 400 });
  }

  const patch: LeadPatch = {};
  for (const field of EDITABLE_LEAD_FIELDS) {
    const v = obj[field];
    if (v === undefined) continue;
    if (typeof v !== "string") {
      return NextResponse.json(
        { error: `Pole „${field}" musi być tekstem` },
        { status: 400 }
      );
    }
    patch[field] = v.slice(0, FIELD_MAX[field]);
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "Nic do zaktualizowania" }, { status: 400 });
  }

  const updated = await updateLead(id, patch);
  if (!updated) {
    return NextResponse.json(
      { error: "Nie znaleziono leada lub magazyn niedostępny" },
      { status: 404 }
    );
  }

  return NextResponse.json({ ok: true, lead: updated });
}

// Delete a lead (and its meta). Token-gated.
export async function DELETE(request: NextRequest) {
  if (!(await isAuthed())) {
    return NextResponse.json({ error: "Brak autoryzacji" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Nieprawidłowe żądanie" }, { status: 400 });
  }

  const { id } = (body as { id?: unknown }) || {};
  if (typeof id !== "string" || !id) {
    return NextResponse.json({ error: "Brak identyfikatora leada" }, { status: 400 });
  }

  const ok = await deleteLead(id);
  if (!ok) {
    return NextResponse.json(
      { error: "Nie udało się usunąć (magazyn niedostępny?)" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}
