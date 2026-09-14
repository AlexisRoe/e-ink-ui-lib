---
type: component
title: "Divider"
description: "Full-width horizontal rule used to visually separate content."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/divider/divider.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (2026-09-14T18:19:01.260Z)
---

# Divider

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Renders a semantic `<hr>` element styled as a full-width horizontal rule
- Accepts all standard `HTMLAttributes<HTMLHRElement>`, so any native `hr` attribute/event handler can be passed through
- No variants or configurable props beyond `className` and native HTML attributes

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` to merge the base `eink-divider` class with an optional consumer `className`
- BEM class prefixed `eink-`: `.eink-divider`
- Imports its own `divider.component.css` directly
- JSDoc on the exported `DividerProps` type and the `Divider` function, including an `@example`

---

## Primary Use Cases
- Visually separating stacked content blocks (e.g. paragraphs, list sections, card content) with a plain horizontal rule

---

## Limits & Restrictions
- No configurable variants (color, thickness, style) are exposed as props — appearance is fixed by CSS
- The current `divider.component.css` hardcodes `border-top: 2px solid black` rather than referencing the design tokens (`--eink-color-*`, `--eink-border-*`) used elsewhere in this library; this is a deviation from this repo's CSS conventions worth flagging for follow-up, not a documented feature

---

## Related Concepts
- [Grid](../grid/grid.component.tsx) — layout component often used alongside dividers to separate grid sections
