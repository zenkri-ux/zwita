import Image from "next/image";
import type { Station } from "@/content/types";
import type { Locale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/locale";
import { getDict } from "@/lib/i18n/dictionaries";
import { PrimaryButton } from "./PrimaryButton";

/**
 * Station discovery content shown after a correct scan: a primary photograph, a
 * short attractive description, and optional fun fact / safety note. Content is
 * passed in as data (kept separate from presentation).
 */
export function DiscoveryCard({
  station,
  locale,
  onContinue,
  continueLabel,
}: {
  station: Station;
  locale: Locale;
  onContinue: () => void;
  continueLabel: string;
}) {
  const hero = station.images[0];
  const dict = getDict(locale);

  return (
    <div className="space-y-5">
      {hero ? (
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-black/10">
          <Image
            src={hero.src}
            alt={t(hero.alt, locale)}
            fill
            sizes="(max-width: 640px) 100vw, 640px"
            className="object-cover"
            priority
          />
        </div>
      ) : null}

      <div>
        <h2 className="text-2xl font-extrabold text-zwita-ink">
          {t(station.title, locale)}
        </h2>
        <p className="mt-2 leading-relaxed text-zwita-ink/85">
          {t(station.description, locale)}
        </p>
      </div>

      {station.funFact ? (
        <div className="rounded-2xl bg-zwita-olive/10 p-4 ring-1 ring-zwita-olive/30">
          <p className="text-sm font-bold text-zwita-olive">
            {dict.discovery.funFactLabel}
          </p>
          <p className="mt-1 text-zwita-ink/85">{t(station.funFact, locale)}</p>
        </div>
      ) : null}

      {station.safetyNote ? (
        <div className="rounded-2xl bg-zwita-clay/10 p-4 ring-1 ring-zwita-clay/30">
          <p className="text-sm font-bold text-zwita-clay">
            {dict.discovery.safetyLabel}
          </p>
          <p className="mt-1 text-zwita-ink/85">{t(station.safetyNote, locale)}</p>
        </div>
      ) : null}

      <PrimaryButton onClick={onContinue} data-testid="discovery-continue">
        {continueLabel}
      </PrimaryButton>
    </div>
  );
}
