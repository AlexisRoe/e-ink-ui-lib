---
type: component
title: "Card"
description: "Bordered, padded container with composable Header, Title, Subtitle, Content, Action, and Ribbon sub-components."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/card/card.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (2026-09-14T18:19:01.260Z)
---

# Card

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Compound-component pattern: `Card`, `Card.Header`, `Card.Title`, `Card.Subtitle`, `Card.Content`, `Card.Action`, `Card.Ribbon`
- `Card.Header` automatically splits its children into a left-aligned text group (`Card.Title`/`Card.Subtitle`) and a right-aligned action group (any `Card.Action` children), detected via `Children.toArray` + `isValidElement`
- `Card.Action` is a thin wrapper around the `Button` component and accepts every `ButtonProps` (`onClick`, `iconLeft`/`iconRight`, `size`, `fullWidth`, `loading`, `disabled`, etc.)
- `Card.Ribbon` renders a small badge overlapping the card's top-right corner (e.g. "New")
- Automatic spacing is added between `Card.Header` and `Card.Content` only when a header immediately precedes content (via the `.eink-card__header + .eink-card__content` CSS sibling selector)
- All sub-components accept standard `HTMLAttributes` for their respective element and forward `className`/other props

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` in every sub-component to merge base BEM classes with an optional consumer `className`
- BEM classes prefixed `eink-`: `.eink-card`, `.eink-card__header`, `.eink-card__title`, `.eink-card__subtitle`, `.eink-card__content`, `.eink-card__ribbon`
- Imports its own `card.component.css` directly
- Reuses the existing `Button` component/`ButtonProps` for `Card.Action` rather than reimplementing button styling
- Sub-components are attached as static properties on the exported `Card` function (`Card.Header = Header`, etc.)
- JSDoc on every exported prop type and sub-component, with an `@example` on the main `Card` export

---

## Primary Use Cases
- Grouping a title, subtitle, optional header action button, and body content into a bordered panel (e.g. report summaries, list items in a dashboard)
- Bare containers with arbitrary children when the header/content structure isn't needed
- Flagging a card as new/featured via `Card.Ribbon`

---

## Limits & Restrictions
- `Card.Header`'s left/right split only recognizes children whose element type is exactly `Card.Action`; other elements are always treated as header text
- Automatic header-to-content spacing relies on `Card.Header` and `Card.Content` being adjacent DOM siblings — if other markup separates them, the CSS adjacent-sibling rule (`.eink-card__header + .eink-card__content`) will not apply and spacing falls to the consumer
- No required props; `Card` and its sub-components accept arbitrary children

---

## Related Concepts
- [Button](../button/button.component.tsx) — used directly by `Card.Action`
- [Title](../title/title.component.tsx), [Text](../text/text.component.tsx) — typographic building blocks that could substitute for `Card.Title`/`Card.Content` in custom layouts
