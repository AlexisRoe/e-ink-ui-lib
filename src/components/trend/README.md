---
type: component
title: "Trend"
description: "Bordered square up/down/no-change triangle indicator followed by content, with a full-bleed black banner variant for high-contrast alerts."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/trend/trend.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (2026-09-14T18:19:01.260Z)
---

# Trend

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- `Trend` renders a bordered square containing a CSS-triangle direction indicator (`"up"`, `"down"`, or a flat bar for `"none"`) followed by arbitrary `children` content (typically a value or label).
- Three sizes: `sm`, `md`, `xl` (defaults to `md`), scaling both the indicator box and the content font size (and the triangle dimensions for `md`/`xl`).
- `Trend.Full` (`Full`) is a full-bleed black banner variant: a solid black background with a white direction shape and uppercase, letter-spaced white content — for high-contrast alerts.
- Both indicator shapes are built with pure CSS borders/backgrounds (no SVG or icon dependency).

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` for className merging.
- BEM classes prefixed `eink-`: block `.eink-trend`, elements `.eink-trend__indicator`, `.eink-trend__shape`, `.eink-trend__content`, modifiers `.eink-trend--sm|md|xl`, `.eink-trend__shape--up|down|none`; the full variant uses its own block `.eink-trend-full` with parallel element/modifier names.
- Imports its own stylesheet via `import "./trend.component.css"`.
- `Full` is attached to `Trend` as `Trend.Full` for compound-component usage.
- `children` is required and explicitly excluded from the native `HTMLAttributes` it otherwise extends, since it's redeclared as a required typed prop.

---

## Primary Use Cases
- Showing numeric change indicators (e.g. price change, percentage delta, score movement) with a directional cue that doesn't rely on color.
- Highlighting a significant change as a standalone, high-contrast banner (e.g. "Decreased by 1.60 from € 14.50") via `Trend.Full`.

---

## Limits & Restrictions
- `direction` and `children` are required on both `Trend` and `Trend.Full`.
- `Trend.Full` has no `size` prop — it always renders at a single fixed size/scale.
- No numeric formatting or computation is performed by the component itself; the caller supplies the already-formatted value/description as `children`.

---

## Component-Specific CSS & Tokens
- No component-specific custom properties beyond global theme tokens are defined; triangle shapes are built with `border-*` tricks sized from `--eink-size-*`, and colors come from `--eink-color-primary`/`--eink-color-secondary`.
- Notable modifier classes: `.eink-trend--sm|md|xl` (size), `.eink-trend__shape--up|down|none`, `.eink-trend-full__shape--up|down|none`.

---

## Related Concepts
- None directly coupled; pairs well with data-display components summarizing metrics (e.g. `src/components/description/`).
