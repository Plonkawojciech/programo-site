// Liveness probe for the container healthcheck and for uptime monitoring.
// Deliberately touches nothing external: a Redis or Telegram outage must not
// make the orchestrator restart a site that is serving pages fine.
export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}
