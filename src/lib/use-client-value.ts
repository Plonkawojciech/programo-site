"use client";

import { useRef, useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

/**
 * Read a client-only value (matchMedia, localStorage, UA) without calling
 * setState inside an effect. SSR and the hydration render both see
 * `serverValue`, then React re-renders once with the computed client value —
 * same visible timing as the old "setState on mount" pattern, but without
 * cascading renders. `compute` runs once per component instance.
 */
export function useClientValue<T>(compute: () => T, serverValue: T): T {
  const cache = useRef<{ value: T } | null>(null);
  const getSnapshot = () => {
    if (cache.current === null) cache.current = { value: compute() };
    return cache.current.value;
  };
  return useSyncExternalStore(emptySubscribe, getSnapshot, () => serverValue);
}
