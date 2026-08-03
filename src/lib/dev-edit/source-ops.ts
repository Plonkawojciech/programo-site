/**
 * Source surgery for the localhost visual editor.
 *
 * The point of the editor is that edits are *real*: copy lives in the i18n
 * dictionaries and colours live as custom properties in globals.css, so an
 * editor that only mutated the DOM would lose everything on reload and could
 * never be committed. Every operation here rewrites the actual source file, so
 * the change shows up in `git diff` and ships like any other commit.
 *
 * Server-only — imported exclusively by the dev-gated route handler.
 */

import { promises as fs } from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC = path.join(ROOT, "src");

/** Anything the editor writes must live under src/. */
function resolveInRepo(rel: string): string {
  const abs = path.resolve(ROOT, rel);
  if (abs !== SRC && !abs.startsWith(SRC + path.sep)) {
    throw new Error(`Refusing to write outside src/: ${rel}`);
  }
  return abs;
}

/* ── Tiny JS/TS scanners ─────────────────────────────────────────────── */

/** Index of the closing quote of the string literal starting at `i`. */
function skipString(src: string, i: number): number {
  const quote = src[i];
  for (let j = i + 1; j < src.length; j++) {
    if (src[j] === "\\") {
      j++;
      continue;
    }
    if (src[j] === quote) return j;
  }
  return src.length - 1;
}

/**
 * Index of the `}` matching the `{` at `openIdx`, skipping over string
 * literals so a brace inside copy can't throw the count off.
 */
