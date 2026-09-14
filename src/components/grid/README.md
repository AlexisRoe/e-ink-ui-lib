---
type: component
title: "Grid"
description: "CSS grid layout container with fixed-column, auto-fit, and masonry variants."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/grid/grid.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (2026-09-14T18:19:01.260Z)
---

# Grid

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- `Grid` is a `display: grid` container supporting either a fixed equal-width `columns` count (defaults to `2`) or a `minColumnWidth` (px) that auto-fits as many columns of at least that width as the container allows (`repeat(auto-fit, minmax(...))`), reflowing on resize
- `Grid.Item` is a grid cell that can span multiple columns/rows via `colSpan`/`rowSpan` (both default to `1`), applied as inline `gridColumn`/`gridRow` styles
- `Grid.Masonry` lays children into evenly sized CSS multi-column layout columns (`column-width`) that reflow automatically based on `minItemWidth` (default `240`px), without needing to know child heights up front; each child is wrapped in an `.eink-grid-masonry__item` with `break-inside: avoid`
- Token-based `gap` prop (`"sm" | "md" | "xl"`, from `FlexGap`, default `"md"`) shared across `Grid` and `Grid.Masonry`

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` in `Grid`, `Grid.Item`, and `Grid.Masonry` to merge base BEM classes with an optional consumer `className`
- BEM classes prefixed `eink-`: `.eink-grid`, `.eink-grid--gap-*`, `.eink-grid__item`, `.eink-grid-masonry`, `.eink-grid-masonry__item`, `.eink-grid-masonry--gap-*`
- Imports its own `grid.component.css` directly
- Gap modifiers map to `--eink-size-*` design tokens (`--eink-size-8`, `--eink-size-16`, `--eink-size-24`) rather than hardcoded values
- Reuses the `FlexGap` type from `src/components/flex/flex.component` to keep gap values consistent across layout components
- `Grid.Masonry`'s dynamic `minItemWidth` is passed through a CSS custom property (`--eink-grid-masonry-min-item-width`) set via inline `style`, consumed by `column-width` in the CSS
- Sub-components attached as static properties (`Grid.Item`, `Grid.Masonry`)
- JSDoc on every exported prop type and sub-component with `@example`s

---

## Primary Use Cases
- Equal-width column layouts for dashboard tiles, cards, or form fields (`Grid` with `columns`)
- Responsive layouts that should reflow into more/fewer columns as the container resizes without a fixed count (`Grid` with `minColumnWidth`)
- Layouts spanning cells across multiple columns/rows (`Grid.Item` with `colSpan`/`rowSpan`)
- Pinterest-style content of varying heights that should reflow into balanced columns (`Grid.Masonry`)

---

## Limits & Restrictions
- `columns` and `minColumnWidth` are mutually exclusive at the type level (`GridColumnsProps`) — passing both is a TypeScript error
- `Grid.Item` is documented as usable only inside `Grid` or `Grid.Masonry`
- `Grid.Masonry`'s `children` type excludes the standard `HTMLAttributes["children"]` in favor of its own typed `children?: ReactNode` prop

---

## Component-Specific CSS & Tokens
- `--eink-grid-masonry-min-item-width` — custom property set inline per-instance by `Grid.Masonry`, driving the CSS `column-width` of `.eink-grid-masonry`
- `.eink-grid--gap-sm|md|xl` and `.eink-grid-masonry--gap-sm|md|xl` — BEM gap modifiers mapping to the `--eink-size-*` token scale

---

## Related Concepts
- [Card](../card/card.component.tsx) — commonly placed inside `Grid`/`Grid.Masonry` cells, as shown in its stories
- Flex (`src/components/flex/flex.component`) — source of the shared `FlexGap` type used for `gap`
