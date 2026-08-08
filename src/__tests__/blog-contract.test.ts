import fs from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";
import { listPostFilenames, readPostFile } from "@/lib/blog/read";
import { parsePostFile, type ParsedPost } from "@/lib/blog/parse";
import { countWords } from "@/lib/blog/word-count";
import { AUTHOR_SLUGS } from "@/lib/schema/people";

// "Zdjęcie" / "Obraz" openers are the two lazy alt-text patterns a rushed
// (or automated) writer reaches for - "Zdjęcie biurka" tells a screen reader
// user nothing a sighted user doesn't already get from "it's an image" being
// implicit. Case-insensitive so "zdjęcie" mid-sentence-cased slips don't pass.
const LAZY_ALT_PREFIXES = ["zdjęcie", "obraz"];

// The editorial gate from docs/plans/blog-aeo-2026-08.md section 3.3. Zod
// (src/lib/blog/schema.ts) only checks frontmatter SHAPE — a field is present
// and the right type. It happily accepts a 3-word "answer", an author nobody
// has heard of, or a body with no table. Those are exactly the failure modes
// a scaled, automated posting pipeline produces, so they get their own rules
// here, separate from the shape check.

const BANNED_PHRASES = ["to zależy", "jak wspomniano wyżej", "powyżej", "poniżej"];

function hasTableOrNumberedList(body: string): boolean {
  const hasTable = /^\s*\|.+\|\s*$/m.test(body) && /^\s*\|[\s:|-]+\|\s*$/m.test(body);
  const hasNumberedList = /^\s*\d+\.\s+\S/m.test(body);
  return hasTable || hasNumberedList;
}

/** Occurrences of `phrase` in `text`, case-insensitive, ignoring a trailing "?". */
function countPhraseOccurrences(text: string, phrase: string): number {
  const needle = phrase.trim().replace(/\?$/, "");
  if (!needle) return 0;
  const escaped = needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return (text.match(new RegExp(escaped, "gi")) ?? []).length;
}

function checkContract(post: ParsedPost) {
  const { frontmatter, body } = post;
  const errors: string[] = [];

  const answerWords = countWords(frontmatter.answer);
  if (answerWords < 40 || answerWords > 60) {
    errors.push(`answer is ${answerWords} words, must be 40-60`);
  }

  const lowerAnswer = frontmatter.answer.toLowerCase();
  for (const phrase of BANNED_PHRASES) {
    if (lowerAnswer.includes(phrase)) errors.push(`answer contains banned phrase "${phrase}"`);
  }

  for (const s of frontmatter.sources) {
    if (!s.url.startsWith("https://")) errors.push(`source "${s.label}" is not https`);
  }

  for (const f of frontmatter.faq) {
    if (!f.q.trim().endsWith("?")) errors.push(`faq question "${f.q}" does not end with "?"`);
  }
  if (frontmatter.faq.length < 3) errors.push(`only ${frontmatter.faq.length} FAQ entries, need at least 3`);

  if (frontmatter.dateModified < frontmatter.datePublished) {
    errors.push(`dateModified (${frontmatter.dateModified}) is before datePublished (${frontmatter.datePublished})`);
  }

  if (!AUTHOR_SLUGS[frontmatter.author]) {
    errors.push(`author "${frontmatter.author}" is not in AUTHOR_SLUGS (src/lib/schema/people.ts)`);
  }

  const coverPath = path.join(process.cwd(), "public", frontmatter.cover);
  if (!fs.existsSync(coverPath)) {
    errors.push(`cover "${frontmatter.cover}" does not exist at ${coverPath}`);
  }

  const coverAltWords = countWords(frontmatter.coverAlt);
  if (coverAltWords < 5) {
    errors.push(`coverAlt is ${coverAltWords} words, must be at least 5`);
  }
  const lowerCoverAlt = frontmatter.coverAlt.trim().toLowerCase();
  if (LAZY_ALT_PREFIXES.some((prefix) => lowerCoverAlt.startsWith(prefix))) {
    errors.push(`coverAlt starts with a lazy "Zdjęcie"/"Obraz" opener`);
  }

  if (!hasTableOrNumberedList(body)) {
    errors.push("body has no markdown table and no numbered list");
  }

  const stuffing = countPhraseOccurrences(body, frontmatter.question);
  if (stuffing > 8) errors.push(`question phrase repeated ${stuffing} times in body, max is 8`);

  return errors;
}

