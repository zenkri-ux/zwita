/**
 * Shows the active clue. Kept short (no long paragraphs during a mission) and
 * high-contrast for dim underground reading.
 */
export function ClueCard({ clue }: { clue: string }) {
  return (
    <section className="flex flex-1 flex-col items-center justify-center text-center">
      <div className="rounded-3xl bg-white/70 p-7 shadow-sm ring-1 ring-black/5">
        <p className="text-2xl font-bold leading-relaxed text-zwita-ink">
          {clue}
        </p>
      </div>
    </section>
  );
}
