import { describe, it, expect, beforeEach, vi } from "vitest";
import { isToolUserAgent, isForeignOrigin, isOverAttemptLimit, _resetAttemptMemory } from "@/lib/request-guard";
import { isHoneypotTripped } from "@/lib/form-challenge";

const CHROME = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36";
const SAFARI_IOS = "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1";

describe("request guard", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
    vi.stubEnv("KV_REST_API_URL", "");
    vi.stubEnv("UPSTASH_REDIS_REST_URL", "");
    _resetAttemptMemory();
  });

  it("lets real browsers through", () => {
    expect(isToolUserAgent(CHROME)).toBe(false);
    expect(isToolUserAgent(SAFARI_IOS)).toBe(false);
    expect(isToolUserAgent("Mozilla/5.0 HeadlessChrome/120.0")).toBe(false);
  });

  it("blocks scripting tools, HTTP libraries", () => {
    for (const ua of ["curl/8.4.0", "Wget/1.21", "python-requests/2.31", "Python-urllib/3.11", "Go-http-client/1.1",
       "axios/1.6.0", "Scrapy/2.11 (+https://scrapy.org)", "", null]) {
      expect(isToolUserAgent(ua), String(ua)).toBe(true);
    }
  });

  it("accepts our own origins only", () => {
    expect(isForeignOrigin("https://programo.pl")).toBe(false);
    expect(isForeignOrigin("https://www.programo.pl")).toBe(false);
    expect(isForeignOrigin("https://v3.programo.pl")).toBe(false);
    expect(isForeignOrigin("https://evil.vercel.app")).toBe(true);
    expect(isForeignOrigin("http://localhost:3000")).toBe(false);
    expect(isForeignOrigin(null)).toBe(true);
    expect(isForeignOrigin("https://spam.example")).toBe(true);
    expect(isForeignOrigin("https://programo.pl.evil.com")).toBe(true);
  });

  it("counts attempts per ip and bucket", async () => {
    for (let i = 0; i < 3; i++) expect(await isOverAttemptLimit("t", "1.1.1.1", 3, 60)).toBe(false);
    expect(await isOverAttemptLimit("t", "1.1.1.1", 3, 60)).toBe(true);
    expect(await isOverAttemptLimit("t", "2.2.2.2", 3, 60)).toBe(false);
    expect(await isOverAttemptLimit("other", "1.1.1.1", 3, 60)).toBe(false);
  });

  it("trips on either honeypot", () => {
    expect(isHoneypotTripped({ fax_number: "123" })).toBe(true);
    expect(isHoneypotTripped({ company_website: "", fax_number: "" })).toBe(false);
  });
});
