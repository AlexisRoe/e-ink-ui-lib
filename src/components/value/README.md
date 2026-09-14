---
type: component
title: "Value"
description: "Displays a measurement as a large value paired with a smaller unit, matching common gauge/reading typography."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/value/value.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (pending)
---

# Value

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Renders `children` (a `number | string`, required) as a large primary value alongside a smaller `unit` string (e.g. `44%`, `21.4°C`), split into `__value` and `__unit` sub-spans
- Three sizes via `size` (`"sm" | "md" | "xl"`, default `"md"`), each scaling both the value and unit font sizes independently (`sm`: 24/12, `md`: 48/20, `xl`: 128/36, per the size tokens used)
- `unit` is a required prop, always rendered

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` to merge the base `eink-value` class, the size modifier (`eink-value--{size}`), and an optional consumer `className`
- BEM classes prefixed `eink-`: `.eink-value`, `.eink-value--sm|md|xl`, `.eink-value__value`, `.eink-value__unit`
- Imports its own `value.component.css` directly
- All sizes/colors reference design tokens (`--eink-size-*`, `--eink-color-primary`, `--eink-font-family-main`) rather than hardcoded literals
- `font-variant-numeric: tabular-nums` applied to the value for consistent digit width, matching `Number`'s approach
- JSDoc on `ValueSize`, `ValueProps`, and `Value`, including an `@example`

---

## Primary Use Cases
- Gauge/reading-style displays of a single measurement with its unit, e.g. temperature, percentage, or sensor readings on a dashboard
- Large-format value display (`size="xl"`) for at-a-glance readings on e-ink tablets

---

## Limits & Restrictions
- `unit` is a required prop — there is no unit-less variant; consumers wanting no unit would need to pass an empty string
- `children` is typed as `number | string` only, and the native `children` HTML attribute is explicitly omitted in favor of this
- Only three fixed size steps are available; no arbitrary/custom font sizing prop

---

## Related Concepts
- [Number](../number/number.component.tsx) — related component for formatted numeric display (grouping, rounding, separators), which `Value`'s `children` could be composed with for a formatted large reading
