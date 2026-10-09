import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { once } from "node:events";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { randomBytes } from "node:crypto";

const dir = mkdtempSync(path.join(tmpdir(), "programo-intake-test-"));
const file = path.join(dir, "submissions.jsonl");
const secret = randomBytes(32).toString("hex");
let child;
const start = async () => {
  child = spawn(process.execPath, ["scripts/preview-intake.mjs"], {
    env: { PATH: process.env.PATH, PROGRAMO_DEPLOYMENT_ENV: "preview", CRM_WEBHOOK_SECRET: secret, PREVIEW_INTAKE_PATH: file },
    stdio: "pipe",
  });
  for (let i = 0; i < 50; i++) {
    if (child.exitCode !== null) throw new Error("Test inbox failed to start");
    try { if ((await fetch("http://127.0.0.1:4100/health")).ok) return; } catch { /* starting */ }
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error("Test inbox timeout");
};
const stop = async () => {
  if (child?.exitCode === null) { const exit = once(child, "exit"); child.kill("SIGTERM"); await exit; }
};
const post = (data, key = secret) => fetch("http://127.0.0.1:4100/api/form-intake", {
  method: "POST", headers: { "Content-Type": "application/json", "X-Webhook-Secret": key }, body: JSON.stringify(data),
});
try {
  await start();
  assert.equal((await post({ source: "programo.pl-preview-test", formId: "test" }, "wrong")).status, 401);
  assert.equal((await post({ source: "programo.pl", formId: "test" })).status, 422);
  assert.equal(readFileSync(file, "utf8"), "");
  const response = await post({ source: "programo.pl-preview-test", formId: "test", message: "TEST ONLY", id: "spoofed", receivedAt: "spoofed" });
  assert.equal(response.status, 201);
  const { id } = await response.json();
  assert.notEqual(id, "spoofed");
  const saved = JSON.parse(readFileSync(file, "utf8").trim());
  assert.equal(saved.id, id);
  assert.equal(saved.message, "TEST ONLY");
  assert.notEqual(saved.receivedAt, "spoofed");
  await stop(); await start();
  assert.equal(JSON.parse(readFileSync(file, "utf8").trim()).id, id);
  console.log("PASS: authenticated preview intake writes durably, survives restart, and rejects wrong secret/source");
} finally {
  await stop();
  rmSync(dir, { recursive: true, force: true });
}
