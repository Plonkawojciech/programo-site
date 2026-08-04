// Visitor + session identity for first-party analytics.
//
// RODO stance: a persistent visitor id is an analytics identifier, so it is only
// written to storage once ANALYTICS consent is granted. Without consent we still
// produce ids, but they live in memory for the lifetime of the page only and are
// never persisted or sent anywhere (the first-party sink drops uncon­sented
// events, see analytics/client.ts). Google's own tags keep working in cookieless
// Consent Mode v2 modelling, which is handled separately in layout.tsx.

const VISITOR_KEY = "programo-visitor-v1";
const SESSION_KEY = "programo-session-v1";

/** GA4 uses 30 minutes of inactivity as a session boundary; match it so our
 *  first-party sessions line up with GA4 sessions when we compare reports. */
const SESSION_TIMEOUT_MS = 30 * 60 * 1000;

export type SessionInfo = {
  /** Session id, regenerated after 30 min of inactivity. */
  id: string;
  /** Epoch ms of session start. */
  start: number;
  /** Epoch ms of last activity. */
  last: number;
  /** 1-based index of this session for this visitor. */
  number: number;
  /** Page views within this session. */
  views: number;
};

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  // Pre-2021 Safari fallback. Not cryptographically important — this is a
  // bucketing id, not a secret.
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// In-memory fallbacks, used when consent is absent or storage is unavailable
// (Safari private mode throws on setItem).
let memVisitor: string | null = null;
let memSession: SessionInfo | null = null;

function canPersist(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = window.localStorage.getItem("programo-consent-v1");
    if (!raw) return false;
    const c = JSON.parse(raw) as { analytics?: boolean };
    return !!c?.analytics;
  } catch {
    return false;
  }
}

/** Stable per-browser visitor id. Persisted only with analytics consent. */
export function getVisitorId(): string {
  if (typeof window === "undefined") return "";
  if (!canPersist()) {
    memVisitor ??= uuid();
    return memVisitor;
  }
  try {
    const existing = window.localStorage.getItem(VISITOR_KEY);
    if (existing) return existing;
    const fresh = memVisitor ?? uuid();
    window.localStorage.setItem(VISITOR_KEY, fresh);
    return fresh;
  } catch {
    memVisitor ??= uuid();
    return memVisitor;
  }
}

function readSession(): SessionInfo | null {
  if (!canPersist()) return memSession;
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SessionInfo>;
    if (!parsed.id || typeof parsed.start !== "number") return null;
    return {
      id: parsed.id,
      start: parsed.start,
      last: typeof parsed.last === "number" ? parsed.last : parsed.start,
      number: typeof parsed.number === "number" ? parsed.number : 1,
      views: typeof parsed.views === "number" ? parsed.views : 0,
    };
  } catch {
    return memSession;
  }
}

function writeSession(s: SessionInfo): void {
  memSession = s;
  if (!canPersist()) return;
  try {
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
  } catch {
    /* private mode / quota — memSession still holds it for this page */
  }
}

/** Count of sessions this visitor has had, persisted across sessions. */
function bumpSessionCounter(): number {
  if (!canPersist()) return (memSession?.number ?? 0) + 1;
  try {
    const raw = window.localStorage.getItem(`${VISITOR_KEY}-sessions`);
    const next = (raw ? parseInt(raw, 10) || 0 : 0) + 1;
    window.localStorage.setItem(`${VISITOR_KEY}-sessions`, String(next));
    return next;
  } catch {
    return 1;
  }
}

/**
 * Current session, starting a new one after 30 min of inactivity.
 * Call on every tracked interaction — it also refreshes the activity timestamp.
 */
export function getSession(): SessionInfo {
  if (typeof window === "undefined") {
    return { id: "", start: 0, last: 0, number: 0, views: 0 };
  }
  const now = Date.now();
  const prev = readSession();

  if (prev && now - prev.last < SESSION_TIMEOUT_MS) {
    const next = { ...prev, last: now };
    writeSession(next);
    return next;
  }

  const fresh: SessionInfo = {
    id: uuid(),
    start: now,
    last: now,
    number: bumpSessionCounter(),
    views: 0,
  };
  writeSession(fresh);
  return fresh;
}

/** Increments the page-view counter on the current session and returns it. */
export function bumpSessionViews(): SessionInfo {
  const s = getSession();
  const next = { ...s, views: s.views + 1 };
  writeSession(next);
  return next;
}

/** True when this is the visitor's first session (drives "new vs returning"). */
export function isReturningVisitor(): boolean {
  return getSession().number > 1;
}

/**
 * Promotes in-memory identity into storage. Called the moment analytics consent
 * is granted, so the session the visitor is already in does not get split in two.
 */
export function persistPendingIdentity(): void {
  if (typeof window === "undefined" || !canPersist()) return;
  try {
    if (memVisitor && !window.localStorage.getItem(VISITOR_KEY)) {
      window.localStorage.setItem(VISITOR_KEY, memVisitor);
    }
    if (memSession && !window.sessionStorage.getItem(SESSION_KEY)) {
      window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(memSession));
    }
  } catch {
    /* ignore */
  }
}
