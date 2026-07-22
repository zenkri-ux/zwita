"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGameStore } from "@/lib/store/gameStore";
import { useHydratedGame } from "@/components/useHydratedGame";
import { useDict } from "@/lib/i18n/useDict";
import { Screen } from "@/components/Screen";
import { PrimaryButton } from "@/components/PrimaryButton";
import type { Locale } from "@/content/types";

// Avatar symbols reflect the mill's world (olive, jar, door, dome, sun, key).
const AVATARS = ["🫒", "🏺", "🚪", "🕌", "☀️", "🗝️"];
const LOCALES: Locale[] = ["ar", "fr", "en"];

export default function SetupPage() {
  const router = useRouter();
  const dict = useDict();
  const { hydrated, state, phase } = useHydratedGame();
  const setProfile = useGameStore((s) => s.setProfile);

  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState(AVATARS[0] ?? "🫒");
  const [locale, setLocale] = useState<Locale>("ar");

  // Prefill from any existing session (e.g. returning to edit before starting).
  useEffect(() => {
    if (!state) return;
    if (state.nickname) setNickname(state.nickname);
    if (state.avatar) setAvatar(state.avatar);
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
      <h1 className="text-3xl font-extrabold text-zwita-blue-dark">
        {dict.setup.title}
      </h1>

      <div className="mt-6 space-y-2">
        <label htmlFor="nickname" className="block font-semibold">
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
          className="touch-target w-full rounded-2xl border border-black/15 bg-white px-4 py-3 text-lg"
          data-testid="nickname"
        />
      </div>

      <div className="mt-6">
        <p className="mb-2 font-semibold">{dict.setup.languageLabel}</p>
        <div className="grid grid-cols-3 gap-2">
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
                  "touch-target rounded-2xl border px-2 py-3 text-base font-semibold",
                  selected
                    ? "border-zwita-blue bg-zwita-blue/10 ring-2 ring-zwita-blue"
                    : "border-black/15 bg-white",
                ].join(" ")}
              >
                {dict.languages[code]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-2 font-semibold">{dict.setup.avatarLabel}</p>
        <div className="grid grid-cols-6 gap-2">
          {AVATARS.map((symbol) => {
            const selected = symbol === avatar;
            return (
              <button
                key={symbol}
                type="button"
                aria-pressed={selected}
                onClick={() => setAvatar(symbol)}
                className={[
                  "touch-target flex items-center justify-center rounded-2xl border text-2xl",
                  selected
                    ? "border-zwita-blue bg-zwita-blue/10 ring-2 ring-zwita-blue"
                    : "border-black/15 bg-white",
                ].join(" ")}
              >
                <span aria-hidden>{symbol}</span>
              </button>
            );
          })}
        </div>
      </div>
    </Screen>
  );
}
