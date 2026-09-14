---
type: component
title: "Flex"
description: "display:flex layout container with token-based gap, direction, justify/align, wrap, and inline options."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/flex/flex.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (pending)
---

# Flex

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Renders a `<div>` with `display: flex` (or `inline-flex` via the `inline` prop)
- Direction defaults to row; `column` switches to column layout — `row` and `column` are mutually exclusive at the type level (`FlexDirectionProps`)
- `justify` (`FlexJustify`: `"start" | "center" | "end" | "space-between" | "space-around" | "space-evenly"`) maps to `justify-content` via inline style
- `align` (`FlexAlign`: `"start" | "center" | "end" | "stretch" | "baseline"`) maps to `align-items` via inline style
- Token-based `gap` (`FlexGap`: `"sm" | "md" | "xl"`, defaults to `"md"`) drawn from the `--eink-size-*` scale
- `wrap` toggles `flex-wrap: wrap` (defaults to `false`)
- Accepts and passes through all standard `<div>` HTML attributes, merging any custom `style` with the computed `justifyContent`/`alignItems`

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` to merge the base/gap classes with the `--column`, `--wrap`, `--inline` modifiers and any consumer `className`
- BEM classes prefixed `eink-`: block `.eink-flex`, modifiers `.eink-flex--column`, `.eink-flex--wrap`, `.eink-flex--inline`, `.eink-flex--gap-sm`/`-md`/`-xl`
- Imports its own stylesheet via `import "./flex.component.css"`
- `justify`/`align` are applied as inline styles (mapped from friendly prop values to raw CSS values via `JUSTIFY_MAP`/`ALIGN_MAP`) rather than as additional CSS classes, since they have many combinations and no e-ink-specific behavior

---

## Primary Use Cases
- General-purpose layout container for arranging children in a row or column with consistent, token-based spacing (e.g. button groups, toolbars, form field stacks)
- Building block for other components/layouts that need `justify-content`/`align-items` control without hand-writing flex CSS

---

## Limits & Restrictions
- `row` and `column` cannot both be supplied — enforced as a compile-time error by `FlexDirectionProps`
- `gap` is restricted to the `FlexGap` token scale (`"sm" | "md" | "xl"`) — arbitrary gap values aren't supported through the prop (though `style`/`className` can still override)

---

## Component-Specific CSS & Tokens
- No custom properties beyond the global theme's `--eink-size-*` scale are defined; the gap modifiers map directly to `--eink-size-8` (sm), `--eink-size-16` (md), `--eink-size-24` (xl)

---

## Related Concepts
- `src/components/grid/` — the analogous `display: grid` layout container; `FlexGap` is documented as shared between `Flex` and `Grid`
