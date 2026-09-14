---
type: component
title: "Text"
description: "Body text component rendered as a paragraph or inline span."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/text/text.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (2026-09-14T18:19:01.260Z)
---

# Text

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Renders `children` as a `<p>` by default, or a `<span>` via `as="span"` for inline copy
- Accepts all standard `HTMLAttributes` for both paragraph and span elements
- Inherits the surrounding font family (`font-family: inherit`) and uses the shared default font-size token

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` to merge the base `eink-text` class with an optional consumer `className`
- BEM class prefixed `eink-`: `.eink-text`
- Imports its own `text.component.css` directly
- Font-size in the CSS references the design token `--eink-font-size-default` rather than a hardcoded literal
- JSDoc on `TextAs`, `TextProps`, and `Text`, including an `@example`

---

## Primary Use Cases
- General body copy inside cards, states, or other components
- Inline text fragments (`as="span"`) mixed with other inline elements

---

## Limits & Restrictions
- Only two element types are supported (`"p"` or `"span"`); no other semantic tags (e.g. `label`, `strong`) are offered by this component
- No size/weight/color variant props — visual styling beyond the single `.eink-text` class is left to the consumer via `className`

---

## Related Concepts
- [Title](../title/title.component.tsx) — heading-level counterpart to `Text`
- [Quote](../quote/quote.component.tsx) — uses similar plain-paragraph styling for quoted text
