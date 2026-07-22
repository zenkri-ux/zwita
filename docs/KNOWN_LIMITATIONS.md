# ZWITA — Known Limitations

The app delivers the walk-and-scan experience end to end:
welcome (ZWITA + Mill hero) → setup (name + language + avatar) → game-rules
screen → deterministic 3-station route → clue → scan → validate → discovery →
complete, with local persistence, a Serwist PWA layer, and unit + e2e tests.
The items below are deliberately deferred or constrained.

## Localization

- **UI chrome is fully translated in Arabic, French and English** and selectable
  on the setup screen; the document direction flips (RTL for Arabic, LTR for
  fr/en) via `LocaleSync`.
- **Station/heritage content is not translated.** In French/English the UI is
  localized but clues, titles and descriptions fall back to the Arabic
  placeholder text (`t()` falls back to `ar`), pending validated translations.

## Content

- **All Arabic station text is placeholder**, visibly prefixed with «[نموذج]»
  ("[sample]"). No validated heritage copy, fun facts, safety notes, or image
  `alt` text ships yet. Real copy replaces placeholders only with explicit
  approval (`AGENTS.md`: do not invent historical facts).
- **QR tokens are development values** (`dev-*`). Real printed tokens must
  replace `qrToken` in `src/content/stations.ts` before launch.

## Routes

- One approved route template (`demo-a`: olive-storage → crusher-mdar →
  settling-jars). Additional templates and full nine-station routes are pending
  safety-validated transitions.

## PWA / assets

- **App icon is a placeholder SVG.** PNG icons (incl. 180×180 apple-touch and
  maskable variants) are not yet generated, so iOS "Add to Home Screen" will use
  a fallback rendering.
- The **Serwist service worker is disabled in development** and only active in a
  production build. Precache coverage of image thumbnails and the offline
  fallback should be validated on-device.
- The **Arabic font (Cairo) is fetched at build time** via `next/font`. It is
  self-hosted at runtime (no external request), but the build machine needs
  network access; swap for a local `.woff2` subset to build fully offline.

## Camera / device

- `getUserMedia` requires a **secure context** and works only in Safari proper
  on iOS — it is blocked in in-app webviews (Instagram/Facebook). The UI detects
  failures and always offers manual code entry, but automatic camera scanning
  will not work in those webviews.
- **No torch/flashlight control** (unsupported on iOS Safari, inconsistent on
  Android). Low-light guidance relies on manual entry and device brightness.
- The ZXing decode path has been type-checked and wired but **not yet validated
  on real Android/iOS hardware**; only the simulated adapter is exercised by
  automated tests.

## Animation

- **Framer Motion is installed but not yet used**; purposeful success/transition
  animations are deferred. All motion currently respects
  `prefers-reduced-motion`.

## Testing

- Unit tests cover route assignment, QR parsing, scan validation, scoring, state
  migration, and completion rules.
- Playwright covers start, full-route completion, wrong-scan feedback, and
  interrupted-game restore **using the simulated scanner**.
- **Not yet automated:** real-camera scanning, full offline restoration, and the
  Arabic-RTL ↔ French-LTR switch (fr UI not built). E2E currently runs only on a
  mobile-Chrome project; iOS Safari is manual.

## Backend

- No backend by design. `PersistenceAdapter` and the scanner/route interfaces
  are the seams where a session/analytics API can be added later without
  touching UI code.

## Verification results

Node is not installed on the development host; the toolchain was run inside a
`node:20` Docker container against the live source tree.

- **Typecheck** (`tsc --noEmit`, strict + `noUncheckedIndexedAccess`): **pass**.
- **Lint** (`next lint`): **pass** — no ESLint warnings or errors.
- **Unit tests** (`vitest run`): **pass** — 38 tests across 6 files
  (route, payload, validate, score, migrate, completion).
- **Production build** (`next build`): **pass** — 9 routes generated, Serwist
  service worker bundled to `/sw.js`.
- **E2E** (`playwright test`, mobile-chrome, simulated scanner): **pass** — 5/5
  (start, full 3-station completion, wrong-vs-correct panel detection,
  interrupted-game restore, and French/LTR language switch) against a production
  `next start` server.

The e2e run also caught and fixed two real defects: a `hydrate()`/`initSession()`
race that could clobber a fresh session, and a `derivePhase` bug that treated a
just-created (nickname-less) session as "welcome" and bounced the player off the
setup screen.

### Advisories

- `next@14.2.5` emits a published security advisory on install
  (2025-12-11). Bump to the latest patched 14.2.x before launch; no code change
  is expected.
- `next start` prints an advisory that it does not use the `output: standalone`
  optimisation. Production is served by the standalone server in the Docker
  image (`node server.js`); `next start` is only used for e2e convenience.
- `sharp` is included as a dependency so `next/image` optimisation works in the
  standalone Docker image (Next logs a `sharp-missing` error otherwise).
