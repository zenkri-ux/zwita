"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (res.ok) {
        router.replace("/admin");
        return;
      }
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      setError(
        data.error === "admin_not_configured"
          ? "L'espace admin n'est pas configuré (ADMIN_PASSWORD manquant)."
          : "Mot de passe incorrect.",
      );
    } catch {
      setError("Connexion impossible. Réessayez.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      dir="ltr"
      className="flex min-h-[100dvh] items-center justify-center bg-zwita-white px-5"
    >
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-card bg-white p-6 shadow-card"
      >
        <h1 className="text-xl font-black text-zwita-olive-dark">ZWITA · Admin</h1>
        <p className="mt-1 text-sm text-zwita-ink/60">
          Espace de suivi des joueurs et de l&apos;activité.
        </p>

        <label htmlFor="pw" className="mt-6 block text-sm font-bold text-zwita-ink/70">
          Mot de passe
        </label>
        <input
          id="pw"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 min-h-[48px] w-full rounded-input border-[1.5px] border-zwita-ink/10 bg-white px-4 text-base"
        />

        {error ? (
          <p role="alert" className="mt-3 text-sm font-semibold text-zwita-clay-dark">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={busy || !password}
          className="mt-5 min-h-[52px] w-full rounded-btn bg-zwita-olive font-extrabold text-white transition-colors hover:bg-zwita-olive-dark disabled:opacity-50"
        >
          {busy ? "…" : "Se connecter"}
        </button>
      </form>
    </div>
  );
}
