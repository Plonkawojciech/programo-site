import { describe, it, expect, beforeEach } from "vitest";
import { contactSchema, rateLimitMap, isRateLimited, sanitize } from "@/app/api/contact/route";

describe("contact API validation", () => {
  it("valid submission passes schema", () => {
    const result = contactSchema.safeParse({
      name: "Jan Kowalski",
      email: "jan@example.com",
      subject: "Współpraca",
      message: "To jest testowa wiadomość z minimum 20 znaków!",
    });
    expect(result.success).toBe(true);
  });

  it("missing name fails", () => {
    const result = contactSchema.safeParse({
      name: "",
      email: "jan@example.com",
      subject: "Inne",
      message: "To jest testowa wiadomość z minimum 20 znaków!",
    });
    expect(result.success).toBe(false);
  });

  it("missing email fails", () => {
    const result = contactSchema.safeParse({
      name: "Jan",
      email: "",
      subject: "Inne",
      message: "To jest testowa wiadomość z minimum 20 znaków!",
    });
    expect(result.success).toBe(false);
  });

  it("invalid email format fails", () => {
    const result = contactSchema.safeParse({
      name: "Jan",
      email: "not-an-email",
      subject: "Inne",
      message: "To jest testowa wiadomość z minimum 20 znaków!",
    });
    expect(result.success).toBe(false);
  });

  it("missing message fails", () => {
    const result = contactSchema.safeParse({
      name: "Jan",
      email: "jan@example.com",
      subject: "Inne",
      message: "",
    });
    expect(result.success).toBe(false);
  });

  it("message too short (<20 chars) fails", () => {
    const result = contactSchema.safeParse({
      name: "Jan",
      email: "jan@example.com",
      subject: "Inne",
      message: "Too short",
    });
    expect(result.success).toBe(false);
  });

  it("message too long (>2000 chars) fails", () => {
    const result = contactSchema.safeParse({
      name: "Jan",
      email: "jan@example.com",
      subject: "Inne",
      message: "x".repeat(2001),
    });
    expect(result.success).toBe(false);
  });

  it("invalid subject enum fails", () => {
    const result = contactSchema.safeParse({
      name: "Jan",
      email: "jan@example.com",
      subject: "Invalid Subject",
      message: "To jest testowa wiadomość z minimum 20 znaków!",
    });
    expect(result.success).toBe(false);
  });

  it("all valid subjects pass", () => {
    const subjects = ["Współpraca", "Wycena projektu", "Pytanie techniczne", "Inne"];
    for (const subject of subjects) {
      const result = contactSchema.safeParse({
        name: "Jan",
        email: "jan@example.com",
        subject,
        message: "To jest testowa wiadomość z minimum 20 znaków!",
      });
      expect(result.success, `Subject "${subject}" should be valid`).toBe(true);
    }
  });

  it("message exactly 20 chars passes", () => {
    const result = contactSchema.safeParse({
      name: "Jan",
      email: "jan@example.com",
      subject: "Inne",
      message: "a".repeat(20),
    });
    expect(result.success).toBe(true);
  });

  it("message exactly 2000 chars passes", () => {
    const result = contactSchema.safeParse({
      name: "Jan",
      email: "jan@example.com",
      subject: "Inne",
      message: "a".repeat(2000),
    });
    expect(result.success).toBe(true);
  });
});

describe("rate limiting", () => {
  beforeEach(() => {
    rateLimitMap.clear();
  });

  it("allows first 3 requests", () => {
    expect(isRateLimited("1.2.3.4")).toBe(false);
    expect(isRateLimited("1.2.3.4")).toBe(false);
    expect(isRateLimited("1.2.3.4")).toBe(false);
  });

  it("blocks 4th request from same IP", () => {
    isRateLimited("5.6.7.8");
    isRateLimited("5.6.7.8");
    isRateLimited("5.6.7.8");
    expect(isRateLimited("5.6.7.8")).toBe(true);
  });

  it("different IPs are independent", () => {
    isRateLimited("10.0.0.1");
    isRateLimited("10.0.0.1");
    isRateLimited("10.0.0.1");
    expect(isRateLimited("10.0.0.2")).toBe(false);
  });

  it("rate limit resets after 15 min window", () => {
    const testIp = "192.168.1.1";
    // Fill up the rate limit
    isRateLimited(testIp);
    isRateLimited(testIp);
    isRateLimited(testIp);
    expect(isRateLimited(testIp)).toBe(true);

    // Manually set old timestamps (>15 min ago)
    const old = Date.now() - 16 * 60 * 1000;
    rateLimitMap.set(testIp, [old, old, old]);

    // Should be allowed again since old timestamps are outside the window
    expect(isRateLimited(testIp)).toBe(false);
  });
});

describe("sanitize function", () => {
  it("sanitizes XSS in message field", () => {
    const xss = '<script>alert("xss")</script>';
    const safe = sanitize(xss);
    expect(safe).not.toContain("<script>");
    expect(safe).toContain("&lt;script&gt;");
  });

  it("sanitizes HTML entities", () => {
    expect(sanitize("a & b")).toContain("&amp;");
    expect(sanitize('"quotes"')).toContain("&quot;");
  });
});
