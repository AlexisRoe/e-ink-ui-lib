---
type: component
title: "LineChart"
description: "SVG line chart plotting up to three datasets as 2px black lines distinguished by stroke style (solid/dashed/dotted) rather than color, for readability on e-ink displays."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/line-chart/line-chart.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (pending)
---

# LineChart

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Plots up to three `datasets` (extra datasets beyond the third are silently ignored); each is drawn in order as a solid, dashed, then dotted 2px black `<polyline>` — series are distinguished by stroke style, not color
- Optional `title` combined with `unit` as `"title - unit"` heading text above the chart
- Optional `categories` array for x-axis labels, only rendered when both `withAxis` and `withLabel` are true
- `withLegend` (default `false`) renders a legend listing each dataset's stroke style plus the reference line, if any
- `withAxis` (default `true`) draws the x-axis baseline
- `referenceLine` (`ChartReferenceLine`, from `src/utils/chart.utils.ts`) draws a flat dashed grey reference line at the median or average of all datasets' combined values, computed via `calculateReferenceValue`
- Configurable SVG viewport `width` (default `480`) and `height` (default `160`)
- Renders as an `<svg role="img">` with `aria-label` set to the title or `"Line chart"`

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` to merge the root `eink-line-chart` class with an optional consumer `className`
- BEM classes prefixed `eink-`: block `.eink-line-chart`, elements `__title`, `__svg`, `__axis`, `__reference`, `__line`, `__categories`, `__category-label`, `__legend`, `__legend-item`, `__legend-swatch`; modifiers `.eink-line-chart__line--dashed`/`--dotted`, `.eink-line-chart__legend-swatch--dashed`/`--dotted`/`--reference`
- Imports its own stylesheet via `import "./line-chart.component.css"`
- Shares chart data types (`ChartDataset`, `ChartReferenceLine`) and the `calculateReferenceValue` helper from `src/utils/chart.utils.ts` rather than reimplementing reference-line math locally
- Renders raw SVG primitives (`<line>`, `<polyline>`, `<text>`) directly rather than pulling in a third-party charting library

---

## Primary Use Cases
- Visualizing trends over time (e.g. battery level, temperature) on e-ink devices where color cannot be relied on to distinguish series
- Dashboards or detail screens that need a compact, dependency-free chart with an optional legend and reference line (median/average)

---

## Limits & Restrictions
- Only the first three entries of `datasets` are plotted; a fourth series has no visual representation
- Stroke style (solid/dashed/dotted), not color, is the only way series are distinguished — there is no color-coding option
- `unit` has no effect unless `title` is also provided
- `categories`/`withLabel` labels only render when `withAxis` is also `true`
- `referenceLine` accepts only the values defined by `ChartReferenceLine` (median or average per the component logic)

---

## Component-Specific CSS & Tokens
- No component-specific custom properties are defined beyond global theme tokens (`--eink-color-*`, `--eink-size-*`, `--eink-border-width-thin`, `--eink-border-width-medium`, `--eink-font-family-main`)
- Notable modifier classes: `.eink-line-chart__line--dotted` (rounded line caps for the dotted style), `.eink-line-chart__legend-swatch--dashed`/`--dotted`/`--reference` (matching border-style swatches in the legend)

---

## Related Concepts
- `src/utils/chart.utils.ts` — provides the shared `ChartDataset`, `ChartReferenceLine` types and `calculateReferenceValue` helper used by this component
