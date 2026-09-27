# Ogooué Habitat

Plateforme proptech gabonaise — recherche, achat, location et publication de biens immobiliers, avec un système de confiance national (Passeport Ogooué / Ogooué Shield) et un pôle dédié à la diaspora gabonaise.

This is a faithful Next.js/TypeScript/Tailwind reproduction of the Stitch-exported design (`ogoou_habitat_*` screens + `DESIGN.md`). See [STITCH_IMPLEMENTATION.md](./STITCH_IMPLEMENTATION.md) for the full screen-by-screen fidelity tracking, judgment calls, and known deviations.

## Stack

- Next.js App Router, React Server Components by default, TypeScript (strict)
- Tailwind CSS v3 with design tokens ported verbatim from the Stitch export (`tailwind.config.ts`)
- shadcn/ui primitives (Radix under the hood)
- Material Symbols Outlined (icon font, wrapped by `components/ui/icon.tsx`)
- Motion, used sparingly for genuine interaction feedback
- Centralized mock data under `data/` (properties, land, neighborhoods, provinces, agencies, passport timeline)

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — local dev server
- `npm run build` / `npm run start` — production build/serve
- `npm run lint` — ESLint
- `npx tsc --noEmit` — strict type-check
- `npm run test:visual` — Playwright structural/visual regression suite (see caveat below and in `tests/visual/screens.spec.ts`)

## Visual regression testing

`tests/visual/screens.spec.ts` loads each of the 7 Stitch-sourced screens at three viewports (390×844, 768×1024, 1440×900) and checks:

1. The literal Stitch copy/headline is present (structural fidelity).
2. No console/page errors.
3. No horizontal overflow.
4. A self-referential screenshot baseline (`toHaveScreenshot`), to catch regressions introduced by future changes to *this* codebase.

**Caveat:** the Stitch export's `screen.png` reference files are non-uniform scaled thumbnails, not literal 1440px captures, so they cannot serve as pixel-diff targets — the screenshot baselines above are compared against previous local runs, not against those thumbnails. Fidelity to the Stitch source is instead verified structurally (content, layout, tokens) and by manual side-by-side review against `screen.png` / `code.html`.

The suite boots its own isolated `next start` server on port 4390 (not 3000) to avoid colliding with any other unrelated dev server that might already be running locally.
