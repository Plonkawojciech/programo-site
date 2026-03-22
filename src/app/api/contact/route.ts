import { NextRequest, NextResponse } from "next/server";
import { z } from "zod/v4";
import { Resend } from "resend";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email format"),
  subject: z.enum([
    "Współpraca",
    "Wycena projektu",
    "Pytanie techniczne",
    "Inne",
  ]),
  message: z
    .string()
    .min(20, "Message must be at least 20 characters")
    .max(2000, "Message must be at most 2000 characters"),
});

// In-memory rate limiter: IP -> timestamps[]
const rateLimitMap = new Map<string, number[]>();
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = rateLimitMap.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < RATE_WINDOW_MS);
  rateLimitMap.set(ip, recent);

  if (recent.length >= RATE_LIMIT) {
    return true;
  }
  recent.push(now);
  rateLimitMap.set(ip, recent);
  return false;
}

// Sanitize HTML to prevent XSS
function sanitize(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}

export async function POST(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many messages. Try again later." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }

  const result = contactSchema.safeParse(body);

  if (!result.success) {
    const firstError = result.error.issues[0]?.message || "Validation failed";
    return NextResponse.json({ error: firstError }, { status: 400 });
  }

  const { name, email, subject, message } = result.data;
  const safeName = sanitize(name);
  const safeMessage = sanitize(message);
  const safeSubject = sanitize(subject);

  const emailTo = process.env.EMAIL_TO || "kontakt@programo.pl";

  try {
    const resendApiKey = process.env.RESEND_API_KEY;
    if (!resendApiKey) {
      console.log("[DEV] No RESEND_API_KEY — skipping email. Contact form submission:", { name: safeName, email: sanitize(email), subject: safeSubject });
    }
    if (resendApiKey) {
      const resend = new Resend(resendApiKey);
      await resend.emails.send({
        from: "Programo <noreply@programo.pl>",
        to: emailTo,
        subject: `[Programo] ${safeSubject} — od ${safeName}`,
        html: `
          <h2>Nowa wiadomość z formularza kontaktowego</h2>
          <p><strong>Imię:</strong> ${safeName}</p>
          <p><strong>Email:</strong> ${sanitize(email)}</p>
          <p><strong>Temat:</strong> ${safeSubject}</p>
          <p><strong>Wiadomość:</strong></p>
          <p>${safeMessage.replace(/\n/g, "<br>")}</p>
        `,
      });
    }
  } catch {
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true });
}

// Export for testing
export { contactSchema, rateLimitMap, isRateLimited, sanitize };
