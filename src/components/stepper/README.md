---
type: component
title: "Stepper"
description: "A horizontal row of equally-distributed, numbered steps that highlights the currently active step, e.g. for order/progress tracking."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/stepper/stepper.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (2026-09-14T18:19:01.260Z)
---

# Stepper

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Compound component: `Stepper` (container) and `Stepper.Item` (individual step)
- Automatically numbers each `Stepper.Item` by its position among siblings (1-indexed display) via `Children.map`/`cloneElement`, injecting `index`/`isActive` — consumers do not pass these themselves
- `currentIndex` highlights a specific step, falling back to `initialIndex` (default `0`) when `currentIndex` is not provided
- `fullWidth` (default `true`) stretches the stepper to 100% of its parent's width using an equal-column CSS grid; when `false` it renders as an inline grid sized to content
- Each `Stepper.Item` requires a `title` and accepts optional `children` as supporting detail text shown below the title

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` for className merging
- BEM classes prefixed `eink-`: `.eink-stepper`, `.eink-stepper--full-width`, `.eink-stepper-item`, `.eink-stepper-item--active`, `.eink-stepper-item__number`, etc.
- Imports its own `stepper.component.css`
- `Stepper.Item` is only meaningful as a direct child of `Stepper`, which injects positional `index`/`isActive` props via `cloneElement` — it is not designed for standalone use

---

## Primary Use Cases
- Order/shipment tracking (e.g. "Ordered" → "Packed" → "In transit" → "Delivered")
- Any linear multi-step process progress indicator where each step has a title and optional timestamp/detail

---

## Limits & Restrictions
- `Stepper.Item`'s `title` prop is required; `StepperItemProps` omits the native `title` HTML attribute (`Omit<HTMLAttributes<HTMLDivElement>, "title">`) since it's repurposed as the step heading
- Non-`Stepper.Item` children passed to `Stepper` are passed through unmodified by `Children.map` but won't receive numbering/active-state props, since only valid React elements are cloned
- Layout is a single equal-width row (CSS grid with `grid-auto-columns: 1fr`); it does not wrap to multiple rows or support a vertical orientation

---

## Component-Specific CSS & Tokens
- No new custom properties are introduced; consumes global tokens only (`--eink-border-medium`, `--eink-font-family-main`, `--eink-size-*`, `--eink-color-*`, `--eink-font-size-default`)

---

## Related Concepts
- None directly related within `src/components/`; `Stepper` is a standalone progress-tracking component
