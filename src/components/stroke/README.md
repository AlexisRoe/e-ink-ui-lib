---
type: component
title: "Stroke"
description: "A minimal typography component that renders its text content with a line-through (strikethrough) decoration."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/stroke/stroke.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (pending)
---

# Stroke

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Renders an inline `<span>` with `text-decoration-line: line-through` applied to its children.
- Inherits font family and color from its surrounding context (`font-family: inherit; color: inherit;`), so it adapts to whatever text it's placed within.
- Accepts standard `HTMLAttributes<HTMLSpanElement>`, so any native span prop (e.g. `style`, `id`) can be passed through.

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` for className merging on the root `<span>`.
- BEM class prefixed `eink-`: `.eink-stroke` (single block class, no elements/modifiers).
- Imports its own `stroke.component.css` directly.
- Purely presentational — no internal state, props beyond standard HTML attributes, or context.

---

## Primary Use Cases
- Showing a superseded/original price next to a discounted price, as in its own story (`The original price was <Stroke>$49.99</Stroke> and is now $29.99.`).
- Marking any inline text as no-longer-valid/crossed-out (e.g. "no longer available", completed to-do items).

---

## Limits & Restrictions
- No component-specific restrictions beyond standard theme token usage — this is intentionally the simplest possible typography wrapper.

---

## Related Concepts
- `../price/README.md` — commonly paired with `Stroke` to show a crossed-out original price next to a current one.
