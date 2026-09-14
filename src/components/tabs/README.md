---
type: component
title: "Tabs"
description: "Full-width tab row (built on Segmented) with a Card-like content panel below it, showing the panel that matches the selected tab's id."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/tabs/tabs.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (2026-09-14T18:19:01.260Z)
---

# Tabs

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Composes `Segmented`/`Segmented.Item` for the tab row (`Tabs.Item` is literally an alias of `Segmented.Item`) and renders a `Card`-styled `Tabs.Content` panel below it, flush against the tab row (no gap, shared border).
- Sorts its children at render time using `Children.forEach`/`isValidElement`, splitting `Tabs.Item`s (used for the tab row) from `Tabs.Content` panels (matched to the active tab by `id`), so `Tabs.Item` and `Tabs.Content` elements can be interleaved as children.
- `defaultId` selects which tab is active on first render, defaulting to the first `Tabs.Item`'s `id` if omitted.
- `onChange(id)` is called whenever a different tab is clicked.
- `fullHeight` makes the component and its active content panel fill the available height of its parent (content becomes scrollable via `overflow: auto`).

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` for className merging.
- BEM classes prefixed `eink-`: block `.eink-tabs`, element `.eink-tabs__content`, modifier `.eink-tabs--full-height`.
- Imports its own stylesheet via `import "./tabs.component.css"`.
- Reuses existing components rather than reimplementing: `Segmented`/`Segmented.Item` for the tab row, `Card` for the content panel styling.
- `Tabs.Item` and `Tabs.Content` are attached to `Tabs` as static properties for compound-component usage; `TabsItemProps` is exported as a type alias of `SegmentedItemProps`.

---

## Primary Use Cases
- Sectioned views where each tab shows a distinct panel of content below a shared full-width tab row (e.g. Overview/Details/History on an account page).
- Full-height tabbed layouts (dashboards, detail screens) via `fullHeight`, where the active panel should scroll independently while the tab row stays fixed.

---

## Limits & Restrictions
- Only direct children of type `Segmented.Item` (via `Tabs.Item`) and `TabsContent` (via `Tabs.Content`) are recognized — other children are silently ignored by the `Children.forEach` filtering.
- Tab/content matching is by string `id`; a `Tabs.Content` with no matching active `Tabs.Item` id simply renders nothing.
- Selection state is internal (`useState`) seeded from `defaultId`/first item — there is no controlled `value` prop to drive the active tab from outside after mount.

---

## Component-Specific CSS & Tokens
- No component-specific custom properties are defined; layout relies on the global theme tokens (indirectly, via the composed `Segmented`/`Card` components) and plain flex/overflow rules for the `fullHeight` variant.

---

## Related Concepts
- `src/components/segmented/` — provides the tab row (`Segmented`, `Segmented.Item`) that `Tabs` builds on.
- `src/components/card/` — provides the styling for `Tabs.Content` panels.
