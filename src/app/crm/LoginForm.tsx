"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
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
        setError(data?.error || "Logowanie nie powiodło się.");
        setLoading(false);
      }
    } catch {
      setError("Błąd połączenia. Spróbuj ponownie.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-6 text-on-surface">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.4em] text-primary">
            Programo
          </p>
          <h1 className="font-headline text-3xl font-bold tracking-tight">
            Panel CRM
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            Logowanie tylko dla założycieli.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-outline-variant bg-surface-container-low p-6"
        >
          <label className="mb-1 block text-sm font-medium text-on-surface-variant">
            E-mail
          </label>
          <input
            type="email"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="biuro@programo.pl"
            required
            className="mb-4 w-full rounded-lg border border-outline-variant bg-surface px-3 py-2.5 text-on-surface outline-none transition focus:border-primary"
          />

          <label className="mb-1 block text-sm font-medium text-on-surface-variant">
            Hasło
          </label>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="mb-4 w-full rounded-lg border border-outline-variant bg-surface px-3 py-2.5 text-on-surface outline-none transition focus:border-primary"
          />

          {error && (
            <p className="mb-4 rounded-lg border border-outline-variant bg-surface px-3 py-2 text-sm text-on-surface">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-primary px-6 py-3 text-sm font-semibold text-on-primary transition hover:bg-primary-container disabled:opacity-60"
          >
            {loading ? "Logowanie…" : "Zaloguj"}
          </button>
        </form>
      </div>
    </div>
  );
}
