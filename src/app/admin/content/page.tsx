"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { AdminHeader } from "@/components/AdminHeader";
import type { Locale, LocalizedText } from "@/content/types";

type EditorStation = {
  id: string;
  titleAr: string;
  effective: {
    clue: LocalizedText;
    description: LocalizedText;
    coverImage: string;
    explainImage?: string;
  };
  defaultCoverImage: string;
  override: { coverImage: string | null; explainImage: string | null } | null;
};

type Draft = {
  clue: { ar: string; fr: string; en: string };
  description: { ar: string; fr: string; en: string };
  coverFile: string | null;
  coverPreview: string;
  explainFile: string | null;
  explainPreview: string | null;
};

const LOCALES: { code: Locale; label: string }[] = [
  { code: "ar", label: "العربية" },
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
];

function toDraft(s: EditorStation): Draft {
  const txt = (l: LocalizedText) => ({ ar: l.ar ?? "", fr: l.fr ?? "", en: l.en ?? "" });
  return {
    clue: txt(s.effective.clue),
    description: txt(s.effective.description),
    coverFile: s.override?.coverImage ?? null,
    coverPreview: s.effective.coverImage,
    explainFile: s.override?.explainImage ?? null,
    explainPreview: s.effective.explainImage ?? null,
  };
}

