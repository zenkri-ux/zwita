import type { Locale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/locale";
import { getDict } from "@/lib/i18n/dictionaries";
import type { StationDisplay } from "@/lib/content/display";
import { CheckCircleIcon } from "./icons";

/**
 * Station reward after a correct scan.
 *
 * Leads with an unmistakable success banner, then — if the admin has set an
 * explanation image for this station — shows it above the text, then the
 * explanation itself, then a single "next clue" action. Content comes from the
 * resolved display (built-in defaults with any admin override applied).
 */
export function DiscoveryCard({
  display,
  locale,
  onContinue,
  continueLabel,
  successLabel,
}: {
  display: StationDisplay;
  locale: Locale;
  onContinue: () => void;
  continueLabel: string;
  successLabel: string;
}) {
  const dict = getDict(locale);

  return (
    <div className="flex flex-1 flex-col">
      <div className="animate-toast-in flex flex-col items-center gap-3 rounded-media bg-zwita-olive/10 px-5 py-7 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-zwita-olive">
          <CheckCircleIcon size={38} className="text-white" />
        </span>
        <p className="text-lg font-black text-zwita-olive-deep">{successLabel}</p>
      </div>

      {display.explainImage ? (
        <div className="mt-5 overflow-hidden rounded-media bg-zwita-ink/5">
          {/* May be an uploaded /api/media image, so a plain <img>. */}
          <img
            src={display.explainImage}
            alt=""
            className="max-h-72 w-full object-cover"
          />
        </div>
      ) : null}

      <h2 className="mt-6 text-[21px] font-black text-zwita-ink">
        {t(display.title, locale)}
      </h2>
      <p className="mt-2 whitespace-pre-line text-[15px] leading-[1.9] text-zwita-ink/85">
        {t(display.description, locale)}
      </p>

      {display.funFact ? (
        <div className="mt-4 rounded-card bg-zwita-amber/10 px-4 py-3.5">
          <p className="text-xs font-extrabold text-zwita-amber-dark">
            {dict.discovery.funFactLabel}
          </p>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-zwita-ink/85">
            {t(display.funFact, locale)}
          </p>
        </div>
      ) : null}

      {display.safetyNote ? (
        <div className="mt-3 rounded-card bg-zwita-clay/10 px-4 py-3.5">
          <p className="text-xs font-extrabold text-zwita-clay-dark">
            {dict.discovery.safetyLabel}
          </p>
          <p className="mt-1.5 text-[13.5px] leading-relaxed text-zwita-ink/85">
            {t(display.safetyNote, locale)}
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
