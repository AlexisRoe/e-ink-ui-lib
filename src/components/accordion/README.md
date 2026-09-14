---
type: component
title: "Accordion"
description: "A collapsible group of sections, built on native <details>/<summary>, where only one item is open at a time."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/accordion/accordion.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (pending)
---

# Accordion

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- `Accordion` groups `Accordion.Item` children via React context and keeps only one item open at a time; opening an item closes any other open item.
- `Accordion.Item` can also be rendered standalone (outside an `Accordion`), in which case it manages its own open/closed state independently.
- `defaultOpenId` on `Accordion` selects which item is open on first render; if omitted (or no item matches), it falls back to the first item with `openByDefault` set.
- `openByDefault` on `Accordion.Item` only takes effect when the item is rendered standalone or used as the fallback-selection signal inside an `Accordion`.
- Uses the native `<details>`/`<summary>` elements, with click handling on the summary intercepted to drive the controlled `open` state.
- Displays a `plus`/`minus` icon (via the shared `Icon` component) that reflects open/closed state.

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` for className merging on both `Accordion` and `Accordion.Item`.
- BEM classes prefixed `eink-`: `.eink-accordion`, `.eink-accordion-item`, `.eink-accordion-item__summary`, `.eink-accordion-item__summary-text`, `.eink-accordion-item__icon`, `.eink-accordion-item__content`.
- Imports its own `accordion.component.css` directly.
- Uses the shared `Icon` component from `src/components/icons/icon.tsx` for the expand/collapse indicator.
- `Accordion.Item` is attached as a static property (`Accordion.Item = AccordionItem`) rather than exported separately.

---

## Primary Use Cases
- FAQ-style sections where only one answer should be visible at a time.
- Grouped, collapsible product/order details (e.g. shipping, returns, warranty) as shown in its stories.
- Standalone collapsible content blocks that don't need coordination with siblings (using `Accordion.Item` alone).

---

## Limits & Restrictions
- Inside an `Accordion`, an item's own `openByDefault` prop is ignored for direct display — the `Accordion`'s `defaultOpenId` takes precedence; `openByDefault` on child items only affects the fallback selection when `defaultOpenId` doesn't match anything.
- Only one item can be open at a time within a given `Accordion`; there is no "expand all" mode.
- No component-specific restrictions beyond standard theme token usage.

---

## Related Concepts
- `../icons/icon.tsx` — provides the `plus`/`minus` icon used for the expand/collapse indicator.
