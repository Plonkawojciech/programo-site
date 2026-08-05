import { describe, it, expect } from "vitest";
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { EVENTS } from "@/lib/analytics/events";

// The failure this prevents actually happened.
//
// Six of thirty-one events were declared in the taxonomy — with names, targets
// and a written rationale — and never fired. Four had no call site at all; two
// (`cta_click`, `section_view`) had listeners that keyed off DOM attributes no
// component carried. Everything looked complete: the taxonomy read well, the
// dispatcher handled every case, the tests passed. The dashboard would simply
// have shown empty sections forever, and the obvious conclusion would have been
// "nobody clicks our CTAs" rather than "we never measured them".
//
// A declared event with no call site is worse than no event, because it reads
// as evidence of absence. This test makes that state impossible to commit.

const SRC = join(process.cwd(), "src");

/** Every .ts/.tsx file under src/, minus the taxonomy and the tests themselves. */
function sourceFiles(dir = SRC, acc: string[] = []): string[] {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) {
      if (entry === "__tests__") continue;
      sourceFiles(path, acc);
    } else if (/\.tsx?$/.test(entry) && !path.endsWith(join("analytics", "events.ts"))) {
      acc.push(path);
    }
  }
  return acc;
}

const corpus = sourceFiles()
  .map((f) => readFileSync(f, "utf8"))
  .join("\n");

describe("event wiring", () => {
  it("every declared event has at least one call site", () => {
    const dead = Object.keys(EVENTS).filter((key) => !corpus.includes(`track("${key}"`));
    expect(
      dead,
      `Declared but never fired: ${dead.join(", ")}. Either wire it up or delete it ` +
        `from events.ts — an event that cannot fire makes an empty report look like a finding.`,
    ).toEqual([]);
  });

  it("no code fires an event name that is not declared", () => {
    // /api/collect rejects unknown names outright, so this would be a silent
    // data loss rather than an error.
    const fired = [...corpus.matchAll(/track\("(\w+)"/g)].map((m) => m[1]);
    const declared = new Set(Object.keys(EVENTS));
    const undeclared = [...new Set(fired)].filter((n) => !declared.has(n));
    expect(undeclared, `Fired but not declared: ${undeclared.join(", ")}`).toEqual([]);
  });

  it("the selectors delegated listeners depend on still match real markup", () => {
    // cta_click and section_view are delegated: they do not have call sites in
    // the components they measure, so a rename in the markup breaks them
    // silently. Pin the contract instead.
    const tracker = readFileSync(join(SRC, "components", "analytics-tracker.tsx"), "utf8");
    const engagement = readFileSync(join(SRC, "lib", "analytics", "engagement.ts"), "utf8");

    // Sections are identified by an explicit data-section OR the element id —
    // the homepage relies on the id fallback.
    expect(engagement).toContain('"[data-section],section[id]"');

    // CTAs are recognised by destination, not by an attribute nobody remembers.
    expect(tracker).toContain("CONVERSION_HREFS");
    expect(tracker).toMatch(/"\/kontakt"/);
  });
});
