---
type: component
title: "Space"
description: "Full-width vertical spacer, sized from the library's --eink-size-* token scale."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/space/space.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (2026-09-14T18:19:01.260Z)
---

# Space

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Renders a single full-width `<div>` whose height is one of the fixed `--eink-size-*` steps: `2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 36, 48, 64, 128`.
- `size` defaults to `16`.
- The chosen size is applied via an inline custom property (`--eink-space-size`) rather than a size-specific class, so any additional inline `style` passed in is merged rather than overwritten.

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` for className merging.
- BEM class prefixed `eink-`: block `.eink-space` only — no elements or modifiers, since sizing is handled entirely by the inline custom property.
- Imports its own stylesheet via `import "./space.component.css"`.
- `size` is restricted to a literal union type (`SpaceSize`) matching the exact `--eink-size-*` steps defined in the design tokens, rather than accepting an arbitrary number — never hardcodes a pixel value.

---

## Primary Use Cases
- Adding consistent vertical spacing between stacked elements/sections without introducing custom margin/padding CSS.
- Enforcing use of the design-token spacing scale rather than ad hoc spacing values throughout consuming applications.

---

## Limits & Restrictions
- `size` only accepts the specific numeric literals present in the `SpaceSize` union — arbitrary numbers are rejected at the type level.
- The spacer is always full-width and only affects vertical space (`height`); there is no horizontal/inline spacer variant.

---

## Component-Specific CSS & Tokens
- `--eink-space-size`: inline custom property set per instance to `var(--eink-size-<size>)`, consumed by `.eink-space`'s `height`. This is component-specific, layered on top of the global `--eink-size-*` scale tokens.

---

## Related Concepts
- Relies directly on the `--eink-size-*` scale defined in the global theme tokens (`src/components/theme/theme.css`).
