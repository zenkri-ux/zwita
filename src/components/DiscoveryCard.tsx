import type { Station } from "@/content/types";
import type { Locale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/locale";
import { getDict } from "@/lib/i18n/dictionaries";
import { CheckCircleIcon } from "./icons";

/**
 * Station reward after a correct scan.
 *
 * Deliberately TEXT ONLY: the visitor is standing in front of the real station
 * and its panel, so showing a photograph of what is already in front of them
 * adds nothing. The screen leads with an unmistakable success confirmation —
 * previously it was too easy to miss whether a scan had worked — then gives the
 * explanation to read, then a single "next" action that reveals the next clue.
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
  successLabel: string;
}) {
  const dict = getDict(locale);

  return (
    <div className="flex flex-1 flex-col">
      {/* Unmistakable "you got it right" banner. */}
      <div className="animate-toast-in flex flex-col items-center gap-3 rounded-media bg-zwita-olive/10 px-5 py-7 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-zwita-olive">
          <CheckCircleIcon size={38} className="text-white" />
        </span>
        <p className="text-lg font-black text-zwita-olive-deep">{successLabel}</p>
      </div>

      <h2 className="mt-6 text-[21px] font-black text-zwita-ink">
        {t(station.title, locale)}
      </h2>
      <p className="mt-2 text-[15px] leading-[1.9] text-zwita-ink/85">
        {t(station.description, locale)}
      </p>

      {station.funFact ? (
        <div className="mt-4 rounded-card bg-zwita-amber/10 px-4 py-3.5">
          <p className="text-xs font-extrabold text-zwita-amber-dark">
            {dict.discovery.funFactLabel}
          </p>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-zwita-ink/85">
            {t(station.funFact, locale)}
          </p>
        </div>
      ) : null}

      {station.safetyNote ? (
        <div className="mt-3 rounded-card bg-zwita-clay/10 px-4 py-3.5">
          <p className="text-xs font-extrabold text-zwita-clay-dark">
            {dict.discovery.safetyLabel}
          </p>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-zwita-ink/85">
            {t(station.safetyNote, locale)}
          </p>
        </div>
      ) : null}

      <button
        type="button"
        onClick={onContinue}
        data-testid="discovery-continue"
        className="mt-8 inline-flex min-h-[56px] w-full items-center justify-center rounded-btn bg-zwita-olive px-6 text-[17px] font-extrabold text-white shadow-btn transition-colors hover:bg-zwita-olive-dark"
      >
        {continueLabel}
      </button>
    </div>
  );
}
