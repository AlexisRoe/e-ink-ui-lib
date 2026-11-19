---
type: component
title: "TimeGrid"
description: "Vertical hour grid that positions blocks by start and duration, with now-marker and programmatic scrolling."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/time-grid/time-grid.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5-5" (2026-11-19T00:00:00Z)
reviewed_by: "user:pending"
---

# TimeGrid

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Hour rows between `startHour` and `endHour`, sized by `hourHeight`
- Blocks placed by start minute and duration, with a minimum height; overlaps are laid out in lanes
- Done blocks are greyed and struck through; emphasized blocks are inverted
- Optional now-marker and scrolling to a time whenever `scrollKey` changes

---

## Code Conventions
- BEM classes prefixed `eink-time-grid`; colors, borders and fonts come from tokens
- Only geometry (top/height/left/width) is applied through the `style` prop
- Uses `cx()` for class merging

---

## Primary Use Cases
- Day timelines of planners and calendars

---

## Limits & Restrictions
- 🚫 **No CSS Transitions / Animations**
- 🚫 **No Alpha Transparency**
- Blocks are interactive buttons; nested interactive content is not supported
- Differs from the library `Schedule`, which is a list without time geometry

---

## Related Concepts
- Library component `Schedule`
