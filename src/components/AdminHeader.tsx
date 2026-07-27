"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// Shared admin top bar: title, section tabs, logout.

export function AdminHeader() {
  const pathname = usePathname();
  const router = useRouter();

  const tab = (href: string, label: string) => {
    const active = pathname === href;
    return (
      <Link
        href={href}
        className={`rounded-input px-3 py-2 text-sm font-bold ${
          active ? "bg-zwita-olive/15 text-zwita-olive-deep" : "text-zwita-ink/60"
        }`}
      >
        {label}
      </Link>
    );
  };

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.replace("/admin/login");
  }

  return (
    <header className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-black/5 bg-white px-5 py-3">
      <h1 className="text-lg font-black text-zwita-olive-dark">ZWITA · Admin</h1>
      <nav className="flex items-center gap-1">
        {tab("/admin", "Statistiques")}
        {tab("/admin/content", "Contenu du jeu")}
      </nav>
      <button
        type="button"
        onClick={logout}
        className="ms-auto text-sm font-semibold text-zwita-ink/60 underline"
      >
        Se déconnecter
      </button>
    </header>
  );
}
