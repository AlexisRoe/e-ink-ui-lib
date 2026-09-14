---
type: component
title: "Pill"
description: "Small uppercase status pill with an optional icon, three sizes, and five border-style variants (solid, double, filled, dashed, dotted)."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/pill/pill.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (pending)
---

# Pill

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Renders `children` (required) as uppercase label text inside a `<span>`, with an optional leading `icon` (`IconName` from the curated icon registry)
- Five border-style variants, exposed as static sub-components: `Pill` (solid 2px border), `Pill.Double` (thin outer border + outline), `Pill.Filled` (filled black background, white text), `Pill.Dashed`, `Pill.Dotted`
- Three sizes via `size` (`"sm" | "md" | "xl"`, default `"md"`), each with its own padding/font-size and a matching icon pixel size (`sm: 12`, `md: 14`, `xl: 20`, from the internal `ICON_SIZES` map)
- All variants share the same rendering logic via an internal `renderContent` helper, keeping icon/label markup consistent across variants

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` in every variant to merge base BEM classes (block + variant modifier + size modifier) with an optional consumer `className`
- BEM classes prefixed `eink-`: `.eink-pill`, `.eink-pill--solid|double|filled|dashed|dotted`, `.eink-pill--sm|md|xl`, `.eink-pill__label`, `.eink-pill__icon`
- Imports its own `pill.component.css` directly
- All colors, borders, and sizes reference design tokens (`--eink-color-*`, `--eink-border-*`, `--eink-size-*`, `--eink-font-family-secondary`) rather than hardcoded literals
- Uses the shared `Icon` component and curated `IconName` type from `src/components/icons/`
- Variant sub-components attached as static properties (`Pill.Double`, `Pill.Filled`, `Pill.Dashed`, `Pill.Dotted`)
- JSDoc on `PillSize`, `PillProps`, and `Pill`, including an `@example` covering every variant

---

## Primary Use Cases
- Status/state indicators (e.g. "OK", "Warning", "Critical", "Offline") in dashboards, lists, or cards
- Compact labeled tags where an icon reinforces meaning without relying on color alone, suited to e-ink's contrast-only rendering

---

## Limits & Restrictions
- `children` is required (not optional) — a `Pill` cannot be rendered empty
- `icon` is restricted to the curated `IconName` union from the icon registry; arbitrary icon components/names are not accepted
- `Pill.Double`'s outline uses `outline-offset`, so double-bordered pills need extra surrounding space (the CSS adds a small `margin` per size to compensate)

---

## Component-Specific CSS & Tokens
- `.eink-pill--solid`, `--double`, `--filled`, `--dashed`, `--dotted` — BEM modifiers defining the five border treatments; `--double` combines a `border` and an `outline` with `outline-offset`, `--filled` inverts background/text colors
- `.eink-pill--sm|md|xl` — size modifiers controlling padding and font-size
- `.eink-pill--double.eink-pill--sm|md|xl` — compound selectors adding margin to compensate for the double variant's outline offset

---

## Related Concepts
- [State](../state/state.component.tsx) — related status-communicating data-display component
- Icons (`src/components/icons/icon.tsx`, `src/components/icons/icons.ts`) — source of the `IconName` type and `Icon` component used for the pill's optional icon
