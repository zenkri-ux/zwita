import Image from "next/image";
import type { Station } from "@/content/types";
import type { Locale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/locale";
import { getDict } from "@/lib/i18n/dictionaries";
import { CheckCircleIcon } from "./icons";

/**
 * Station reward after a correct scan: a success banner, the station
 * photograph, a short description, and optional fun-fact / safety notes on
 * their own tinted surfaces. Content arrives as data — nothing is inlined here.
 */
export function DiscoveryCard({
  station,
  locale,
  onContinue,
  continueLabel,
  successLabel,
}: {
  station: Station;
  locale: Locale;
  onContinue: () => void;
  continueLabel: string;
  successLabel?: string;
}) {
  const hero = station.images[0];
  const dict = getDict(locale);

  return (
    <div className="space-y-4">
      {successLabel ? (
        <div className="animate-toast-in flex items-center gap-2.5 rounded-card bg-zwita-olive/10 px-4 py-3">
          <CheckCircleIcon size={20} className="text-zwita-olive" />
          <p className="text-sm font-extrabold text-zwita-olive-deep">
            {successLabel}
          </p>
        </div>
      ) : null}

      {hero ? (
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-media bg-zwita-ink/5">
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
        <h2 className="text-[21px] font-black text-zwita-ink">
          {t(station.title, locale)}
        </h2>
        <p className="mt-2 text-[14.5px] leading-[1.75] text-zwita-ink/85">
          {t(station.description, locale)}
        </p>
      </div>

      {station.funFact ? (
        <div className="rounded-card bg-zwita-olive/10 px-4 py-3.5">
          <p className="text-xs font-extrabold text-zwita-olive">
            {dict.discovery.funFactLabel}
          </p>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-zwita-ink/85">
            {t(station.funFact, locale)}
          </p>
        </div>
      ) : null}

      {station.safetyNote ? (
        <div className="rounded-card bg-zwita-clay/10 px-4 py-3.5">
          <p className="text-xs font-extrabold text-zwita-clay">
            {dict.discovery.safetyLabel}
          </p>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-zwita-ink/85">
            {t(station.safetyNote, locale)}
          </p>
        </div>
      ) : null}

      <PrimaryContinue label={continueLabel} onClick={onContinue} />
    </div>
  );
}

function PrimaryContinue({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-testid="discovery-continue"
      className="inline-flex min-h-[56px] w-full items-center justify-center rounded-btn bg-zwita-olive px-6 text-[17px] font-extrabold text-white shadow-btn transition-colors hover:bg-zwita-olive-dark"
    >
      {label}
    </button>
  );
}
