---
type: component
title: "Heatmap"
description: "Contribution-style grid with six intensity shades, selectable cells and an optional legend."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/heatmap/heatmap.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5-5" (2026-11-19T00:00:00Z)
reviewed_by: "user:pending"
---

# Heatmap

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Columns of cells (for example weeks) with shades from level 0 (empty) to level 5 (full)
- Cells are buttons with accessible labels; the selected cell gets a thick border
- Optional column labels, row labels and a legend

---

## Code Conventions
- BEM classes prefixed `eink-heatmap`; grey tokens express intensity
- Uses `cx()` for class merging

---

## Primary Use Cases
- Habit and completion history over weeks

---

## Limits & Restrictions
- 🚫 **No CSS Transitions / Animations**
- 🚫 **No Alpha Transparency**: shades are discrete grey tokens
- Does not compute levels; the caller maps data to levels

---

## Related Concepts
- Library `BarChart` and `ColumnChart` for aggregated data
