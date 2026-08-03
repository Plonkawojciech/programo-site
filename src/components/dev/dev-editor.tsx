"use client";

/**
 * Localhost visual editor — click a thing, change it, and the change lands in
 * the source file.
 *
 * Why it maps back to source rather than the DOM: the copy on this site comes
 * from the i18n dictionaries and the colours from custom properties in
 * globals.css. An editor that only pushed new text into a node would look right
 * until the next reload and could never be committed. So every action here goes
 * through `/api/dev-edit`, which rewrites the real file; Fast Refresh then
 * re-renders with the value that is genuinely on disk. What you see after an
 * edit is the committed state, not a preview of it.
 *
 * How an element is identified without touching production markup: `t()` is a
 * lookup in `translations`, so a rendered string *is* a dictionary value. The
 * overlay indexes that object once and matches on normalised text, which means
 * no `data-edit-*` attributes anywhere in the components.
 *
 * The chrome deliberately uses hardcoded colours instead of the site's design
 * tokens: you can edit those tokens from in here, and an editor that becomes
 * unreadable the moment you pick a bad background is not much of an editor.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { translations } from "@/lib/i18n";
import { SECTION_TARGETS, type SectionTarget } from "@/lib/dev-edit/targets";

type Lang = "pl" | "en";
type Theme = "dark" | "light";
type Mode = "off" | "pick" | "colors";

const DICT = translations as unknown as Record<string, { pl: string; en: string }>;

/** Collapse whitespace so JSX indentation doesn't defeat the match. */
function norm(s: string): string {
  return s.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

/* ── Element → dictionary key ─────────────────────────────────────────── */

interface TextHit {
  el: HTMLElement;
  key: string;
}

function buildIndex(): Map<string, string> {
  const index = new Map<string, string>();
  for (const [key, value] of Object.entries(DICT)) {
    for (const lang of ["pl", "en"] as const) {
      const text = norm(value?.[lang] ?? "");
      // First key wins. Duplicate copy across keys is rare here, and picking
      // the first is stable across reloads — which matters more than picking
      // "the right one" for a string that is identical either way.
      if (text.length > 1 && !index.has(text)) index.set(text, key);
    }
  }
  return index;
}

/**
 * Deepest editable ancestor of `el`. Starts at the node under the cursor and
 * walks up, so the tightest match wins — a heading resolves to the heading, not
 * to the section wrapping it.
 */
function findText(el: Element | null, index: Map<string, string>): TextHit | null {
  let node: Element | null = el;
  for (let i = 0; node && i < 8; i++, node = node.parentElement) {
    if (node.closest("[data-dev-editor]")) return null;
    const key = index.get(norm(node.textContent ?? ""));
    if (key) return { el: node as HTMLElement, key };
  }
  return null;
}

function sectionOf(el: Element | null): SectionTarget | null {
  const section = el?.closest("section");
  if (!section) return null;
  const text = norm(section.textContent ?? "");
  for (const target of SECTION_TARGETS) {
    const anchor = norm(DICT[target.anchorKey]?.pl ?? "");
    if (anchor && text.includes(anchor)) return target;
  }
  return null;
}

/** A repeated row: a case study, a product, or a client wordmark. */
interface ListHit {
  id: "case" | "product" | "client";
  param: string;
  label: string;
}

/**
 * The project link that owns `el`. Usually `el` is inside the link, but a case
 * study's heading and copy are siblings of its image link, so an ancestor-only
 * search would offer "delete this row" on the thumbnail and nothing else — the
 * least likely place to click. Widening one ancestor at a time and stopping at
 * the first container holding exactly one project link finds the card without
 * hardcoding the markup: keep widening and you eventually swallow the whole
 * section and every row in it.
 */
function ownedSlug(el: Element | null): string | null {
  const inside = el?.closest<HTMLAnchorElement>('a[href^="/projects/"]');
  const href = inside?.getAttribute("href") ?? null;
  if (href) return href.split("/").filter(Boolean).pop() ?? null;

  let node = el?.parentElement ?? null;
  while (node && node.tagName !== "SECTION") {
    const links = node.querySelectorAll<HTMLAnchorElement>('a[href^="/projects/"]');
    if (links.length === 1) {
      return links[0].getAttribute("href")?.split("/").filter(Boolean).pop() ?? null;
    }
    if (links.length > 1) return null;
    node = node.parentElement;
  }
  return null;
}

function findListItem(el: Element | null, section: SectionTarget | null): ListHit | null {
  const slug = ownedSlug(el);
  if (slug) {
    if (section?.id === "client-work") {
      return { id: "case", param: slug, label: `realizację „${slug}"` };
    }
    if (section?.id === "own-products") {
      return { id: "product", param: slug, label: `produkt „${slug}"` };
    }
  }
  // Client marks are bare leaf spans, so they carry no href to key off. Most are
  // CSS-masked logos and therefore empty — the name lives in `aria-label`, which
  // is what the screen reader announces too. The one client with no artwork is
  // still typeset, so fall back to its text.
  if (section?.id === "trust-bar" && el && el.childElementCount === 0) {
    const name = norm(el.getAttribute("aria-label") ?? el.textContent ?? "");
    if (name && name.length <= 40 && /^[\p{L}\p{N} .-]+$/u.test(name)) {
      return { id: "client", param: name, label: `logotyp „${name}"` };
    }
  }
  return null;
}

/* ── Colour helpers ───────────────────────────────────────────────────── */

/** Resolves any CSS colour notation to the browser's canonical `rgb(...)`. */
function makeColorResolver(): (v: string) => string {
  const probe = document.createElement("span");
  probe.style.cssText = "position:absolute;visibility:hidden;pointer-events:none";
  document.body.appendChild(probe);
  return (raw: string) => {
    const v = /^\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}$/.test(raw.trim()) ? `rgb(${raw})` : raw;
    probe.style.color = "";
    probe.style.color = v;
    return getComputedStyle(probe).color;
  };
}

