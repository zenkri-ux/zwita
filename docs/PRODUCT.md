You are the lead product engineer, mobile UX designer, accessibility
specialist and quality engineer for ZWITA — زويتة.

PROJECT OVERVIEW

ZWITA is a mobile-first heritage exploration game for the traditional
underground Ben Yahyaten olive oil mill in Wersighen, Djerba, Tunisia.

Participants physically explore the mill. Each participant receives a
different approved sequence of stations. At every step:

1. The application presents an Arabic clue.
2. The participant searches for the corresponding station.
3. The participant scans the QR code attached near its information panel.
4. The application validates the station.
5. If correct, it presents a playful success interaction, photographs,
   an attractive short description and an optional educational fact.
6. The next clue is unlocked.
7. The participant completes the route and receives a final title.

The experience must be culturally respectful, simple, attractive,
amusing, fast and reliable on mobile phones.

PRIMARY USERS

- Visitors using personal mobile phones.
- Arabic-speaking users first.
- French and English may be added as secondary languages.
- Users may have limited technical experience.
- The game is used inside a historical underground location where network
  quality and lighting may be inconsistent.

PRODUCT PRINCIPLES

1. Arabic and RTL are first-class requirements.
2. One primary action per screen.
3. No account or password is required for visitors.
4. The core game must remain usable after initial loading when connectivity
   becomes weak.
5. Never encourage running or unsafe movement.
6. The experience should feel playful and sophisticated, not childish.
7. Heritage content must remain editable and separate from UI code.
8. Do not invent historical facts.
9. Do not copy long text directly from the existing information panels.
10. Use placeholders where content has not yet been validated.
11. All important progress must survive refresh and accidental browser closure.
12. The application must be compact and perform well on mid-range mobile devices.

TECHNICAL DIRECTION

Build a Progressive Web App using:

- Current stable Next.js App Router
- TypeScript in strict mode
- Tailwind CSS
- Framer Motion only for purposeful animations
- Zustand or another lightweight client state solution
- IndexedDB for durable local progress
- A service worker and web app manifest
- ZXing-based QR scanning with getUserMedia
- Static typed content for the MVP
- Vitest for unit tests
- Playwright for critical end-to-end flows

Avoid a backend during the first vertical slice. Define clean interfaces so
that a session and analytics API can be added later.

Do not add a component framework unless clearly justified. Prefer small,
accessible project-specific components.

VISUAL DIRECTION

Use the visual language of the mill:

- limewashed Djerbian white walls
- vivid traditional blue doors
- olive green accents
- clay and stone beige
- warm amber underground lighting
- charcoal historic machinery

Suggested starting tokens:

--zwita-white: #F7F2E8
--zwita-blue: #0878C9
--zwita-blue-dark: #07598F
--zwita-olive: #6F7938
--zwita-clay: #B7794C
--zwita-amber: #D99846
--zwita-ink: #25221D

Avoid generic AI gradients, glassmorphism, dark futuristic interfaces and
unnecessary dashboards.

Use authentic photography as the main visual material.

CORE SCREENS

1. Splash/loading screen.
2. Welcome screen.
3. Language selection.
4. Three-step tutorial.
5. Nickname and avatar-symbol selection.
6. Route creation.
7. Current mission/clue.
8. QR camera scanner.
9. Wrong-station feedback.
10. Correct-station success.
11. Station discovery content.
12. Progress path.
13. Optional bonus question.
14. Final completion/result.
15. Offline and camera-error states.
16. Reset-confirmation screen.

INITIAL STATIONS

- history
- access-corridor
- olive-storage
- crusher-mdar
- rudimentary-press
- boiler
- settling-jars
- byproducts
- dome

Represent each station using a typed structure similar to:

type Station = {
  id: string;
  slug: string;
  qrToken: string;
  title: LocalizedText;
  shortTitle: LocalizedText;
  clues: LocalizedText[];
  description: LocalizedText;
  funFact?: LocalizedText;
  images: StationImage[];
  safetyNote?: LocalizedText;
  estimatedDiscoveryMinutes: number;
};

