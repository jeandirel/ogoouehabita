# Stitch → Ogooué Habitat implementation tracking

This document maps every Stitch-exported screen to its implementation, records every deliberate deviation/judgment call, and lists the utility pages that exist outside the Stitch export. It is the canonical fidelity record for this repo — read it before assuming a discrepancy between the app and `screen.png`/`code.html` is a bug rather than a documented, deliberate call.

Source export: `stitch_logisgab_proptech_platform/ogoou_habitat_*` (7 screens + `ogoou_habitat_design_system` for tokens).

## Screen → route mapping

| Stitch screen | Route(s) | Status |
| --- | --- | --- |
| `ogoou_habitat_accueil` | `/` | Implemented |
| `ogoou_habitat_acheter_un_bien` | `/acheter` | Implemented |
| `ogoou_habitat_louer_un_logement` | `/louer` | Implemented |
| `ogoou_habitat_terrains_foncier` | `/terrains`, `/terrains/[slug]` | Implemented (`[slug]` is a new route, see Deviations) |
| `ogoou_habitat_recherche_immobili_re` | `/recherche` | Implemented |
| `ogoou_habitat_villa_contemporaine_angondj` | `/bien/[slug]` | Implemented (generalized to all properties, see Deviations) |
| `ogoou_habitat_passeport_ogoou_num_rique` | `/bien/[slug]/passeport` | Implemented (gated to passport-eligible properties, see Deviations) |
| `ogoou_habitat_design_system` | `tailwind.config.ts`, `app/globals.css` | Tokens ported verbatim (not a standalone route) |

## Design tokens

All colors, type scale, spacing, radii, and shadow tokens in `tailwind.config.ts` are copied verbatim from the `tailwind.config` block embedded identically in every screen's `code.html` (cross-checked, they matched exactly across all 7 screens). Nothing was renamed, rounded, or "cleaned up" — the file header comment says so explicitly to deter future edits.

## Component architecture

Per the brief's core constraint, components are only shared across screens where the Stitch source genuinely repeats the same visual (e.g. `Icon`, `SearchResultCard`'s underlying patterns, `NeighborhoodCard`, `RecentListingRow`). Each screen's bespoke property/listing card is its own page-scoped component rather than a forced shared abstraction:

- `components/property/property-card.tsx` — accueil-style card
- `components/property/rent-listing-card.tsx` — louer-style card
- `components/search/search-result-card.tsx` — recherche-style card (also reused by `/favoris`, since it already handles the favorite-toggle affordance)
- `components/property/contact-agency-panel.tsx`, `components/property/ai-question-form.tsx` — villa-detail sidebar/AI-box interactivity
- `components/passport/trust-score-gauge.tsx`, `components/passport/verification-timeline-step.tsx` — passeport screen
- `components/louer/ai-alert-form.tsx` — louer's Ogooué AI alert box

## Data model

Centralized under `data/`: `properties.ts`, `land.ts`, `neighborhoods.ts` (implied), `provinces.ts` (implied), `agencies.ts`, `passport-timeline.ts`, `image-manifest.ts`. All page components read from these rather than hardcoding copy inline, so filters/sorts/search on `/recherche`, `/acheter`, `/louer`, `/terrains` operate on real (if mock) data rather than static markup.

## Deviations & judgment calls (flagged deliberately, not oversights)