const TRIPLET_RE = /^(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})$/;

/**
 * A few tokens are stored as a bare `R, G, B` triplet rather than a colour,
 * because they are consumed inside `rgba(var(--theme-glow), .1)`. They still
 * deserve a picker, but writing a hex into one would break every rule that
 * interpolates it, so the shape has to survive the round trip.
 */
function toHexInput(value: string): string | null {
  const raw = value.trim();

  const triplet = TRIPLET_RE.exec(raw);
  if (triplet) {
    const parts = triplet.slice(1, 4).map(Number);
    if (parts.some((n) => n > 255)) return null;
    return `#${parts.map((n) => n.toString(16).padStart(2, "0")).join("")}`;
  }

  const m = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.exec(raw);
  if (!m) return null;
  const h = m[1];
  return h.length === 3 ? `#${h[0]}${h[0]}${h[1]}${h[1]}${h[2]}${h[2]}` : `#${h}`;
}

/** Formats a picked hex back into whatever notation the token already used. */
function toStoredShape(hex: string, previous: string): string {
  if (!TRIPLET_RE.test(previous.trim())) return hex;
  const n = parseInt(hex.slice(1), 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

/* ── Component ────────────────────────────────────────────────────────── */

export default function DevEditor() {
  const [mounted, setMounted] = useState(false);
  const [mode, setMode] = useState<Mode>("off");
  const [lang, setLang] = useState<Lang>("pl");
  const [theme, setTheme] = useState<Theme>("dark");

  const [hover, setHover] = useState<DOMRect | null>(null);
  // `key` is nullable because not every selectable thing is translated copy:
  // client wordmarks live in a plain array in trust-bar.tsx and project titles
  // come from projects.ts. Those have nothing to edit here but are still worth
  // selecting, because selecting them is how you reach their delete button.
  const [sel, setSel] = useState<{
    key: string | null;
    section: SectionTarget | null;
    item: ListHit | null;
  } | null>(null);
  const [draft, setDraft] = useState<{ pl: string; en: string }>({ pl: "", en: "" });

  const [tokens, setTokens] = useState<Record<string, string> | null>(null);
  const [usedTokens, setUsedTokens] = useState<string[]>([]);

  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<{ kind: "ok" | "err"; text: string } | null>(null);

  const index = useMemo(() => (mounted ? buildIndex() : new Map<string, string>()), [mounted]);
  const resolveColor = useRef<((v: string) => string) | null>(null);

  useEffect(() => {
    setMounted(true);
    resolveColor.current = makeColorResolver();
    const attr = document.documentElement.getAttribute("data-theme");
    setTheme(attr === "light" ? "light" : "dark");
    setLang(document.documentElement.lang === "en" ? "en" : "pl");
  }, []);

  const post = useCallback(async (body: Record<string, unknown>) => {
    setBusy(true);
    setNote(null);
    try {
      const res = await fetch("/api/dev-edit", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
      if (!res.ok || !json.ok) throw new Error(json.error ?? `HTTP ${res.status}`);
      setNote({ kind: "ok", text: `Zapisano → ${json.file}` });
      return true;
    } catch (err) {
      setNote({ kind: "err", text: err instanceof Error ? err.message : "Nie udało się zapisać" });
      return false;
    } finally {
      setBusy(false);
    }
  }, []);

  /* Picking mode: highlight on hover, open the editor on click. */
  useEffect(() => {
    if (mode !== "pick") {
      setHover(null);
      return;
    }
    const onMove = (e: MouseEvent) => {
      const hit = findText(document.elementFromPoint(e.clientX, e.clientY), index);
      setHover(hit ? hit.el.getBoundingClientRect() : null);
    };
    const onClick = (e: MouseEvent) => {
      // The "is this our own chrome?" test has to read the event's target, not
      // the point under the cursor: a click raised by the keyboard (Enter or
      // Space on a focused button) carries coordinates 0,0, so hit-testing
      // would look at the top-left corner of the page and swallow every button
      // press inside the panel.
      const target = e.target instanceof Element ? e.target : null;
      if (target?.closest("[data-dev-editor]")) return;
      e.preventDefault();
      e.stopPropagation();
      const under = document.elementFromPoint(e.clientX, e.clientY) ?? target;
      const hit = findText(under, index);
      const anchor = hit?.el ?? (under as HTMLElement | null);
      if (!anchor) return;

      const section = sectionOf(anchor);
      const item = findListItem(under, section);
      // Nothing to edit and nothing to delete means the click landed on
      // scenery, so leave the previous selection alone rather than clearing it.
      if (!hit && !item && !section) return;

      setSel({ key: hit?.key ?? null, section, item });
      setDraft({ pl: hit ? DICT[hit.key]?.pl ?? "" : "", en: hit ? DICT[hit.key]?.en ?? "" : "" });

      // Which palette tokens actually paint this element — the bridge from
      // "this bit looks wrong" to "this is the token to change".
      const resolve = resolveColor.current;
      if (resolve && tokens) {
        const cs = getComputedStyle(anchor);
        const wanted = new Set([cs.color, cs.backgroundColor, cs.borderTopColor].filter(Boolean));
        setUsedTokens(
          Object.entries(tokens)
            .filter(([name, value]) => !name.endsWith("-rgb") && wanted.has(resolve(value)))
            .map(([name]) => name)
        );
      } else {
        setUsedTokens([]);
      }
    };
    document.addEventListener("mousemove", onMove, true);
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("mousemove", onMove, true);
      document.removeEventListener("click", onClick, true);
    };
  }, [mode, index, tokens]);

  /* Load the palette whenever the colour panel opens or the theme flips. */
  useEffect(() => {
    if (mode === "off") return;
    let cancelled = false;
    fetch(`/api/dev-edit?theme=${theme}`)
      .then((r) => r.json())
      .then((j) => {
        if (!cancelled && j?.ok) setTokens(j.tokens);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [mode, theme]);

  /* Alt+E toggles; Escape backs out one level. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.altKey && e.key.toLowerCase() === "e") {
        e.preventDefault();
        setMode((m) => (m === "off" ? "pick" : "off"));
        setSel(null);
      }
      if (e.key === "Escape") {
        if (sel) setSel(null);
        else if (mode !== "off") setMode("off");
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mode, sel]);

  if (!mounted) return null;

  const saveText = async () => {
    if (!sel) return;
    if (!sel.key) return;
    if (await post({ op: "text", key: sel.key, pl: draft.pl, en: draft.en })) setSel(null);
  };

  const remove = async (body: Record<string, unknown>, what: string) => {
    if (!window.confirm(`Usunąć ${what} na stałe? Zmiana trafi do pliku źródłowego.`)) return;
    if (await post(body)) setSel(null);
  };

  const saveColor = (token: string, value: string) => {
    setTokens((t) => (t ? { ...t, [token]: value } : t));
    void post({ op: "color", token, theme, value });
  };

  return createPortal(
    <div data-dev-editor="" style={S.root}>
      {/* Hover outline. Rendered as its own layer so the page's own styles are
          never mutated — an editor that leaves residue is worse than no editor. */}
      {mode === "pick" && hover && (
        <div
          style={{
            ...S.highlight,
            top: hover.top - 2,
            left: hover.left - 2,
            width: hover.width + 4,
            height: hover.height + 4,
          }}
        />
      )}

      {/* Launcher */}
      {mode === "off" && (
        <button type="button" onClick={() => setMode("pick")} style={S.launcher} title="Alt+E">
          Edytuj stronę
        </button>
      )}

      {/* Toolbar */}
      {mode !== "off" && (
        <div style={S.bar}>
          <span style={S.brand}>Edytor · localhost</span>
          <button type="button" onClick={() => setMode("pick")} style={S.tab(mode === "pick")}>
            Teksty
          </button>
          <button type="button" onClick={() => setMode("colors")} style={S.tab(mode === "colors")}>
            Kolory
          </button>
          <span style={S.sep} />
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value as Theme)}
            style={S.select}
            aria-label="Motyw"
          >
            <option value="dark">ciemny</option>
            <option value="light">jasny</option>
          </select>
          <button
            type="button"
            onClick={() => {
              setMode("off");
              setSel(null);
            }}
            style={S.close}
          >
            Zamknij
          </button>
        </div>
      )}

      {/* Text panel */}
      {sel && (
        <div style={S.panel}>
          <div style={S.panelHead}>
            <code style={S.key}>{sel.key ?? sel.item?.label ?? sel.section?.label}</code>
            <button type="button" onClick={() => setSel(null)} style={S.close}>
              ✕
            </button>
          </div>

          {sel.key && (
            <>
              <div style={S.langRow}>
                {(["pl", "en"] as const).map((l) => (
                  <button key={l} type="button" onClick={() => setLang(l)} style={S.tab(lang === l)}>
                    {l.toUpperCase()}
                  </button>
                ))}
              </div>

              <textarea
                value={draft[lang]}
                onChange={(e) => setDraft((d) => ({ ...d, [lang]: e.target.value }))}
                rows={5}
                style={S.textarea}
                spellCheck={false}
              />
            </>
          )}

          {sel.key ? (
            <button type="button" onClick={saveText} disabled={busy} style={S.primary}>
              {busy ? "Zapisywanie…" : "Zapisz do pliku"}
            </button>
          ) : (
            <p style={S.hint}>
              Ten tekst nie pochodzi ze słownika — edytuj go w pliku źródłowym. Tutaj możesz go
              usunąć.
            </p>
          )}

          {usedTokens.length > 0 && tokens && (
            <div style={S.group}>
              <div style={S.groupTitle}>Kolory tego elementu</div>
              {usedTokens.map((name) => (
                <Swatch key={name} name={name} value={tokens[name]} onChange={saveColor} />
              ))}
            </div>
          )}

          {(sel.item || sel.section) && (
            <div style={S.group}>
              <div style={S.groupTitle}>Usuń na stałe</div>
              {sel.item && (
                <button
                  type="button"
                  disabled={busy}
                  style={S.danger}
                  onClick={() =>
                    remove(
                      { op: "deleteListItem", id: sel.item!.id, param: sel.item!.param },
                      sel.item!.label
                    )
                  }
                >
                  Usuń {sel.item.label}
                </button>
              )}
              {sel.section && (
                <button
                  type="button"
                  disabled={busy}
                  style={S.danger}
                  onClick={() =>
                    remove(
                      { op: "deleteSection", id: sel.section!.id },
                      `sekcję „${sel.section!.label}"`
                    )
                  }
                >
                  Usuń sekcję: {sel.section.label}
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Colour panel */}
      {mode === "colors" && (
        <div style={S.panel}>
          <div style={S.panelHead}>
            <strong style={S.brand}>Paleta — motyw {theme === "dark" ? "ciemny" : "jasny"}</strong>
          </div>
          <p style={S.hint}>
            Zapis idzie do <code>globals.css</code>. Warianty <code>-rgb</code> przeliczają się same.
          </p>
          {!tokens && <p style={S.hint}>Wczytywanie…</p>}
          {tokens &&
            Object.entries(tokens)
              .filter(([name]) => !name.endsWith("-rgb"))
              .map(([name, value]) => (
                <Swatch key={name} name={name} value={value} onChange={saveColor} />
              ))}
        </div>
      )}

      {note && (
        <div style={{ ...S.toast, background: note.kind === "ok" ? "#14532d" : "#7f1d1d" }}>
          {note.text}
        </div>
      )}
    </div>,
    document.body
  );
}

/* ── Swatch ───────────────────────────────────────────────────────────── */

function Swatch({
  name,
  value,
  onChange,
}: {
  name: string;
  value: string;
  onChange: (token: string, value: string) => void;
}) {
  const hex = toHexInput(value);
  return (
    <label style={S.swatchRow}>
      <span style={S.swatchName}>--{name}</span>
      {hex ? (
        <input
          type="color"
          value={hex}
          onChange={(e) => onChange(name, toStoredShape(e.target.value, value))}
          style={S.colorInput}
          aria-label={name}
        />
      ) : (
        <span style={{ ...S.chip, background: value }} aria-hidden />
      )}
      <input
        type="text"
        defaultValue={value}
        key={value}
        onBlur={(e) => {
          if (e.target.value.trim() !== value) onChange(name, e.target.value.trim());
        }}
        style={S.textInput}
        spellCheck={false}
      />
    </label>
  );
}

/* ── Styles ───────────────────────────────────────────────────────────── */

// Inline because the overlay must survive whatever the palette is being edited
// into, and because a dev-only tool has no business adding classes to the
// shipped stylesheet. The z-index sits above the site's own top layer (200).
const Z = 10_000;

const S = {
  root: { position: "fixed", inset: 0, zIndex: Z, pointerEvents: "none", colorScheme: "dark" },
  highlight: {
    position: "fixed",
    border: "2px solid #38bdf8",
    borderRadius: 4,
    background: "rgba(56, 189, 248, 0.12)",
    pointerEvents: "none",
  },
  // Everything docks to the right edge. The other two corners are taken: Next's
  // own dev-tools badge owns bottom-left from a shadow root that can't be nudged,
  // and the site's nav pill is centred, so a top-left bar covers it. Keeping the
  // whole tool on one edge also means the page under it stays clickable.
  launcher: {
    position: "fixed",
    right: 12,
    top: 12,
    pointerEvents: "auto",
    background: "#0f172a",
    color: "#e2e8f0",
    border: "1px solid #334155",
    borderRadius: 999,
    padding: "8px 14px",
    font: "500 12px/1 ui-sans-serif, system-ui, sans-serif",
    cursor: "pointer",
  },
  bar: {
    position: "fixed",
    right: 12,
    top: 12,
    display: "flex",
    alignItems: "center",
    gap: 6,
    pointerEvents: "auto",
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: 10,
    padding: 6,
    font: "500 12px/1 ui-sans-serif, system-ui, sans-serif",
    color: "#e2e8f0",
    boxShadow: "0 8px 24px rgba(0,0,0,.45)",
  },
  brand: { padding: "0 8px", color: "#94a3b8", fontSize: 11, letterSpacing: ".02em" },
  sep: { width: 1, height: 18, background: "#334155" },
  tab: (on: boolean) =>
    ({
      background: on ? "#38bdf8" : "transparent",
      color: on ? "#0b1220" : "#cbd5e1",
      border: "1px solid " + (on ? "#38bdf8" : "#334155"),
      borderRadius: 6,
      padding: "5px 10px",
      cursor: "pointer",
      font: "600 11px/1 ui-sans-serif, system-ui, sans-serif",
    }) as React.CSSProperties,
  select: {
    background: "#1e293b",
    color: "#e2e8f0",
    border: "1px solid #334155",
    borderRadius: 6,
    padding: "4px 6px",
    font: "500 11px/1.4 ui-sans-serif, system-ui, sans-serif",
  },
  close: {
    background: "transparent",
    color: "#94a3b8",
    border: "1px solid #334155",
    borderRadius: 6,
    padding: "5px 10px",
    cursor: "pointer",
    font: "600 11px/1 ui-sans-serif, system-ui, sans-serif",
  },
  panel: {
    position: "fixed",
    right: 12,
    // Clears the toolbar, which is docked to the same edge.
    top: 62,
    bottom: 12,
    width: 340,
    overflowY: "auto",
    pointerEvents: "auto",
    background: "#0f172a",
    border: "1px solid #334155",
    borderRadius: 12,
    padding: 14,
    color: "#e2e8f0",
    font: "400 12px/1.5 ui-sans-serif, system-ui, sans-serif",
    boxShadow: "0 12px 40px rgba(0,0,0,.5)",
  },
  panelHead: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 },
  key: { fontSize: 11, color: "#38bdf8", wordBreak: "break-all", fontFamily: "ui-monospace, monospace" },
  langRow: { display: "flex", gap: 6, margin: "12px 0 8px" },
  textarea: {
    width: "100%",
    background: "#020617",
    color: "#e2e8f0",
    border: "1px solid #334155",
    borderRadius: 8,
    padding: 10,
    font: "400 12px/1.6 ui-sans-serif, system-ui, sans-serif",
    resize: "vertical",
  },
  primary: {
    width: "100%",
    marginTop: 10,
    background: "#38bdf8",
    color: "#0b1220",
    border: "none",
    borderRadius: 8,
    padding: "9px 12px",
    cursor: "pointer",
    font: "700 12px/1 ui-sans-serif, system-ui, sans-serif",
  },
  danger: {
    width: "100%",
    marginTop: 6,
    background: "transparent",
    color: "#fca5a5",
    border: "1px solid #7f1d1d",
    borderRadius: 8,
    padding: "8px 12px",
    cursor: "pointer",
    textAlign: "left",
    font: "600 11px/1.3 ui-sans-serif, system-ui, sans-serif",
  },
  group: { marginTop: 16, paddingTop: 12, borderTop: "1px solid #1e293b" },
  groupTitle: {
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: ".12em",
    color: "#64748b",
    marginBottom: 8,
  },
  hint: { color: "#64748b", fontSize: 11, margin: "8px 0 12px" },
  swatchRow: { display: "flex", alignItems: "center", gap: 8, marginBottom: 6 },
  swatchName: {
    flex: "0 0 118px",
    fontSize: 10,
    color: "#94a3b8",
    fontFamily: "ui-monospace, monospace",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  colorInput: {
    width: 30,
    height: 24,
    padding: 0,
    border: "1px solid #334155",
    borderRadius: 4,
    background: "transparent",
    cursor: "pointer",
  },
  chip: { width: 30, height: 24, borderRadius: 4, border: "1px solid #334155" },
  textInput: {
    flex: 1,
    minWidth: 0,
    background: "#020617",
    color: "#cbd5e1",
    border: "1px solid #334155",
    borderRadius: 4,
    padding: "4px 6px",
    font: "400 10px/1.4 ui-monospace, monospace",
  },
  toast: {
    position: "fixed",
    left: 12,
    bottom: 64,
    maxWidth: 420,
    pointerEvents: "auto",
    color: "#f8fafc",
    borderRadius: 8,
    padding: "8px 12px",
    font: "500 11px/1.4 ui-sans-serif, system-ui, sans-serif",
  },
} satisfies Record<string, React.CSSProperties | ((on: boolean) => React.CSSProperties)>;
