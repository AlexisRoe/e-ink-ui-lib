---
type: component
title: "ColumnChart"
description: "Grouped vertical column chart that distinguishes up to three series by fill pattern instead of color for e-ink readability."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/column-chart/column-chart.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (pending)
---

# ColumnChart

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Renders up to three `ChartDataset` series as grouped vertical columns inside an SVG; datasets beyond the third are ignored
- Distinguishes series by fill style rather than color: first series solid black, second diagonal stripes (via an SVG `<pattern>`), third empty/outline
- Optional title heading combined with a unit suffix (`title - unit`)
- Optional legend (`withLegend`) listing each series' fill swatch and the reference line if present
- Optional x-axis baseline (`withAxis`, default `true`)
- Optional category labels below the x-axis (`withLabel`), only rendered when `withAxis` is also true and `categories` are supplied
- Optional flat reference line at the median or average of all combined dataset values (`referenceLine: "median" | "average"`), computed via `calculateReferenceValue` from `src/utils/chart.utils`
- Configurable SVG viewport (`width` default `480`, `height` default `160`)

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` to merge the base `eink-column-chart` class with an optional consumer `className`
- BEM classes prefixed `eink-`, e.g. `.eink-column-chart`, `.eink-column-chart__bar--solid`, `.eink-column-chart__legend-swatch--striped`
- Imports its own `column-chart.component.css` directly
- All colors, sizes, and borders in the CSS reference design tokens (`--eink-color-*`, `--eink-size-*`, `--eink-border-width-*`, `--eink-font-family-main`) rather than hardcoded literals
- Uses `useId()` to generate a collision-safe SVG pattern id for the striped fill
- Shares the same `ChartDataset`/`ChartReferenceLine` types and `calculateReferenceValue` utility as `BarChart`
- JSDoc on the exported `ColumnChartProps` interface and the `ColumnChart` function, including an `@example`

---

## Primary Use Cases
- Comparing a small number (up to three) of grouped numeric series over categories, e.g. monthly rainfall across years
- Dashboards or reports on e-ink tablets where color differentiation is unreliable and pattern-based fills are preferred
- Charts needing a quick reference line (median/average) against grouped column values

---

## Limits & Restrictions
- Only the first three entries of `datasets` are rendered; additional datasets are silently dropped
- `unit` has no visible effect unless `title` is also provided
- Category labels (`withLabel`) only render when both `withAxis` is true and a `categories` array with a matching entry is supplied
- `referenceLine` accepts only `"median"` or `"average"` (typed via `ChartReferenceLine`)

---

## Component-Specific CSS & Tokens
- `.eink-column-chart__bar--solid`, `--striped`, `--empty` — BEM modifiers controlling per-series fill/stroke (solid fill, patterned stroke, or outline-only)
- `.eink-column-chart__legend-swatch--solid`, `--striped`, `--empty`, `--reference` — corresponding legend swatch modifiers, with the striped swatch built from a `repeating-linear-gradient` and the reference swatch rendered as a dashed line
- `.eink-column-chart__reference` — dashed reference line styling (`stroke-dasharray: 4 4`)

---

## Related Concepts
- [BarChart](../bar-chart/bar-chart.component.tsx) — horizontal counterpart sharing the same `ChartDataset`/`ChartReferenceLine` utilities
- [State](../state/state.component.tsx) — related data-display component for status/value presentation