export default function AdminContentPage() {
  const router = useRouter();
  const [items, setItems] = useState<EditorStation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [lang, setLang] = useState<Locale>("ar");
  const [status, setStatus] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/content", { cache: "no-store" });
    if (res.status === 401) {
      router.replace("/admin/login");
      return;
    }
    const data = (await res.json()) as { stations: EditorStation[] };
    setItems(data.stations);
    setSelectedId((cur) => cur ?? data.stations[0]?.id ?? null);
  }, [router]);

  useEffect(() => {
    void load();
  }, [load]);

  const selected = items.find((s) => s.id === selectedId) ?? null;

  // Reset the draft whenever the selected station changes.
  useEffect(() => {
    setDraft(selected ? toDraft(selected) : null);
    setStatus(null);
  }, [selected]);

  if (!draft || !selected) {
    return (
      <div dir="ltr" className="min-h-[100dvh] bg-zwita-white">
        <AdminHeader />
      </div>
    );
  }

  return (
    <div dir="ltr" className="min-h-[100dvh] bg-zwita-white text-zwita-ink">
      <AdminHeader />
      <div className="mx-auto grid max-w-5xl gap-6 px-5 py-6 lg:grid-cols-[220px_1fr]">
        {/* Station list */}
        <aside className="h-max overflow-hidden rounded-card bg-white shadow-card">
          <ul className="divide-y divide-black/5">
            {items.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  onClick={() => setSelectedId(s.id)}
                  className={`flex w-full items-center justify-between px-4 py-3 text-left ${
                    s.id === selectedId ? "bg-zwita-olive/5" : ""
                  }`}
                >
                  <span className="font-bold" dir="rtl">
                    {s.titleAr}
                  </span>
                  {s.override ? (
                    <span className="rounded-full bg-zwita-amber/20 px-2 py-0.5 text-[10px] font-bold text-zwita-amber-dark">
                      modifié
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Editor */}
        <section className="rounded-card bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-black text-zwita-olive-dark" dir="rtl">
              {selected.titleAr}
            </h2>
            <span className="font-mono text-xs text-zwita-ink/40">{selected.id}</span>
          </div>

          {/* Language tabs */}
          <div className="mb-4 flex gap-1">
            {LOCALES.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLang(l.code)}
                className={`rounded-input px-3 py-1.5 text-sm font-bold ${
                  lang === l.code
                    ? "bg-zwita-olive/15 text-zwita-olive-deep"
                    : "text-zwita-ink/50"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <Field label={`Indice (${lang})`}>
            <textarea
              dir={lang === "ar" ? "rtl" : "ltr"}
              rows={2}
              value={draft.clue[lang] ?? ""}
              onChange={(e) =>
                setDraft({ ...draft, clue: { ...draft.clue, [lang]: e.target.value } })
              }
              className="w-full rounded-input border-[1.5px] border-zwita-ink/10 p-3 text-[15px]"
            />
          </Field>

          <Field label={`Explication (${lang})`}>
            <textarea
              dir={lang === "ar" ? "rtl" : "ltr"}
              rows={5}
              value={draft.description[lang] ?? ""}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  description: { ...draft.description, [lang]: e.target.value },
                })
              }
              className="w-full rounded-input border-[1.5px] border-zwita-ink/10 p-3 text-[15px]"
            />
          </Field>

          <ImageField
            label="Photo de couverture (fond de l'indice)"
            preview={draft.coverPreview}
            onUploaded={(file) =>
              setDraft({ ...draft, coverFile: file, coverPreview: `/api/media/${file}` })
            }
            onReset={() =>
              setDraft({
                ...draft,
                coverFile: null,
                coverPreview: selected.defaultCoverImage,
              })
            }
            resetLabel="Image par défaut"
          />

          <ImageField
            label="Photo de l'explication (écran de découverte)"
            preview={draft.explainPreview}
            onUploaded={(file) =>
              setDraft({
                ...draft,
                explainFile: file,
                explainPreview: `/api/media/${file}`,
              })
            }
            onReset={() =>
              setDraft({ ...draft, explainFile: null, explainPreview: null })
            }
            resetLabel="Aucune image"
          />

          {status ? (
            <p className="mt-4 text-sm font-semibold text-zwita-olive-deep">{status}</p>
          ) : null}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={async () => {
                setStatus("Enregistrement…");
                const res = await fetch("/api/admin/content", {
                  method: "PUT",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify({
                    stationId: selected.id,
                    clue: draft.clue,
                    description: draft.description,
                    coverImage: draft.coverFile,
                    explainImage: draft.explainFile,
                  }),
                });
                setStatus(res.ok ? "Enregistré ✓" : "Échec de l'enregistrement");
                if (res.ok) await load();
              }}
              className="min-h-[48px] rounded-btn bg-zwita-olive px-6 font-extrabold text-white hover:bg-zwita-olive-dark"
            >
              Enregistrer
            </button>
            <button
              type="button"
              onClick={async () => {
                if (!confirm("Réinitialiser cette station au contenu par défaut ?")) return;
                await fetch(`/api/admin/content?stationId=${selected.id}`, {
                  method: "DELETE",
                });
                await load();
                setDraft(null);
                setStatus("Réinitialisé");
              }}
              className="min-h-[48px] rounded-btn border-[1.5px] border-zwita-clay/40 px-5 font-bold text-zwita-clay-dark"
            >
              Réinitialiser au défaut
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="mb-4 block">
      <span className="mb-1.5 block text-[13px] font-bold text-zwita-ink/70">{label}</span>
      {children}
    </label>
  );
}

function ImageField({
  label,
  preview,
  onUploaded,
  onReset,
  resetLabel,
}: {
  label: string;
  preview: string | null;
  onUploaded: (file: string) => void;
  onReset: () => void;
  resetLabel: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function upload(file: File) {
    setBusy(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: form });
      const data = (await res.json()) as { file?: string; error?: string };
      if (data.file) onUploaded(data.file);
      else alert(`Échec de l'envoi de l'image (${data.error ?? "?"})`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mb-4">
      <p className="mb-1.5 text-[13px] font-bold text-zwita-ink/70">{label}</p>
      <div className="flex items-center gap-3">
        <div className="h-20 w-28 flex-none overflow-hidden rounded-input bg-zwita-ink/5">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center text-[11px] text-zwita-ink/40">
              aucune
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void upload(f);
              e.target.value = "";
            }}
          />
          <button
            type="button"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="rounded-input bg-zwita-olive/10 px-3 py-2 text-sm font-bold text-zwita-olive-deep disabled:opacity-50"
          >
            {busy ? "Envoi…" : "Changer l'image"}
          </button>
          <button
            type="button"
            onClick={onReset}
            className="text-xs font-semibold text-zwita-ink/50 underline"
          >
            {resetLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
