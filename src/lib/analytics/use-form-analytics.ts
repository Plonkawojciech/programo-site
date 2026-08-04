"use client";

// Form funnel instrumentation.
//
// Before this, a form was a single bit of information: submitted or not. The
// interesting question — of the people who started typing, where exactly did we
// lose them — was unanswerable. This hook turns one form into a five-step
// funnel: view → start → per-field completion → error → submit.
//
// Deliberately unopinionated about markup: attach `ref` to the <form>, wire the
// three field handlers, and report validation results. No field values are ever
// recorded, only names, lengths and timings.

import { useCallback, useEffect, useRef } from "react";
import { track } from "./client";

export type FormAnalytics = {
  /** Attach to the <form> element — drives form_view and form_abandon. */
  ref: React.RefObject<HTMLFormElement | null>;
  /** Call from onFocus of every field. */
  onFieldFocus: (field: string) => void;
  /** Call from onBlur of every field, with the current value. */
  onFieldBlur: (field: string, value: string) => void;
  /** Call from onChange of every field (cheap — deduped internally). */
  onFieldInput: (field: string) => void;
  /** Report client-side validation failures, keyed by field. */
  reportErrors: (errors: Record<string, string | undefined>, kind?: "validation" | "server") => void;
  /** Call once the submit actually succeeded — stops abandonment tracking. */
  markSubmitted: () => void;
  /** Seconds since the visitor first touched this form. */
  elapsedSeconds: () => number;
};

export function useFormAnalytics(formId: string): FormAnalytics {
  const ref = useRef<HTMLFormElement | null>(null);
  const started = useRef(false);
  const submitted = useRef(false);
  const startedAt = useRef(0);
  const focusedAt = useRef<Record<string, number>>({});
  const completed = useRef<Set<string>>(new Set());
  const lastField = useRef<string>("");
  const viewed = useRef(false);
  const reportedErrors = useRef<Set<string>>(new Set());

  // --- form_view ------------------------------------------------------------
  useEffect(() => {
    const el = ref.current;
    if (!el || viewed.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !viewed.current) {
            viewed.current = true;
            track("form_view", { form_id: formId });
            observer.disconnect();
          }
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [formId]);

  // --- form_abandon ---------------------------------------------------------
  // Fires on page hide and on unmount (route change) — someone who starts a
  // form and navigates away has abandoned it just as surely as one who closes
  // the tab. Guarded by `started` so an untouched form is never counted.
  useEffect(() => {
    const report = () => {
      if (!started.current || submitted.current) return;
      started.current = false; // never report the same abandonment twice
      track("form_abandon", {
        form_id: formId,
        last_field: lastField.current,
        fields_completed: completed.current.size,
        seconds: Math.round((Date.now() - startedAt.current) / 1000),
      });
    };
    const onHide = () => {
      if (document.visibilityState === "hidden") report();
    };
    window.addEventListener("pagehide", report);
    document.addEventListener("visibilitychange", onHide);
    return () => {
      window.removeEventListener("pagehide", report);
      document.removeEventListener("visibilitychange", onHide);
      report();
    };
  }, [formId]);

  const begin = useCallback(() => {
    if (started.current) return;
    started.current = true;
    startedAt.current = Date.now();
    track("form_start", { form_id: formId });
  }, [formId]);

  const onFieldFocus = useCallback(
    (field: string) => {
      focusedAt.current[field] = Date.now();
      lastField.current = field;
    },
    [],
  );

  const onFieldInput = useCallback(
    (field: string) => {
      lastField.current = field;
      begin();
    },
    [begin],
  );

  const onFieldBlur = useCallback(
    (field: string, value: string) => {
      const trimmed = (value ?? "").trim();
      if (!trimmed) return; // left empty — that is an abandonment signal, not a completion
      if (completed.current.has(field)) return;
      completed.current.add(field);
      const focused = focusedAt.current[field];
      track("form_field_complete", {
        form_id: formId,
        field,
        chars: trimmed.length,
        seconds: focused ? Math.round((Date.now() - focused) / 1000) : undefined,
        order: completed.current.size,
      });
    },
    [formId],
  );

  const reportErrors = useCallback(
    (errors: Record<string, string | undefined>, kind: "validation" | "server" = "validation") => {
      for (const [field, message] of Object.entries(errors)) {
        if (!message) continue;
        // One report per field per form instance: re-submitting with the same
        // mistake three times is one usability problem, not three.
        const key = `${kind}:${field}`;
        if (reportedErrors.current.has(key)) continue;
        reportedErrors.current.add(key);
        track("form_error", {
          form_id: formId,
          field,
          kind,
          message: message.slice(0, 100),
          seconds: started.current ? Math.round((Date.now() - startedAt.current) / 1000) : 0,
        });
      }
    },
    [formId],
  );

  const markSubmitted = useCallback(() => {
    submitted.current = true;
  }, []);

  const elapsedSeconds = useCallback(
    () => (startedAt.current ? Math.round((Date.now() - startedAt.current) / 1000) : 0),
    [],
  );

  return {
    ref,
    onFieldFocus,
    onFieldBlur,
    onFieldInput,
    reportErrors,
    markSubmitted,
    elapsedSeconds,
  };
}
