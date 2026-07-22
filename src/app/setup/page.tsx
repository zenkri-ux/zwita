"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/lib/store/gameStore";
import { useHydratedGame } from "@/components/useHydratedGame";
import { useDict } from "@/lib/i18n/useDict";
import { Screen } from "@/components/Screen";
import { PrimaryButton } from "@/components/PrimaryButton";
import { AvatarMark, AVATAR_IDS, type AvatarId } from "@/components/AvatarMark";
import type { Locale } from "@/content/types";

const LOCALES: Locale[] = ["ar", "fr", "en"];

export default function SetupPage() {
  const router = useRouter();
  const dict = useDict();
  const { hydrated, state, phase } = useHydratedGame();
  const setProfile = useGameStore((s) => s.setProfile);

  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState<AvatarId>("leaf");
  const [locale, setLocale] = useState<Locale>("ar");

  // Prefill from any existing session (e.g. returning to edit before starting).
  useEffect(() => {
    if (!state) return;
    if (state.nickname) setNickname(state.nickname);
    if (AVATAR_IDS.includes(state.avatar as AvatarId)) {
      setAvatar(state.avatar as AvatarId);
    }
    setLocale(state.locale);
  }, [state]);

  // Guard: only valid while a session exists and the route is not yet assigned.
  useEffect(() => {
    if (!hydrated) return;
    if (phase === "welcome") router.replace("/");
    else if (phase === "mission") router.replace("/mission");
    else if (phase === "complete") router.replace("/complete");
  }, [hydrated, phase, router]);

  function handleContinue() {
    if (!nickname.trim()) return;
    setProfile(nickname, avatar, locale);
    router.push("/rules");
  }

  const fieldLabel = "mb-2 block text-[13px] font-bold text-zwita-ink/70";
  const canContinue = nickname.trim().length > 0;

  return (
    <Screen
      footer={
        <PrimaryButton
          onClick={handleContinue}
          disabled={!canContinue}
          data-testid="setup-continue"
        >
          {dict.setup.continue}
        </PrimaryButton>
      }
    >
      <h1 className="text-[22px] font-black text-zwita-olive-dark">
        {dict.setup.title}
      </h1>

      <div className="mt-6">
        <label htmlFor="nickname" className={fieldLabel}>
          {dict.setup.nicknameLabel}
        </label>
        <input
          id="nickname"
          name="nickname"
          type="text"
          autoComplete="off"
          maxLength={40}
          placeholder={dict.setup.nicknamePlaceholder}
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          className="min-h-[52px] w-full rounded-input border-[1.5px] border-zwita-ink/10 bg-white px-4 text-base text-zwita-ink"
          data-testid="nickname"
        />
      </div>

      <div className="mt-6">
        <p className={fieldLabel}>{dict.setup.languageLabel}</p>
        <div className="flex gap-2">
          {LOCALES.map((code) => {
            const selected = code === locale;
            return (
              <button
                key={code}
                type="button"
                aria-pressed={selected}
                onClick={() => setLocale(code)}
                data-testid={`lang-${code}`}
                className={[
                  "touch-target flex-1 rounded-input border-[1.5px] px-2 py-3 text-[15px] font-bold transition-colors",
                  selected
                    ? "border-zwita-olive bg-zwita-olive/10 text-zwita-olive-deep"
                    : "border-zwita-ink/10 bg-white text-zwita-ink/70",
                ].join(" ")}
              >
                {dict.languages[code]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <p className={fieldLabel}>{dict.setup.avatarLabel}</p>
        <div className="flex flex-wrap gap-3">
          {AVATAR_IDS.map((id) => {
            const selected = id === avatar;
            return (
              <button
                key={id}
                type="button"
                aria-pressed={selected}
                aria-label={id}
                onClick={() => setAvatar(id)}
                data-testid={`avatar-${id}`}
                className={[
                  "flex h-[68px] w-[68px] flex-col items-center justify-center gap-1.5 rounded-input border-[1.5px] transition-colors",
                  selected
                    ? "border-zwita-olive bg-zwita-olive/10"
                    : "border-zwita-ink/10 bg-white",
                ].join(" ")}
              >
                <AvatarMark id={id} />
              </button>
            );
          })}
        </div>
      </div>
    </Screen>
  );
}
