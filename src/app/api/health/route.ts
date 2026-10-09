export const dynamic = "force-dynamic";

export function GET() {
  return Response.json({
    ok: true,
    environment: process.env.PROGRAMO_DEPLOYMENT_ENV ?? "unspecified",
    commit: process.env.SOURCE_COMMIT ?? null,
  }, { headers: { "Cache-Control": "no-store" } });
}
