---
type: component
title: "Description"
description: "Labeled key-value pair rendering a small label above its value."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/description/description.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (2026-09-14T18:19:01.260Z)
---

# Description

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Renders a `label` (via the shared `Label` component) above a `value` (via the shared `Text` component).
- Both `label` and `value` accept `ReactNode`, so arbitrary markup (not just strings) can be passed.
- Adjacent `Description` instances (`.eink-description + .eink-description`) automatically get top margin spacing, so a stack of them reads as a list without extra wrapper markup.

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` for className merging.
- BEM classes prefixed `eink-`: block `.eink-description`, elements `.eink-description__label`, `.eink-description__value`.
- Imports its own stylesheet via `import "./description.component.css"`.
- Composes other library components (`Label`, `Text`) rather than rendering raw markup for its label/value.

---

## Primary Use Cases
- Displaying metadata fields such as "Updated: Today, 14:02", "Author: Jane Doe", or similar key-value summaries in detail views and sidebars.
- Stacking several `Description` instances to form a simple, readable definition list without a wrapping `<dl>`.

---

## Limits & Restrictions
- Both `label` and `value` are required props.
- Vertical spacing between stacked instances relies on the adjacent-sibling CSS selector, so `Description` elements must be direct siblings (not wrapped individually) to get the automatic spacing.

---

## Component-Specific CSS & Tokens
- No component-specific custom properties are defined beyond the global theme tokens (`--eink-size-4`, `--eink-size-24`, `--eink-color-grey-50`).

---

## Related Concepts
- `src/components/label/` — used to render the label text.
- `src/components/text/` — used to render the value text.