describe("blog post contract", () => {
  const filenames = listPostFilenames();

  it("has at least one seed post to validate", () => {
    expect(filenames.length).toBeGreaterThan(0);
  });

  for (const filename of filenames) {
    it(`${filename} satisfies the full contract`, () => {
      const post = parsePostFile(readPostFile(filename), filename);
      const errors = checkContract(post);
      expect(errors, errors.join("\n")).toEqual([]);
    });
  }
});

describe("blog post contract — default cover warning", () => {
  // The fallback cover (docs/content/PUBLISHING.md section 5) is a permitted,
  // not an error — the cloud publishing agent has no Codex access and is
  // expected to reach for it. But "permitted" must not mean "invisible": a
  // human reviewing the PR needs to see at a glance that the cover is a
  // placeholder, not the dedicated one the automation's PR body asks Wojtek
  // to generate before merge. console.warn (not a thrown/failed assertion)
  // is the right signal — it shows up in `npm test` output without turning
  // a legitimate, contract-compliant post red.
  const filenames = listPostFilenames();

  for (const filename of filenames) {
    it(`warns if ${filename} uses the fallback cover`, () => {
      const post = parsePostFile(readPostFile(filename), filename);
      if (post.frontmatter.cover === "/blog/covers/default.webp") {
        console.warn(
          `[blog-contract] ${filename} uses the fallback cover (/blog/covers/default.webp) — ` +
            `generate a dedicated one before merge (docs/content/PUBLISHING.md section 5).`,
        );
      }
      // No assertion — this block exists to warn, not to fail the suite.
      expect(true).toBe(true);
    });
  }
});

describe("blog post contract — adversarial guard", () => {
  // Frontmatter-shape-valid (passes zod) but violates every rule the
  // contract adds on top. If this suite ever goes green, the contract test
  // has been weakened into a tautology and stopped protecting anything.
  const brokenRaw = `---
slug: broken-post
title: Zepsuty testowy wpis
question: Czy to jest zepsuty wpis testowy?
answer: To zależy, jak wspomniano wyżej w tej krótkiej odpowiedzi testowej.
cluster: test-klaster
author: nieznany-ghostwriter
datePublished: "2026-08-08"
dateModified: "2026-08-01"
cover: /blog/covers/nie-istnieje.webp
coverAlt: Zdjęcie biurka.
sources:
  - label: "Przykładowe źródło"
    url: "https://example.com/source"
    date: "2026-01-01"
faq:
  - q: "Pierwsze pytanie testowe?"
    a: "Odpowiedź jeden."
  - q: "Drugie pytanie testowe?"
    a: "Odpowiedź dwa."
  - q: "Trzecie pytanie testowe?"
    a: "Odpowiedź trzy."
lang: pl
---

Ten wpis nie zawiera ani tabeli, ani listy numerowanej - tylko zwykłe akapity
tekstu, żeby złamać regułę o strukturze treści.
`;

  it("parses (frontmatter shape is zod-valid)", () => {
    expect(() => parsePostFile(brokenRaw, "broken-post.mdx")).not.toThrow();
  });

  it("fails the contract on every rule it was designed to violate", () => {
    const post = parsePostFile(brokenRaw, "broken-post.mdx");
    const errors = checkContract(post);

    // Every one of these is a rule zod's shape check cannot express — this
    // fixture is deliberately schema-valid (see the "parses" test above) so
    // that a green result here can only mean the contract-specific checks
    // below are the ones catching it, not a zod rejection upstream.
    expect(errors.some((e) => e.includes("must be 40-60"))).toBe(true);
    expect(errors.some((e) => e.includes("banned phrase"))).toBe(true);
    expect(errors.some((e) => e.includes("dateModified"))).toBe(true);
    expect(errors.some((e) => e.includes("AUTHOR_SLUGS"))).toBe(true);
    expect(errors.some((e) => e.includes("no markdown table"))).toBe(true);
    expect(errors.some((e) => e.includes("does not exist"))).toBe(true);
    expect(errors.some((e) => e.includes("at least 5"))).toBe(true);
    expect(errors.some((e) => e.includes("lazy"))).toBe(true);
    expect(errors.length).toBeGreaterThanOrEqual(8);
  });

  it("rejects frontmatter that is not even shape-valid (missing required fields)", () => {
    const malformed = `---
slug: missing-fields
title: Brakujące pola
---

Treść bez wymaganych pól frontmatter.
`;
    expect(() => parsePostFile(malformed, "missing-fields.mdx")).toThrow();
  });

  it("rejects a post whose frontmatter slug does not match its filename", () => {
    const mismatched = brokenRaw.replace("slug: broken-post", "slug: broken-post");
    expect(() => parsePostFile(mismatched, "different-filename.mdx")).toThrow(/does not match the filename/);
  });
});
