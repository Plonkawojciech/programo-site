/**
 * Write endpoint for the localhost visual editor.
 *
 * Every branch below edits a file in `src/`, so this is deliberately fenced:
 *
 *   1. `NODE_ENV !== "development"` → 404 before anything is parsed. The route
 *      still exists in a production build (Next collects it at build time), but
 *      it answers as if it doesn't, and the overlay that calls it is never
 *      rendered there either.
 *   2. Requests must come from a loopback host. Guards the case of a dev server
 *      bound to 0.0.0.0 on a shared network.
 *   3. Paths are never taken from the request. Text edits resolve through the
 *      dictionary lookup, colours through the token allowlist, deletions
 *      through the registry in `targets.ts`.
 */

import { NextResponse } from "next/server";
import {
  writeTranslation,
  writeThemeToken,
  readThemeTokens,
  removeJsxElement,
  removeArrayEntry,
  type ThemeName,
} from "@/lib/dev-edit/source-ops";
import { PAGE_FILE, findSectionTarget, findListTarget } from "@/lib/dev-edit/targets";

const DEV = process.env.NODE_ENV === "development";

const notFound = () => new NextResponse("Not found", { status: 404 });

/** Rejects anything that isn't the machine running the dev server. */
function isLocal(req: Request): boolean {
  const host = (req.headers.get("host") ?? "").split(":")[0].toLowerCase();
  return host === "localhost" || host === "127.0.0.1" || host === "::1" || host === "[::1]";
}

function isTheme(v: unknown): v is ThemeName {
  return v === "dark" || v === "light";
}

function fail(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function GET(req: Request) {
  if (!DEV || !isLocal(req)) return notFound();
  const theme = new URL(req.url).searchParams.get("theme");
  if (!isTheme(theme)) return fail("theme must be 'dark' or 'light'");
  return NextResponse.json({ ok: true, tokens: await readThemeTokens(theme) });
}

export async function POST(req: Request) {
  if (!DEV || !isLocal(req)) return notFound();

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return fail("Body is not JSON");
  }

  try {
    switch (body.op) {
      /* Copy — resolved by key against the dictionaries. */
      case "text": {
        const { key, pl, en } = body;
        if (typeof key !== "string" || !key) return fail("key is required");
        if (pl !== undefined && typeof pl !== "string") return fail("pl must be a string");
        if (en !== undefined && typeof en !== "string") return fail("en must be a string");
        const res = await writeTranslation({ key, pl, en });
        return NextResponse.json({ ok: true, ...res });
      }

      /* Colour — one `--theme-*` custom property in one theme block. */
      case "color": {
        const { token, theme, value } = body;
        if (typeof token !== "string") return fail("token is required");
        if (!isTheme(theme)) return fail("theme must be 'dark' or 'light'");
        if (typeof value !== "string") return fail("value is required");
        const res = await writeThemeToken(token, theme, value);
        return NextResponse.json({ ok: true, ...res });
      }

      /* Deletion — id looked up in the registry; nothing else is accepted. */
      case "deleteSection": {
        const target = typeof body.id === "string" ? findSectionTarget(body.id) : undefined;
        if (!target) return fail(`Unknown section: ${String(body.id)}`);
        const res = await removeJsxElement(PAGE_FILE, target.tag);
        return NextResponse.json({ ok: true, ...res });
      }

      case "deleteListItem": {
        const target = typeof body.id === "string" ? findListTarget(body.id) : undefined;
        if (!target) return fail(`Unknown list: ${String(body.id)}`);
        const param = body.param;
        if (typeof param !== "string" || !target.paramPattern.test(param)) {
          return fail(`Invalid item: ${String(param)}`);
        }
        const res = await removeArrayEntry(target.file, target.array, target.marker(param));
        return NextResponse.json({ ok: true, ...res });
      }

      default:
        return fail(`Unknown op: ${String(body.op)}`);
    }
  } catch (err) {
    // Source surgery throws with a readable reason (key not found, unbalanced
    // braces, token missing). Surface it — the overlay shows it verbatim, which
    // is what makes a failed edit debuggable instead of mysterious.
    return fail(err instanceof Error ? err.message : "Edit failed", 422);
  }
}
