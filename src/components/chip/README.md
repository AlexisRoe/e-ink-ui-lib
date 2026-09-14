---
type: component
title: "Chip"
description: "Toggleable, pill-shaped filter button that works standalone or inside a Chip.Group for single- or multi-select filtering, with optional Form binding."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/chip/chip.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (2026-09-14T18:19:01.260Z)
---

# Chip

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Renders as a native `<button>` with `aria-pressed` reflecting selected state, plus an optional leading icon
- Two usage modes:
  - **Standalone** — controlled via `selected`/`onSelect`, or uncontrolled via `defaultSelected`
  - **Grouped** — nested in `Chip.Group` with a unique `value`; the group tracks which chip(s) are selected via React context (`ChipGroupContext`)
- `Chip.Group` supports single-select (default) or multi-select (`multiple` prop), laid out as a wrapping flex row
- `Chip.Group` can bind to an enclosing `<Form>` via its `name` prop (reads/writes through `FormContext`), or be used standalone with `value`/`onChange` (controlled) or `defaultValue` (uncontrolled)
- `disabled` can be set per-chip or for an entire group (`Chip.Group`'s `disabled` prop disables every chip inside it)

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` to merge base classes with the `eink-chip--selected` modifier and any consumer `className`
- BEM classes prefixed `eink-`: block `.eink-chip`, elements `.eink-chip__icon`, `.eink-chip__label`, modifier `.eink-chip--selected`; the group uses its own block `.eink-chip-group`
- Imports its own stylesheet via `import "./chip.component.css"`
- Reuses the shared `Icon` component (`src/components/icons/icon.tsx`) for the optional leading icon
- Integrates with the library's form system via `FormContext` from `src/components/form/form.context.ts`
- Exposes the group as a static property, `Chip.Group`, rather than a separately exported component

---

## Primary Use Cases
- Filter bars where a user picks one category from a set (single-select `Chip.Group`)
- Multi-select tag/label pickers (`Chip.Group multiple`)
- Standalone toggle chips such as a "Favorite" marker
- Chip groups bound directly to a `<Form>` field via `name`, e.g. a `status` filter field

---

## Limits & Restrictions
- `value` on `Chip` is required when nested in a `Chip.Group` (used to identify the chip); it is ignored for standalone use
- When `Chip.Group` has a `name` and is inside a `<Form>`, its own `value`/`onChange` props are ignored — the form context is the source of truth
- `Chip`'s own `onSelect` is ignored when the chip is inside a `Chip.Group`, since the group reports selection through its own `onChange`/form binding instead
- `value`/`defaultValue` on `Chip.Group` is a single `string` when `multiple` is false, and a `string[]` when `multiple` is true

---

## Component-Specific CSS & Tokens
- No custom properties beyond the global theme tokens (`--eink-color-*`, `--eink-border-medium`, `--eink-size-*`, `--eink-font-size-default`) are defined
- Modifier class of note: `.eink-chip--selected` (inverts background/text color); combined with `:disabled` it uses a distinct greyed-out selected color

---

## Related Concepts
- `src/components/form/form.context.ts` — provides the `FormContext` that `Chip.Group` binds to via its `name` prop
- `src/components/icons/icon.tsx` — renders the chip's optional leading icon
