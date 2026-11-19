---
type: component
title: "Inverted"
description: "Scoped surface that swaps primary and secondary color tokens so nested components render white on black."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/inverted/inverted.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5-5" (2026-11-19T00:00:00Z)
reviewed_by: "user:pending"
---

# Inverted

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Re-maps `--eink-color-primary`, `--eink-color-secondary` and `--eink-color-background` inside its subtree
- Re-declares the composite `--eink-border-*` tokens, which the theme resolves at `:root` and which would otherwise stay black
- Works with every library component because they all read those tokens
- `active` toggles the inversion without changing the DOM structure

---

## Code Conventions
- BEM: `.eink-inverted`, `.eink-inverted--active`
- Uses only tokens (`--eink-color-overlay-white/black`, which are resolved at `:root` and therefore avoid self-referencing custom properties)

---

## Primary Use Cases
- Highlighting the current day column in a week view

---

## Limits & Restrictions
- 🚫 **No CSS Transitions / Animations**
- 🚫 **No Alpha Transparency**

---

## Related Concepts
- Library `theme.css` tokens
