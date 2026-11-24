---
type: component
title: "OrderList"
description: "Numbered list whose items are reordered with up/down buttons (no drag and drop)."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/order-list/order-list.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-11-24T00:00:00Z)
---

# OrderList

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Controlled list: `items` plus `onChange(newItems)`; generic over the item type with `getKey` and `renderItem`
- Up/down `Button.IconOutlined` per item; first item cannot move up, last cannot move down; `disabled` disables all
- `labels` overrides the accessible button names (default English "Move item N up/down")
- `renderSuffix` adds content after the buttons, e.g. a result `Pill` after checking an answer

---

## Code Conventions
- Built on `List as="ordered"` and `move` from `src/utils/array.utils.ts`
- BEM classes `.eink-order-list`, `__content`, `__controls`

---

## Primary Use Cases
- Ordering exercises, priority lists, step sequences on e-ink screens where drag and drop is impractical

---

## Limits & Restrictions
- Moves one position per click; no drag and drop
- Items must have stable unique keys
