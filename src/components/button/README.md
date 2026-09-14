---
type: component
title: "Button"
description: "Family of button variants (filled, outlined, naked, and their icon-only counterparts) for e-ink interfaces, with size, full-width, loading, and mono-disabled options."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/button/button.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (pending)
---

# Button

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- `Button` (filled: black background, white label, inverts on press) plus static variants `Button.Outlined` (transparent with 2px border, inverts on press), `Button.Naked` (no background/border, inverts on press), `Button.Icon`, `Button.IconOutlined`, `Button.IconNaked` (icon-only equivalents)
- Three sizes (`ButtonSize`: `"sm" | "md" | "xl"`, default `"md"`), each with its own padding/font-size and icon pixel size (14/16/24px)
- Optional `iconLeft` or `iconRight` (text variants only) — mutually exclusive at the type level via `ButtonIconSlotProps`
- `fullWidth` option (text `Button`/`Button.Outlined` only) to stretch to the container width
- `loading` state (text `Button`/`Button.Outlined` only) that shows an `hourglass-high` icon in place of any left/right icon, flipping 180 degrees every `flipIntervalMs` (default 2000ms) via a plain inline-style toggle (not a CSS transition/animation, since those are disabled globally by the theme); disables the button by default while loading unless `disabled` is explicitly set
- `disabled` state (native HTML `disabled` attribute) with a greyed-out look by default, or `mono` to render disabled buttons in black-and-white with a diagonal-stripe overlay instead
- Icon-only variants require an accessible `aria-label` (enforced by `IconButtonProps`)

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` to build every variant's class list (base classes plus conditional modifiers)
- BEM classes prefixed `eink-`: block `.eink-button`, elements `.eink-button__label`, `.eink-button__icon`; modifiers `.eink-button--filled`, `--outlined`, `--naked`, `--icon`, `--sm`/`--md`/`--xl`, `--full-width`, `--loading`, `--mono`
- Imports its own stylesheet via `import "./button.component.css"`
- Shares icon rendering with the `Icon` component (`src/components/icons/icon.tsx`) rather than reimplementing icon markup
- Additional variants are exposed as static properties on `Button` (`Button.Outlined`, `Button.Naked`, `Button.Icon`, `Button.IconOutlined`, `Button.IconNaked`) rather than as separate exported components
- The disabled-`mono` diagonal stripe is painted via a `::after` pseudo-element using `mask-image` (not `background-image`), because the global theme forces `background-image: none !important` on every element

---

## Primary Use Cases
- Primary/secondary/tertiary actions in forms and toolbars (`Button`, `Button.Outlined`, `Button.Naked`)
- Icon-only controls such as delete/close/navigation actions where a label isn't needed but accessibility must be preserved (`Button.Icon` family)
- Asynchronous actions (save, submit, sync) that need a visible in-progress state via `loading`
- Full-width call-to-action buttons in narrow/vertical layouts via `fullWidth`

---

## Limits & Restrictions
- `iconLeft` and `iconRight` cannot both be supplied — enforced as a compile-time error by `ButtonIconSlotProps`
- `fullWidth`, `loading`, and `flipIntervalMs` are only available on `Button` and `Button.Outlined`, not on `Button.Naked` or the icon-only variants
- Icon-only variants (`Button.Icon`, `Button.IconOutlined`, `Button.IconNaked`) require `icon` and `aria-label`; there is no `iconLeft`/`iconRight` slot on them
- `mono` only has a visible effect when the button is also `disabled`
- `size` is restricted to `ButtonSize` (`"sm" | "md" | "xl"`)

---

## Component-Specific CSS & Tokens
- No custom properties beyond the global theme tokens (`--eink-color-*`, `--eink-border-medium`, `--eink-size-*`, `--eink-font-size-default`) are defined
- Modifier classes of note: `.eink-button--mono:disabled` (diagonal-stripe disabled look via masked `::after`), `.eink-button--loading` (sets `cursor: progress`), `.eink-button--full-width`, `.eink-button--icon` (adjusts padding/gap per size for icon-only layout)

---

## Related Concepts
- `src/components/icons/icon.tsx` — renders the icons used by all icon-bearing button variants
