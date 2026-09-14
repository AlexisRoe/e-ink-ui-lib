---
type: component
title: "State"
description: "Full-width, full-height, centered placeholder screens for empty (State.Empty) and error (State.Error) states."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/state/state.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (pending)
---

# State

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Exported as a plain object namespace `State = { Empty, Error }` (not a compound component with static properties on a function)
- `State.Empty`: full-width/height, centered `Container` with a large `device-ipad-horizontal-search` icon, a required `title`, optional `subtitle`/`description`/`action`, and an outlined action button (`Button.Outlined`)
- `State.Error`: same layout with a `bug` icon and a filled action button (`Button`)
- Both variants share a private `BaseState` implementation that renders icon, `Title` (size 3), optional `Text` subtitle/description, and an optional `StateAction` (`{ label, onClick }`) button
- `withBorder` (default `true`) toggles the surrounding `Container`'s border
- Renders with `data-eink-component="state"` on the root `Container` for external targeting/testing

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` to merge the base `eink-state` class, the variant modifier (`eink-state--empty` / `eink-state--error`), and an optional consumer `className`
- BEM classes prefixed `eink-`: `.eink-state`, `.eink-state--empty`, `.eink-state--error`, `.eink-state__content`, `.eink-state__icon`, `.eink-state__title`, `.eink-state__subtitle`, `.eink-state__description`, `.eink-state__action`
- Imports its own `state.component.css` directly
- All sizes/colors in the CSS reference design tokens (`--eink-size-*`, `--eink-color-primary`, `--eink-color-grey-30`, `--eink-color-grey-40`) rather than hardcoded literals
- Composes existing components rather than reimplementing them: `Container` for the full-size centered wrapper, `Icon` for the illustration, `Title`/`Text` for typography, and `Button`/`Button.Outlined` for the action
- JSDoc on `StateAction`, `StateVariantProps`, `Empty`, `ErrorState`, and the `State` namespace, each with `@example`s

---

## Primary Use Cases
- Empty-list/empty-collection placeholders (`State.Empty`) with a call-to-action to add content
- Full-page or full-section error placeholders (`State.Error`) with a retry action

---

## Limits & Restrictions
- `title` is required on both variants; `subtitle`, `description`, and `action` are optional
- The choice of icon (`device-ipad-horizontal-search` for Empty, `bug` for Error) and action button variant (outlined vs. filled) is fixed per state type and not configurable via props
- `StateVariantProps` omits the native `title` HTML attribute (tooltip) since `title` is repurposed as the heading text

---

## Related Concepts
- [Container](../container/container.component.tsx) — provides the full-width/height, centered, bordered wrapper
- [Title](../title/title.component.tsx), [Text](../text/text.component.tsx) — typography used for the heading/subtitle/description
- [Pill](../pill/pill.component.tsx) — another status-communicating component, better suited to compact inline indicators than full-page placeholders
