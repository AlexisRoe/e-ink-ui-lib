---
type: component
title: "PatternOverlay"
description: "Diagonal black-stripe SVG pattern used across the library to indicate pending/warning/disabled states on e-ink-safe, non-color surfaces."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/pattern-overlay/pattern-overlay.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (2026-09-14T18:19:01.260Z)
---

# PatternOverlay

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Renders an `<svg>` with a repeating, 45°-rotated diagonal stripe pattern, generated with a unique `<pattern>` id via React's `useId()` (so multiple instances never collide).
- Configurable tile `size` (default `8`px), stripe `stroke` color (default `"black"`), and `strokeWidth` (default `2`).
- `overlay` (default `true`) applies the shared `eink-pattern-overlay` class, which absolutely positions the SVG to fill its nearest positioned ancestor; set `overlay={false}` when sizing/positioning it entirely via a custom `className` instead.
- `rectProps` lets callers override the underlying `<rect>` the pattern is painted onto, e.g. to inset it and add its own border/stroke.
- Automatically sets `aria-hidden` unless the caller passes their own `role` or `aria-label`.

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` for className merging.
- The shared `eink-pattern-overlay` class it conditionally applies is defined once in the global `src/components/theme/theme.css`, not in a co-located `.css` file — this component has no `pattern-overlay.component.css` of its own.
- Explicitly documented as "not part of the public API"; it's an internal building block reused by other components (e.g. `Input`'s error swatch, `Notification`'s warning bar).
- Uses a Biome lint suppression (`biome-ignore lint/a11y/noSvgWithoutTitle`) justified inline by the `aria-hidden`/`role`/`aria-label` handling.

---

## Primary Use Cases
- Indicating "pending", "warning", or disabled-style states on surfaces that must remain legible without color (e.g. the warning bar in `Notification`, the error swatch in `Input`).
- Any e-ink-safe visual affordance that needs a black-and-white textured fill instead of a color swatch.

---

## Limits & Restrictions
- Not part of the public API — it is an internal component consumed by other components in this library rather than meant for direct external use, though nothing in the code technically prevents importing it.
- Requires a positioned ancestor to fill correctly when `overlay` is `true`, since it relies on absolute positioning via the shared class.

---

## Component-Specific CSS & Tokens
- Defines no CSS of its own; the `eink-pattern-overlay` class it can apply is a shared utility class declared in `src/components/theme/theme.css` (the global design-token stylesheet), not a dedicated `pattern-overlay.component.css`.

---

## Related Concepts
- `src/components/input/` — uses `PatternOverlay` for its validation-error swatch.
- `src/components/notification/` — uses `PatternOverlay` for the warning variant's left-hand bar.
