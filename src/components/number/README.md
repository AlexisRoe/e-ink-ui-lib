---
type: component
title: "Number"
description: "Formats and displays a numeric value with optional prefix/suffix, decimal rounding, digit grouping, and locale-specific separators."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/number/number.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (2026-09-14T18:19:01.260Z)
---

# Number

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Renders a `value: number` as formatted text inside a `<span>`, split into `__prefix`, `__value`, and `__suffix` sub-spans
- `roundDecimal` (number or `false`, default `false`) rounds/pads to a fixed number of decimal places via `toFixed`
- `groupingBy` supports four digit-grouping strategies: `"thousands"` (groups of 3), `"lakh"` (Indian numbering: 3 then groups of 2), `"wan"` (East Asian numbering: groups of 4), and `"none"` (default, no grouping)
- `separatorStyle` chooses `"us"` (default: `,` thousands / `.` decimal) or `"eu"` (`.` thousands / `,` decimal) separator characters
- Handles negative values by formatting the absolute value and re-prepending `-`
- `prefix`/`suffix` render optional text (e.g. currency symbol or unit) around the formatted number

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` to merge the base `eink-number` class with an optional consumer `className`
- BEM classes prefixed `eink-`: `.eink-number`, `.eink-number__value`, `.eink-number__prefix`, `.eink-number__suffix`
- Imports its own `number.component.css` directly
- Colors and sizing in the CSS reference design tokens (`--eink-color-primary`, `--eink-color-grey-40`, `--eink-size-*`, `--eink-font-family-main`) rather than hardcoded literals
- Formatting logic (`groupIntegerDigits`, `formatNumber`) is implemented as local pure functions in the component file rather than in `src/utils/`
- Uses a documented `biome-ignore` for `lint/suspicious/noShadowRestrictedNames` since the component is intentionally named `Number`, shadowing the global
- `font-variant-numeric: tabular-nums` is applied to the value for consistent digit width
- JSDoc on `NumberGroupingBy`, `NumberSeparatorStyle`, `NumberProps`, and the component, including an `@example`

---

## Primary Use Cases
- Displaying formatted currency, quantity, or metric values with locale-correct thousands/decimal separators
- Displaying large counts with digit grouping appropriate to a region (Western, Indian, or East Asian numbering systems)
- Rounding a numeric value to a fixed decimal precision for consistent display width (paired with `font-variant-numeric: tabular-nums`)

---

## Limits & Restrictions
- `value` is a required prop
- `children` is explicitly excluded from `NumberProps` (`Omit<HTMLAttributes<HTMLSpanElement>, "children">`) — content is derived solely from `value`/`prefix`/`suffix`
- Grouping and separator options are limited to the four `NumberGroupingBy` and two `NumberSeparatorStyle` values defined in the source; no custom separator characters are supported

---

## Related Concepts
- [Value](../value/value.component.tsx) — related data-display component, worth comparing when choosing how to present a labeled metric
