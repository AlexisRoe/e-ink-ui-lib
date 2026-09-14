---
type: component
title: "Center"
description: "A flex container that centers its children both horizontally and vertically, with optional full-width/full-height stretching."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/center/center.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (2026-09-14T18:19:01.260Z)
---

# Center

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Renders a `<div>` with `display: flex; align-items: center; justify-content: center` to center its children
- `fullWidth` prop stretches the container to 100% width of its parent (default `false`)
- `fullHeight` prop stretches the container to 100% height of its parent (default `false`)
- Extends standard `HTMLAttributes<HTMLDivElement>`, so any native div prop (e.g. `style`, `id`, event handlers) can be passed through

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` to merge the base class, modifier classes, and any consumer-supplied `className`
- BEM classes prefixed `eink-`: `.eink-center`, `.eink-center--full-width`, `.eink-center--full-height`
- Imports its own `center.component.css`
- Spreads `...rest` onto the rendered `<div>` after extracting `className`, `fullWidth`, `fullHeight`

---

## Primary Use Cases
- Centering empty-state content (e.g. "Nothing here yet" messaging) inside a panel or page
- Vertically/horizontally centering a single child (icon, text, spinner) within a bounded or full-size container
- Building simple layout scaffolding without writing one-off flex CSS

---

## Limits & Restrictions
- Purely a layout primitive: it does not manage spacing, wrapping, or multiple-child alignment beyond centering — for anything more complex, compose with other layout components
- `fullWidth`/`fullHeight` only take effect if the parent element provides a defined width/height to stretch into

---

## Related Concepts
- `src/components/container/` — another layout primitive for wrapping content
