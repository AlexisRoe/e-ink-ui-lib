---
type: component
title: "Container"
description: "A generic bordered enclosing container with fixed padding and optional full-width/full-height/centered layout behavior."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/container/container.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (2026-09-14T18:19:01.260Z)
---

# Container

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Renders a `<div>` with fixed `2px` (`--eink-size-2`) padding on all sides
- `withBorder` renders a border around the container using `--eink-border-medium` (default `true`)
- `fullWidth`/`fullHeight` stretch the container to 100% of its parent along either axis (default `false`)
- `centered` centers children both horizontally and vertically via flexbox (default `false`)
- Extends `HTMLAttributes<HTMLDivElement>`, so native div props pass through
- Sets `data-eink-component="container"` on the rendered element

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` to merge the base class, modifier classes, and consumer-supplied `className`
- BEM classes prefixed `eink-`: `.eink-container`, `.eink-container--border`, `.eink-container--full-width`, `.eink-container--full-height`, `.eink-container--centered`
- Imports its own `container.component.css`
- Spreads `...rest` onto the rendered `<div>` after extracting known props

---

## Primary Use Cases
- Wrapping arbitrary content in a bordered box (e.g. a card-like panel) with the library's token-based border and spacing
- Building simple page sections that need to stretch to fill available width/height
- Centering a single piece of content without writing separate flex CSS (alternative to `Center` when a border/padding is also wanted)

---

## Limits & Restrictions
- No notable restrictions in the source beyond standard HTML div attributes; all props are optional with documented defaults

---

## Component-Specific CSS & Tokens
- No component-specific custom properties are defined; `container.component.css` consumes global theme tokens only (`--eink-size-2`, `--eink-border-medium`)
- Modifier classes (`--border`, `--full-width`, `--full-height`, `--centered`) are purely BEM modifiers, not custom properties

---

## Related Concepts
- `src/components/center/` — a lighter-weight, borderless centering primitive with the same `fullWidth`/`fullHeight` concept
