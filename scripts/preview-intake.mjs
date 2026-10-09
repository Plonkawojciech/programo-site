// Isolated test inbox with no public router or host port. The Next server uses
// a dedicated secret. A successful response follows a durable append, never a log.
import { createServer } from "node:http";
import { createHash, randomUUID, timingSafeEqual } from "node:crypto";
import { openSync, writeSync, fsyncSync, closeSync } from "node:fs";

const secret = process.env.CRM_WEBHOOK_SECRET;
const file = process.env.PREVIEW_INTAKE_PATH ?? "/data/submissions.jsonl";
if (process.env.PROGRAMO_DEPLOYMENT_ENV !== "preview" || !secret || secret.length < 32) {
  throw new Error("Preview environment and a dedicated secret are required.");
}
const expected = createHash("sha256").update(secret).digest();
const startupFd = openSync(file, "a", 0o600);
try { fsyncSync(startupFd); } finally { closeSync(startupFd); }
const respond = (res, status, body) => {
  res.writeHead(status, { "Content-Type": "application/json", "Cache-Control": "no-store" });
  res.end(JSON.stringify(body));
};
const server = createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/health") return respond(res, 200, { ok: true });
  if (req.method !== "POST" || req.url !== "/api/form-intake") return respond(res, 404, { ok: false });
  const received = createHash("sha256").update(String(req.headers["x-webhook-secret"] ?? "")).digest();
  if (!timingSafeEqual(received, expected)) return respond(res, 401, { ok: false });
  try {
    const parts = [];
    let size = 0;
    for await (const part of req) {
      size += part.length;
      if (size > 65536) return respond(res, 413, { ok: false });
      parts.push(part);
    }
    const payload = JSON.parse(Buffer.concat(parts).toString("utf8"));
    if (payload.source !== "programo.pl-preview-test" || typeof payload.formId !== "string") {
      return respond(res, 422, { ok: false });
    }
    const id = randomUUID();
    const fd = openSync(file, "a", 0o600);
    try {
      const data = Buffer.from(JSON.stringify({ ...payload, id, receivedAt: new Date().toISOString() }) + "\n");
      let offset = 0;
      while (offset < data.length) offset += writeSync(fd, data, offset);
      fsyncSync(fd);
    } finally {
      closeSync(fd);
    }
    return respond(res, 201, { ok: true, id });
  } catch {
    return respond(res, 500, { ok: false });
  }
});
server.listen(4100, "0.0.0.0");
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => server.close());
