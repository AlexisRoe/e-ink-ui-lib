---
type: component
title: "Title"
description: "Heading component covering h1–h6, with tag and font size selected via a single size prop."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/title/title.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (2026-09-14T18:19:01.260Z)
---

# Title

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Single `size` prop (`1`-`6`, default `1`) determines both the rendered heading tag (`<h1>`-`<h6>`) and its font size, keeping semantic level and visual size coupled by design
- Accepts all standard `HTMLAttributes<HTMLHeadingElement>`

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` to merge the base `eink-title` class, the size modifier (`eink-title--{size}`), and an optional consumer `className`
- BEM classes prefixed `eink-`: `.eink-title`, `.eink-title--1` through `.eink-title--6`
- Imports its own `title.component.css` directly
- Font sizes reference design tokens (`--eink-size-36`, `--eink-size-24`, `--eink-size-20`, `--eink-font-size-default`, `--eink-size-14`, `--eink-size-12`) rather than hardcoded literals
- JSDoc on `TitleSize`, `TitleProps`, and `Title`, including an `@example`

---

## Primary Use Cases
- Page, section, and subsection headings throughout the library and consuming apps, with a single component covering the full heading hierarchy

---

## Limits & Restrictions
- `size` only accepts the six numeric heading levels (`1`-`6`); there is no way to decouple the rendered tag from the visual size (e.g. an `<h2>` styled at `size={1}`'s font size) without overriding via `className`

---

## Related Concepts
- [Text](../text/text.component.tsx) — body-text counterpart to `Title`
- [Card](../card/card.component.tsx) — `Card.Title` renders a fixed `<h3>`, distinct from this component's configurable heading levels
