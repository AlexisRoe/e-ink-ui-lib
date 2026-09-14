---
type: component
title: "LastUpdated"
description: "Wraps a value with a fresh/stale/expired status swatch and elapsed-time text computed from a given date."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/last-updated/last-updated.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (pending)
---

# LastUpdated

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Computes a `LastUpdatedStatus` of `"fresh"`, `"stale"`, or `"expired"` by comparing elapsed seconds since a supplied `date` against configurable `stale`/`expired` thresholds (defaulting to `60` and `300` seconds).
- Renders the wrapped `children` value alongside a bordered status swatch: unfilled for `"fresh"`, diagonal stripes (via the shared `PatternOverlay` component) for `"stale"`, and filled solid for `"expired"`.
- Shows elapsed time below the value (e.g. `"5 minutes ago"`), auto-pluralized, and overridable via `formatMinutesAgo`.
- Status labels are overridable per-status via `statusLabels` (merged over defaults `fresh`/`stale`/`expired`).
- `withBorder` (default `true`) toggles a border around the whole component.

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` for className merging, including the conditional `--border` modifier and the dynamic `eink-last-updated__status--${status}` class.
- BEM classes prefixed `eink-`: `.eink-last-updated`, `.eink-last-updated--border`, `.eink-last-updated__row`, `.eink-last-updated__value`, `.eink-last-updated__status` with `--fresh`/`--stale`/`--expired` modifiers, `.eink-last-updated__indicator`, `.eink-last-updated__label`, `.eink-last-updated__ago`.
- Imports its own `last-updated.component.css` directly.
- Reuses the shared `PatternOverlay` component (`../pattern-overlay/pattern-overlay.component`) for the diagonal-stripe "stale" indicator instead of a one-off SVG.
- Sets a `data-eink-component="last-updated"` attribute on the root element.

---

## Primary Use Cases
- Showing data freshness next to a price, quote, or any polled/cached value (its stories use a `$42.00` price as the example).
- Dashboards or read-only data displays on e-ink devices where indicating "how current is this number" matters more than a live-updating timestamp.

---

## Limits & Restrictions
- Freshness is computed once per render from `Date.now()` — the component does not poll or re-render on a timer itself, so on a static/no-rerender e-ink view the status can go stale without a re-render.
- `stale` and `expired` are both expressed in seconds while `formatMinutesAgo` receives whole minutes — thresholds and displayed elapsed time use different units.
- No component-specific restrictions beyond standard theme token usage.

---

## Component-Specific CSS & Tokens
- `.eink-last-updated__status--expired .eink-last-updated__indicator` swaps the indicator swatch to `var(--eink-color-primary)` (solid fill) to represent the expired state; the `"stale"` state instead overlays `PatternOverlay` for diagonal stripes.
- Status/indicator/label BEM modifier classes (`--fresh`/`--stale`/`--expired`) are specific to this component's state machine.

---

## Related Concepts
- `../pattern-overlay/pattern-overlay.component.tsx` — shared diagonal-stripe SVG component reused for the "stale" indicator.
- `../price/README.md` — a likely value to wrap with `LastUpdated` in real usage.
