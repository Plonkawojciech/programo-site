"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/crm-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.ok) {
        router.refresh();
      } else {
        setError(data?.error || "Nieprawidłowy e-mail lub hasło.");
        setLoading(false);
      }
    } catch {
      setError("Błąd połączenia. Spróbuj ponownie.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-6 py-24 text-on-surface">
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="w-full max-w-sm"
      >
        {/* Cover header */}
        <div className="mb-12 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.55em] text-primary">
            Programo
          </p>
          <h1 className="mt-6 font-headline text-5xl font-medium tracking-tight text-on-surface">
            Panel CRM
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-on-surface-variant">
            Logowanie tylko dla założycieli.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="crm-email"
              className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant"
            >
              E-mail
            </label>
            <input
              id="crm-email"
              type="email"
              name="email"
              autoComplete="username"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="biuro@programo.pl"
              className="w-full border-b border-outline-variant bg-transparent py-2.5 text-base text-on-surface placeholder:text-on-surface-variant/40 outline-none transition-colors focus:border-primary"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="crm-password"
              className="text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface-variant"
            >
              Hasło
            </label>
            <div className="relative">
              <input
                id="crm-password"
                type={showPassword ? "text" : "password"}
                name="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border-b border-outline-variant bg-transparent py-2.5 pr-12 text-base text-on-surface placeholder:text-on-surface-variant/40 outline-none transition-colors focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Ukryj hasło" : "Pokaż hasło"}
                className="absolute right-0 top-1/2 -translate-y-1/2 cursor-pointer p-1.5 text-on-surface-variant transition-colors hover:text-on-surface"
              >
                {showPassword ? (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              role="alert"
              className="rounded-2xl border border-outline-variant bg-surface-container-low px-4 py-3 text-sm leading-relaxed text-on-surface"
            >
              {error}
            </motion.p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-2 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-medium uppercase tracking-widest text-on-primary transition-all hover:bg-primary-container disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-on-primary/40 border-t-on-primary" />
                Logowanie…
              </>
            ) : (
              "Zaloguj się"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