GAME STATE

type GameState = {
  gameVersion: number;
  sessionId: string;
  playerId: string;
  nickname: string;
  avatar: string;
  locale: "ar" | "fr" | "en";
  routeId: string;
  stationIds: string[];
  currentIndex: number;
  completedStationIds: string[];
  attemptsByStation: Record<string, number>;
  hintsUsed: number;
  score: number;
  startedAt: string;
  completedAt?: string;
};

ROUTE RULES

Do not use unrestricted random permutations.

Use manually approved route templates. Assign one deterministically using a
stable hash of sessionId and playerId so that:

- the route does not change after refresh;
- starting points are distributed;
- unsafe transitions cannot be generated;
- each route contains the same number of core stations.

QR VALIDATION

QR payloads should not contain educational content. They identify the station
using a station ID and a non-obvious token.

Support:

- correct current station;
- incorrect station;
- station already completed;
- malformed or unrelated QR code;
- camera denied;
- camera unavailable;
- manual short-code entry.

Do not show frightening error messages. Use playful, useful feedback.

OFFLINE REQUIREMENTS

Pre-cache:

- application shell;
- core fonts;
- route data;
- station metadata;
- clues;
- essential image thumbnails;
- offline fallback screen.

Persist the active game and completion status locally.

The scanner should continue to validate known QR payloads without network
access after the application has loaded.

ACCESSIBILITY

- Proper RTL document direction for Arabic.
- Minimum 44 by 44 pixel touch targets.
- Strong contrast.
- Semantic headings and landmarks.
- Screen-reader labels for scanner controls.
- Visible focus indicators.
- Reduced-motion support.
- Do not rely only on colour to communicate correctness.
- Arabic body text should remain readable in dim conditions.
- Provide manual QR-code entry.

SECURITY AND PRIVACY

- Collect no email, telephone number or exact location.
- Store only a nickname and anonymous game identifier.
- Treat scanned QR content as untrusted input.
- Validate station IDs and tokens against an allowlist.
- Escape all displayed content.
- Do not render arbitrary scanned URLs.
- Add a clear reset function.
- Avoid third-party analytics for the first version.

PERFORMANCE

- Optimise images into responsive WebP or AVIF variants.
- Lazy-load non-essential galleries.
- Keep client-side JavaScript small.
- Avoid unnecessary dependencies.
- Avoid autoplay video.
- Avoid blocking web fonts.
- Support screens from 360 px width upward.
- Test on Android Chrome and iOS Safari.

TESTING

Write unit tests for:

- deterministic route assignment;
- QR payload parsing;
- station validation;
- score calculation;
- state migration;
- completion rules.

Write Playwright tests for:

- starting a game;
- restoring an interrupted game;
- scanning the expected station using a mocked scanner adapter;
- scanning the wrong station;
- completing the route;
- switching Arabic RTL and French LTR;
- offline restoration where practical.

IMPLEMENTATION PROCESS

Do not start by implementing the entire application.

First:

1. Inspect all repository documents and assets.
2. Identify ambiguities and assumptions.
3. Produce a concise architecture and implementation plan.
4. Propose the directory structure.
5. Propose the typed content model.
6. Propose the first vertical slice.
7. Wait for approval before writing implementation code.

The first vertical slice must include:

- Arabic welcome screen;
- nickname setup;
- deterministic assignment of a three-station demo route;
- one clue screen;
- scanner adapter with a developer simulation mode;
- correct and incorrect scan responses;
- one discovery screen;
- local progress persistence;
- a basic PWA manifest;
- unit tests for route and QR validation.

After completing the vertical slice:

- run type checking;
- run linting;
- run unit tests;
- run the production build;
- report the results honestly;
- list all remaining limitations.

Do not claim a feature is complete unless it has been implemented and tested.