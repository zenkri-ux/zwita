"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AvatarMark } from "@/components/AvatarMark";
import { AdminHeader } from "@/components/AdminHeader";
import { getStation } from "@/content/stations";

type Summary = {
  players: number;
  started: number;
  completed: number;
  scans: number;
  correctScans: number;
};
type Player = {
  player_id: string;
  nickname: string | null;
  avatar: string | null;
  locale: string | null;
  score: number;
  discovered: number;
  total: number | null;
  completed: number;
  last_seen: string | null;
};
type Activity = {
  id: number;
  ts: string;
  nickname: string | null;
  type: string;
  station_id: string | null;
  outcome: string | null;
  score: number | null;
};
type Data = {
  summary: Summary;
  players: Player[];
  activity: Activity[];
  player: string | null;
};

function stationLabel(id: string | null): string {
  if (!id) return "";
  return getStation(id)?.title.ar ?? id;
}

function activityLabel(a: Activity): string {
  switch (a.type) {
    case "session_started":
      return "A ouvert le jeu";
    case "profile_set":
      return "A choisi son profil";
    case "route_started":
      return "A commencé le parcours";
    case "completed":
      return `A terminé le parcours 🎉 (${a.score ?? 0} pts)`;
    case "reset":
      return "A réinitialisé sa partie";
    case "scan":
      switch (a.outcome) {
        case "correct":
          return `A trouvé « ${stationLabel(a.station_id)} »`;
        case "wrong-station":
          return "Mauvaise plaque";
        case "already-completed":
          return "Plaque déjà visitée";
        case "unknown-station":
          return "Code inconnu";
        default:
          return "Scan illisible";
      }
    default:
      return a.type;
  }
}

function timeLabel(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = useState<Data | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [error, setError] = useState(false);

  const load = useCallback(async (player: string | null) => {
    try {
      const url = player ? `/api/admin/data?player=${encodeURIComponent(player)}` : "/api/admin/data";
      const res = await fetch(url, { cache: "no-store" });
      if (res.status === 401) {
        router.replace("/admin/login");
        return;
      }
      if (!res.ok) {
        setError(true);
        return;
      }
      setData((await res.json()) as Data);
      setError(false);
    } catch {
      setError(true);
    }
  }, [router]);

  useEffect(() => {
    void load(selected);
    const t = setInterval(() => void load(selected), 20_000);
    return () => clearInterval(t);
  }, [load, selected]);

  const s = data?.summary;
  const tiles: { label: string; value: number }[] = s
    ? [
        { label: "Joueurs", value: s.players },
        { label: "Parties démarrées", value: s.started },
        { label: "Terminées", value: s.completed },
        { label: "Scans", value: s.scans },
        { label: "Bons scans", value: s.correctScans },
      ]
    : [];

  return (
    <div dir="ltr" className="min-h-[100dvh] bg-zwita-white text-zwita-ink">
      <AdminHeader />

      <main className="mx-auto max-w-4xl px-5 py-6">
        {error ? (
          <p className="mb-4 rounded-card bg-zwita-clay/10 px-4 py-3 text-sm font-semibold text-zwita-clay-dark">
            Impossible de charger les données.
          </p>
        ) : null}

        <section className="grid grid-cols-2 gap-3 sm:grid-cols-5">
          {tiles.map((t) => (
            <div key={t.label} className="rounded-card bg-white p-4 shadow-card">
              <p className="text-2xl font-black text-zwita-olive-dark">{t.value}</p>
              <p className="mt-1 text-xs font-semibold text-zwita-ink/60">{t.label}</p>
            </div>
          ))}
        </section>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {/* Players */}
          <section>
            <h2 className="mb-3 text-sm font-black uppercase tracking-wide text-zwita-ink/50">
              Joueurs
            </h2>
            <div className="overflow-hidden rounded-card bg-white shadow-card">
              {data?.players.length ? (
                <ul className="divide-y divide-black/5">
                  {data.players.map((p) => {
                    const active = selected === p.player_id;
                    return (
                      <li key={p.player_id}>
                        <button
                          type="button"
                          onClick={() => setSelected(active ? null : p.player_id)}
                          className={`flex w-full items-center gap-3 px-4 py-3 text-left ${
                            active ? "bg-zwita-olive/5" : ""
                          }`}
                        >
                          <span className="flex h-9 w-9 flex-none items-center justify-center rounded-full bg-zwita-olive/10">
                            <AvatarMark id={p.avatar ?? "leaf"} scale={0.7} />
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block truncate font-bold">
                              {p.nickname || "— sans nom —"}
                            </span>
                            <span className="block text-xs text-zwita-ink/50">
                              {p.discovered}/{p.total ?? "?"} stations ·{" "}
                              {p.completed ? "terminé" : "en cours"}
                              {p.last_seen ? ` · ${timeLabel(p.last_seen)}` : ""}
                            </span>
                          </span>
                          <span className="flex-none font-black text-zwita-olive">
                            {p.score}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="px-4 py-6 text-sm text-zwita-ink/50">
                  Aucun joueur pour le moment.
                </p>
              )}
            </div>
          </section>

          {/* Activity */}
          <section>
            <h2 className="mb-3 flex items-center justify-between text-sm font-black uppercase tracking-wide text-zwita-ink/50">
              <span>{selected ? "Historique du joueur" : "Activité récente"}</span>
              {selected ? (
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="text-xs font-semibold normal-case text-zwita-olive-dark underline"
                >
                  Voir tout
                </button>
              ) : null}
            </h2>
            <div className="overflow-hidden rounded-card bg-white shadow-card">
              {data?.activity.length ? (
                <ul className="divide-y divide-black/5">
                  {data.activity.map((a) => (
                    <li key={a.id} className="flex items-baseline gap-3 px-4 py-2.5">
                      <span className="flex-none text-[11px] tabular-nums text-zwita-ink/40">
                        {timeLabel(a.ts)}
                      </span>
                      <span className="min-w-0 flex-1 text-sm">
                        {selected ? null : (
                          <span className="font-bold">{a.nickname || "—"} </span>
                        )}
                        <span className="text-zwita-ink/75">{activityLabel(a)}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-4 py-6 text-sm text-zwita-ink/50">Aucune activité.</p>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
