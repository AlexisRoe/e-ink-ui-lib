---
type: component
title: "Highlight"
description: "Marks a run of text as highlighted using the semantic <mark> element, with a light grey background or a mono wave-underline variant."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/highlight/highlight.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (2026-09-14T18:19:01.260Z)
---

# Highlight

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Renders children inside a semantic `<mark>` element
- Default style applies a light grey background (`--eink-color-grey-90`)
- `mono` prop (default `false`) switches to a transparent background with a wavy underline instead, for monochrome/mono contexts where background contrast isn't reliable
- Extends `HTMLAttributes<HTMLElement>`, so native attributes pass through

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` to merge base, modifier (`--mono`/`--background`), and consumer `className`
- BEM classes prefixed `eink-`: `.eink-highlight`, `.eink-highlight--background`, `.eink-highlight--mono`
- Imports its own `highlight.component.css`
- Inherits font-family and color from its surrounding context (`font-family: inherit; color: inherit;`) rather than imposing its own typography

---

## Primary Use Cases
- Emphasizing a phrase or term within body text/paragraphs
- Providing a highlight style that remains legible on e-ink screens when a flat background wash isn't desirable (via `mono`)

---

## Limits & Restrictions
- No required props; `children` is expected but not enforced by a dedicated required-prop type beyond the base `HTMLAttributes`
- The `--background` and `--mono` modifiers are mutually exclusive at render time (`!mono` vs `mono`), so only one visual treatment is ever applied

---

## Component-Specific CSS & Tokens
- No new custom properties are defined; the component consumes only global theme tokens (`--eink-color-grey-90`, `--eink-color-primary`, `--eink-border-width-medium`, `--eink-size-4`)

---

## Related Concepts
- None directly related within `src/components/`; `Highlight` is a standalone typography component
