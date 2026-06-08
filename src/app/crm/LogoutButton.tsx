"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    if (loading) return;
    setLoading(true);
    try {
      await fetch("/api/crm-logout", { method: "POST" });
    } catch {
      // ignore — we refresh regardless
    }
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="rounded-full border border-outline px-4 py-2 text-sm font-medium text-on-surface-variant transition hover:text-on-surface disabled:opacity-60"
    >
      {loading ? "Wylogowywanie…" : "Wyloguj"}
    </button>
  );
}
