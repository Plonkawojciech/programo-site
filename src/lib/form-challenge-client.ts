"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Browser half of lib/form-challenge.ts. On mount the form fetches a signed
 * challenge and grinds the proof of work in the background, so by the time a
 * human has typed a name and a phone number the proof is already waiting.
 *
 * `take()` at submit hands the proof over (waiting for the grind and for the
 * server's minimum age if the visitor was unusually quick) and forgets it —
 * a nonce is accepted once. Call `refresh()` after every attempt so the next
 * one is pre-solved too.
 */

export type ChallengeProof = { challenge: string; pow: number };

type Solved = ChallengeProof & { readyAt: number };

const enc = new TextEncoder();

function leadingZeroBits(bytes: Uint8Array): number {
  let bits = 0;
  for (const b of bytes) {
    if (b === 0) {
      bits += 8;
      continue;
    }
    bits += Math.clz32(b) - 24;
    break;
  }
  return bits;
}

async function solve(token: string, difficulty: number): Promise<number> {
  // Each digest is awaited, so the loop yields to the event loop and the
  // page stays responsive while it runs. ~16k iterations at 14 bits.
  for (let counter = 0; ; counter++) {
    const digest = await crypto.subtle.digest("SHA-256", enc.encode(`${token}:${counter}`));
    if (leadingZeroBits(new Uint8Array(digest)) >= difficulty) return counter;
  }
}

async function fetchAndSolve(): Promise<Solved | null> {
  try {
    const res = await fetch("/api/contact/challenge", { cache: "no-store" });
    if (!res.ok) return null;
    const fetchedAt = Date.now();
    const { token, difficulty, minAgeMs } = (await res.json()) as {
      token: string;
      difficulty: number;
      minAgeMs: number;
    };
    const pow = await solve(token, difficulty);
    // +250 ms of slack over the server minimum: the two clocks are not the
    // same clock, and the request itself took time to arrive.
    return { challenge: token, pow, readyAt: fetchedAt + minAgeMs + 250 };
  } catch {
    return null;
  }
}

export function useFormChallenge() {
  const pending = useRef<Promise<Solved | null> | null>(null);

  const refresh = useCallback(() => {
    pending.current = fetchAndSolve();
    return pending.current;
  }, []);

  useEffect(() => {
    if (!pending.current) refresh();
  }, [refresh]);

  const take = useCallback(async (): Promise<ChallengeProof | null> => {
    let solved = await (pending.current ?? refresh());
    // One retry covers a challenge fetch that failed on a flaky connection.
    if (!solved) solved = await refresh();
    pending.current = null;
    if (!solved) return null;
    const wait = solved.readyAt - Date.now();
    if (wait > 0) await new Promise((r) => setTimeout(r, wait));
    return { challenge: solved.challenge, pow: solved.pow };
  }, [refresh]);

  return { take, refresh };
}