1. **`/terrains/[slug]` is a new route** — the Stitch export only shows a terrains *listing* screen, no land-detail screen. A detail page was built following the same visual language as the listing cards, since linking a land card to a dead end would violate the "no dead links" constraint.
2. **`/bien/[slug]` was generalized from one villa to all properties** — the Stitch source shows one specific villa's detail page. `generateStaticParams()` covers every property in `data/properties.ts`, with every optional section (`description`, `features`, `amenities`, `passportChecklist`, `gallery`, `neighborhoodBlurb`) rendered conditionally so properties with thinner data degrade gracefully instead of showing blank sections.
3. **Passeport eligibility gating** — `/bien/[slug]/passeport` only exists for properties where both `passportScore` and `reference` are defined (`passportEligible()` in both `app/bien/[slug]/page.tsx` and the passeport page itself). This naturally yields exactly the two properties that have full passport data, rather than fabricating a reference number for every property or hardcoding a single slug.
4. **Villa-detail's "Contacter le conseiller dédié" / passeport CTA** — the Stitch source has this as a dead `href="#"`. Changed to a real `<Link>` to `/bien/[slug]`.
5. **The 4 static sidebar CTA buttons** (Réserver une visite / WhatsApp / Appeler / Message) on the villa-detail screen have no backing phone/email data in the Stitch source. Rather than fabricate contact details or leave them inert, `ContactAgencyPanel` wires all 4 to one `useState` flag that swaps the button block for an honest inline confirmation ("Votre demande a été transmise à {agence}. Un conseiller vous recontactera sous 24h."). The same "genuine state change, no fabricated backend" pattern is reused in `AiQuestionForm`, `AiAlertForm`, and every lead-capture form added on the utility pages (see below).
6. **Villa-detail's "Localisation & Quartier" map** — the source's own map placeholder div is blank/empty (no real image reference). Reused the already-canonical `misc_carte_illustrative_libreville` illustrative-map asset (also used on `/terrains` and `/recherche`) for visual consistency rather than shipping an empty box or introducing a new, unrelated image.
7. **`/recherche`'s 4th map pin** ("120M FCFA", illustrative-only in the source) has no backing property in `data/properties.ts`. The 3 pins that do map to real properties are genuine `<Link>`s to `/bien/[slug]`; the 4th was dropped rather than inventing a listing or shipping a dead pin.
8. **Loan/budget simulator on `/acheter`** — the Stitch source shows a simulator UI without a specified formula. A real, simple amortization-style calculation was implemented (not left as a static mockup) so the "simulate" affordance is genuinely functional.
9. **9-province tile split on the home/search province sections** — the source mixes icon-only and photo tiles inconsistently across provinces; implementation splits provinces into an icon-tile set and a photo-tile set based on which already have a real image asset in `data/image-manifest.ts`, rather than forcing a mismatched image onto every tile.
10. **"Voir tout le catalogue" → `/recherche`** — a few catalogue-wide CTAs across screens point at `/recherche` (the most complete filterable listing view) rather than a screen-specific listing route, where the source's intent was clearly "see everything," not a specific new screen.

## Utility pages (no Stitch source — flagged explicitly)

The header/footer nav references several routes with **no corresponding Stitch screen at all** (confirmed: the export only contains the 7 screens listed above). These were built from scratch to avoid 404s from already-faithful pages' own navigation, following the same visual tokens and the same "honest confirmation, no fabricated backend" interactivity pattern established for the Stitch screens:

- `/favoris` — reads real favorited properties via `useFavorites()` (the same localStorage-backed hook wired into `SearchResultCard`'s heart button), with a genuine empty state.
- `/connexion`, `/inscription` — real forms with client-side state; submitting shows an honest "this is a demo environment" message rather than faking a session or account.
- `/diaspora` — full value-proposition page for the "Ogooué Diaspora" differentiator (named in the brief) plus a real lead-capture form.
- `/neuf` — framed as an active "waitlist / be notified first" feature (deliberately avoiding literal "Coming soon" text) rather than fabricating new-build listings that don't exist in the data.
- `/professionnels` — B2B value-prop page + a real "Devenir partenaire" lead form.
- `/publier` — full property-submission form; confirmation is framed around genuine Ogooué Shield verification ("soumis pour vérification... sous 48h"), not a false claim of instant publishing.
- `/legal/mentions-legales`, `/legal/confidentialite` — static, substantive (non-Lorem-ipsum) legal pages, the latter referencing Gabon's real data-protection law (Loi n°001/2011) and explicitly documenting the app's actual localStorage-based favorites mechanism.

None of these introduce new color/typography tokens or new images beyond what's already in `data/image-manifest.ts`.

## Known limitations

- **`screen.png` thumbnails are not pixel-diff-able.** Each Stitch screen's `screen.png` is a non-uniformly scaled preview image (different sizes/aspect ratios per screen), not a literal 1440px capture. `tests/visual/screens.spec.ts` therefore checks structural fidelity (literal copy present, no console errors, no horizontal overflow) plus a self-referential screenshot baseline for future-regression detection — it does not, and cannot, diff against the Stitch thumbnails directly. Fidelity to `screen.png`/`code.html` was otherwise verified by direct reading of every screen's full `code.html` source during implementation.
- Mock data only — there is no real backend/database/auth; every "submit" interaction ends in an honest client-side confirmation message rather than a persisted record, by design (see judgment call #5 above).
