import { Screen } from "@/components/Screen";
import { ar } from "@/lib/i18n/dictionaries/ar";

// Offline fallback for document navigations when a page is not cached. The core
// loop keeps working from cache; this only covers genuinely uncached routes.
export const metadata = { title: ar.appName };

export default function OfflinePage() {
  return (
    <Screen>
      <div className="flex flex-1 flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-extrabold text-zwita-blue-dark">
          {ar.appName}
        </h1>
        <p className="mt-4 max-w-xs text-lg text-zwita-ink/80">
          {ar.offline.banner}
        </p>
      </div>
    </Screen>
  );
}
