# ZWITA Repository Instructions

## Product

ZWITA is an Arabic-first mobile heritage exploration PWA for a traditional
olive oil mill in Djerba.

## Mandatory workflow

- Read `/docs/PRODUCT.md` before making architectural changes.
- Use plan mode before multi-file work.
- Keep station content separate from presentation components.
- Do not invent historical facts.
- Do not replace Arabic copy without explicit approval.
- Preserve RTL support.
- Do not add dependencies without explaining their purpose.
- Prefer a small, testable implementation over abstraction.
- Run typecheck, lint, tests and build before declaring work complete.

## Architecture constraints

- TypeScript strict mode.
- Mobile-first.
- Progressive enhancement.
- QR scanning must be behind a scanner adapter so it can be mocked.
- Route generation must be deterministic and use approved templates.
- Game progress must persist locally.
- Scanned QR values are untrusted input.
- No arbitrary scanned URL may be opened.
- No backend dependency for the initial vertical slice.

## UX constraints

- One prominent action per screen.
- Arabic defaults to RTL.
- Large touch targets.
- No long paragraphs during active missions.
- No speed mechanic that encourages running.
- Respect `prefers-reduced-motion`.
- Always provide camera-error and manual-code alternatives.

## Completion definition

A task is only complete when:

1. implementation is present;
2. relevant tests pass;
3. typecheck passes;
4. production build passes;
5. known limitations are documented.