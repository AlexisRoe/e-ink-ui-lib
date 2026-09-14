---
type: component
title: "Segmented"
description: "Row of mutually-exclusive segmented control items, highlighting the selected one and reporting clicks via onChange."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/segmented/segmented.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (2026-09-14T18:19:01.260Z)
---

# Segmented

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- `Segmented` renders a `<nav>` containing a `<ul>` of `Segmented.Item` buttons, tracking which one is currently selected via an internal React context (not exported as part of the public API).
- `defaultId` sets which item's `id` is highlighted on first render.
- `fullWidth` stretches the control to 100% width with segments evenly distributed (via CSS grid, `grid-auto-columns: 1fr`).
- `onChange(id)` is called with the clicked item's `id` whenever a segment is selected.
- Each `Segmented.Item` sets `aria-pressed` to reflect selection state.

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` for className merging.
- BEM classes prefixed `eink-`: block `.eink-segmented`, elements `.eink-segmented__list`, `.eink-segmented__item-wrapper`, `.eink-segmented__item`, modifiers `.eink-segmented--full-width`, `.eink-segmented__item--selected`.
- Imports its own stylesheet via `import "./segmented.component.css"`.
- `SegmentedItem` is attached to `Segmented` as `Segmented.Item` for compound-component usage, and reads its selected/click behavior from `Segmented`'s internal context rather than accepting selection state as its own props.

---

## Primary Use Cases
- Switching between mutually-exclusive views or ranges (e.g. Day/Week/Month/Year) in dashboards, calendars, or filters.
- Any tab-like control where exactly one option is active at a time and a full-width, evenly distributed layout is preferred over a `Tabs` component (see `src/components/tabs/`).

---

## Limits & Restrictions
- `Segmented.Item` can only be used inside a `Segmented` — it reads its selected/click behavior via context and has no standalone behavior outside that context.
- `onChange` is the only prop on `SegmentedProps` that is excluded/redefined from the native `HTMLAttributes<HTMLElement>` (`onChange` is otherwise not a native attribute on `<nav>`, but is explicitly typed here).
- Selection state is uncontrolled internally (`useState`) seeded once from `defaultId`; there is no controlled `value` prop to drive selection from outside after mount.

---

## Component-Specific CSS & Tokens
- No component-specific custom properties are defined beyond global theme tokens (`--eink-size-*`, `--eink-color-primary`, `--eink-color-secondary`, `--eink-border-medium`, `--eink-font-size-default`).

---

## Related Concepts
- `src/components/tabs/` — an alternative pattern for switching between mutually-exclusive views.