function matchBrace(src: string, openIdx: number): number {
  let depth = 0;
  for (let i = openIdx; i < src.length; i++) {
    const c = src[i];
    if (c === '"' || c === "'" || c === "`") {
      i = skipString(src, i);
      continue;
    }
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

/** Whitespace at the start of the line containing `idx`. */
function indentAt(src: string, idx: number): string {
  const lineStart = src.lastIndexOf("\n", idx - 1) + 1;
  return /^[ \t]*/.exec(src.slice(lineStart, idx))?.[0] ?? "";
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/* ── Translations ────────────────────────────────────────────────────── */

const DICT_DIR = "src/lib/i18n/dictionaries";
const DICT_MODULES = [
  "common",
  "home",
  "offer",
  "projects",
  "about",
  "pricing",
  "contact",
  "forms",
  "marketing",
] as const;

export interface TextEdit {
  key: string;
  pl?: string;
  en?: string;
}

/**
 * Rewrites one dictionary entry in place.
 *
 * Entries come in two shapes in these files — single-line
 * (`"k": { pl: "a", en: "b" },`) and expanded across lines. The original shape
 * is preserved so diffs stay minimal, except that a single-line entry which
 * grows past the file's ~110-column habit is expanded, which is exactly what a
 * human editing the file would do.
 */
export async function writeTranslation(edit: TextEdit): Promise<{ file: string }> {
  const { key } = edit;
  if (edit.pl === undefined && edit.en === undefined) {
    throw new Error("Nothing to write: both pl and en are undefined");
  }

  const needle = `${JSON.stringify(key)}:`;

  for (const mod of DICT_MODULES) {
    const rel = `${DICT_DIR}/${mod}.ts`;
    const abs = resolveInRepo(rel);
    const src = await fs.readFile(abs, "utf8");

    const at = src.indexOf(needle);
    if (at === -1) continue;

    const open = src.indexOf("{", at + needle.length);
    if (open === -1) throw new Error(`Malformed entry for ${key} in ${rel}`);
    const close = matchBrace(src, open);
    if (close === -1) throw new Error(`Unbalanced braces for ${key} in ${rel}`);

    let span = src.slice(open, close + 1);

    for (const lang of ["pl", "en"] as const) {
      const value = edit[lang];
      if (value === undefined) continue;
      const re = new RegExp(`(\\b${lang}\\s*:\\s*)("(?:[^"\\\\]|\\\\.)*")`);
      if (!re.test(span)) {
        throw new Error(`No ${lang} string literal in entry ${key} (${rel})`);
      }
      // Function replacer: `$` in the new copy stays literal.
      span = span.replace(re, (_m, prefix: string) => prefix + JSON.stringify(value));
    }

    const indent = indentAt(src, at);
    if (!span.includes("\n") && indent.length + needle.length + span.length > 110) {
      const pl = /\bpl\s*:\s*("(?:[^"\\]|\\.)*")/.exec(span)?.[1];
      const en = /\ben\s*:\s*("(?:[^"\\]|\\.)*")/.exec(span)?.[1];
      if (pl && en) {
        span = `{\n${indent}  pl: ${pl},\n${indent}  en: ${en},\n${indent}}`;
      }
    }

    await fs.writeFile(abs, src.slice(0, open) + span + src.slice(close + 1), "utf8");
    return { file: rel };
  }

  throw new Error(`Translation key not found in any dictionary: ${key}`);
}

/* ── Theme colours ───────────────────────────────────────────────────── */

const GLOBALS = "src/app/globals.css";
const TOKEN_RE = /^[a-z0-9-]+$/;
// Deliberately narrow: hex, rgb/rgba, hsl/hsla, or a bare RGB triple (the
// `-rgb` companions are stored as `5, 31, 32`). Anything else is rejected
// rather than pasted into a stylesheet.
const COLOR_RE =
  /^(#[0-9a-fA-F]{3,8}|rgba?\([\d\s.,%/]+\)|hsla?\([\d\s.,%/]+\)|\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3})$/;

export type ThemeName = "dark" | "light";

/** Top-level block body for `:root` / `[data-theme="light"]`. */
function themeBlock(src: string, theme: ThemeName): { start: number; end: number } {
  const header = theme === "dark" ? ":root {" : '[data-theme="light"] {';
  const start = src.indexOf(header);
  if (start === -1) throw new Error(`Block ${header} not found in ${GLOBALS}`);
  // These are top-level rules, so the closing brace sits at column 0. Scanning
  // for that beats brace-counting, which would trip over braces inside the
  // long explanatory comments in this file.
  const end = src.indexOf("\n}", start);
  if (end === -1) throw new Error(`Unterminated block ${header} in ${GLOBALS}`);
  return { start: start + header.length, end };
}

function hexToRgbTriple(hex: string): string | null {
  let h = hex.replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  if (h.length !== 6) return null;
  const n = Number.parseInt(h, 16);
  if (Number.isNaN(n)) return null;
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

/**
 * Rewrites one `--theme-*` custom property inside one theme block.
 *
 * Several tokens ship an `-rgb` companion (`--theme-bg-1` / `--theme-bg-1-rgb`)
 * because parts of the UI need the channels for `rgb(... / <alpha>)`. Editing
 * the hex without the companion would silently desynchronise the two, so the
 * companion is recomputed whenever it exists.
 */
export async function writeThemeToken(
  token: string,
  theme: ThemeName,
  value: string
): Promise<{ file: string; alsoUpdated: string[] }> {
  if (!TOKEN_RE.test(token)) throw new Error(`Invalid token name: ${token}`);
  const v = value.trim();
  if (!COLOR_RE.test(v)) throw new Error(`Invalid colour value: ${value}`);

  const abs = resolveInRepo(GLOBALS);
  const src = await fs.readFile(abs, "utf8");
  const { start, end } = themeBlock(src, theme);

  let block = src.slice(start, end);
  const alsoUpdated: string[] = [];

  const apply = (name: string, next: string): boolean => {
    const re = new RegExp(`(--${escapeRe(name)}\\s*:\\s*)([^;\\n]*)(;)`);
    if (!re.test(block)) return false;
    block = block.replace(re, (_m, p1: string, _old: string, p3: string) => p1 + next + p3);
    return true;
  };

  if (!apply(token, v)) {
    throw new Error(`Token --${token} not found in the ${theme} block`);
  }

  const triple = v.startsWith("#") ? hexToRgbTriple(v) : null;
  if (triple && apply(`${token}-rgb`, triple)) {
    alsoUpdated.push(`--${token}-rgb`);
  }

  await fs.writeFile(abs, src.slice(0, start) + block + src.slice(end), "utf8");
  return { file: GLOBALS, alsoUpdated };
}

/** Current value of every `--theme-*` token in a block, for the picker UI. */
export async function readThemeTokens(theme: ThemeName): Promise<Record<string, string>> {
  const src = await fs.readFile(resolveInRepo(GLOBALS), "utf8");
  const { start, end } = themeBlock(src, theme);
  const block = src.slice(start, end);
  const out: Record<string, string> = {};
  for (const m of block.matchAll(/--(theme-[a-z0-9-]+)\s*:\s*([^;\n]*);/g)) {
    out[m[1]] = m[2].trim();
  }
  return out;
}

/* ── Removals ────────────────────────────────────────────────────────── */

/**
 * Drops a `<Tag ... />` element from a file, plus its import if that was the
 * only use. Used to delete a whole homepage section from `page.tsx`.
 */
export async function removeJsxElement(
  rel: string,
  tag: string
): Promise<{ file: string; removedImport: boolean }> {
  if (!/^[A-Z][A-Za-z0-9_]*$/.test(tag)) throw new Error(`Invalid component name: ${tag}`);
  const abs = resolveInRepo(rel);
  const src = await fs.readFile(abs, "utf8");

  // Self-closing usage on its own line, which is how page.tsx composes sections.
  const usage = new RegExp(`^[ \\t]*<${escapeRe(tag)}(\\s[^\\n]*?)?/>[ \\t]*\\n`, "m");
  if (!usage.test(src)) throw new Error(`No <${tag} /> element found in ${rel}`);
  let out = src.replace(usage, "");

  let removedImport = false;
  // If nothing references it any more, the import would fail lint as unused.
  const stillUsed = new RegExp(`<${escapeRe(tag)}[\\s/>]`).test(out);
  if (!stillUsed) {
    const imp = new RegExp(`^import\\s+${escapeRe(tag)}\\s+from\\s+["'][^"']+["'];?[ \\t]*\\n`, "m");
    if (imp.test(out)) {
      out = out.replace(imp, "");
      removedImport = true;
    }
  }

  await fs.writeFile(abs, out, "utf8");
  return { file: rel, removedImport };
}

/**
 * Drops one entry from a top-level array literal, identified by a substring
 * that appears inside it (a slug, a client name). Used for the repeated rows —
 * case studies, product listing, client wordmarks, marquee slugs.
 */
export async function removeArrayEntry(
  rel: string,
  arrayName: string,
  contains: string
): Promise<{ file: string }> {
  if (!/^[A-Za-z_$][\w$]*$/.test(arrayName)) throw new Error(`Invalid array name: ${arrayName}`);
  const abs = resolveInRepo(rel);
  const src = await fs.readFile(abs, "utf8");

  const decl = new RegExp(`\\b(?:const|let|var)\\s+${escapeRe(arrayName)}\\b[^=]*=\\s*\\[`);
  const m = decl.exec(src);
  if (!m) throw new Error(`Array ${arrayName} not found in ${rel}`);

  // The opener is the `[` the regex itself matched, not the first `[` after the
  // declaration: `const cases: CaseStudy[] = [` puts the type annotation's
  // brackets in between, and scanning for those finds an empty pair instead.
  const open = m.index + m[0].length - 1;
  // Reuse the brace matcher by tracking brackets the same way.
  let depth = 0;
  let close = -1;
  for (let i = open; i < src.length; i++) {
    const c = src[i];
    if (c === '"' || c === "'" || c === "`") {
      i = skipString(src, i);
      continue;
    }
    if (c === "[") depth++;
    else if (c === "]") {
      depth--;
      if (depth === 0) {
        close = i;
        break;
      }
    }
  }
  if (close === -1) throw new Error(`Unterminated array ${arrayName} in ${rel}`);

  const body = src.slice(open + 1, close);

  // Split the array body into top-level entries, then drop the matching one.
  const entries: string[] = [];
  let depthObj = 0;
  let start = 0;
  for (let i = 0; i < body.length; i++) {
    const c = body[i];
    if (c === '"' || c === "'" || c === "`") {
      i = skipString(body, i);
      continue;
    }
    if (c === "{" || c === "[" || c === "(") depthObj++;
    else if (c === "}" || c === "]" || c === ")") depthObj--;
    else if (c === "," && depthObj === 0) {
      entries.push(body.slice(start, i + 1));
      start = i + 1;
    }
  }
  const tail = body.slice(start);

  const hit = entries.findIndex((e) => e.includes(contains));
  if (hit === -1) {
    throw new Error(`No entry containing ${JSON.stringify(contains)} in ${arrayName}`);
  }
  entries.splice(hit, 1);

  const nextBody = entries.join("") + tail;
  await fs.writeFile(abs, src.slice(0, open + 1) + nextBody + src.slice(close), "utf8");
  return { file: rel };
}
