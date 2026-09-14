---
type: component
title: "DropdownMenu"
description: "A trigger button that opens a menu of grouped, optionally-nested, selectable actions below it."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/dropdown-menu/dropdown-menu.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (pending)
---

# DropdownMenu

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Compound component: `DropdownMenu`, `DropdownMenu.Item`, and `DropdownMenu.Group`
- Trigger is a `Button` (from `src/components/button/`) showing `label`, with a chevron-up/chevron-down icon reflecting open state
- `DropdownMenu.Item` rows support an optional leading `icon` (`IconName`), a trailing key-combination hint (`keys`), a `disabled` state, and a `mono` diagonal-stripe rendering for disabled items
- Items can nest further `DropdownMenu.Item` children to become a submenu that flies out to the side; the fly-out `side` ("left" | "right") auto-flips based on viewport overflow, or can be forced via the `side` prop
- `DropdownMenu.Group` groups items under an optional filled heading `label`, separated from other groups by a divider
- Closes on outside click and on `Escape` (both for the top-level menu and open submenus)
- Reports the chosen item's `id` via `onSelect`
- Uses React Context (`DropdownMenuContext`) internally to pass `onSelect`/`closeAll` down to nested items

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` for all conditional className merging
- BEM classes prefixed `eink-`: `.eink-dropdown-menu`, `.eink-dropdown-menu__list`, `.eink-dropdown-menu-item`, `.eink-dropdown-menu-item__row`, `.eink-dropdown-menu-group`, etc.
- Imports its own `dropdown-menu.component.css`
- Reuses the shared `Button` and `Icon` components rather than reimplementing a trigger button or icon rendering
- ARIA menu semantics: `role="menu"`/`role="menuitem"`/`role="group"`/`role="none"`, `aria-haspopup`, `aria-expanded` — with `biome-ignore` comments explaining the deliberate non-interactive-to-interactive role usage for `ul`/`fieldset` semantics

---

## Primary Use Cases
- Toolbar or header "Actions" menus (edit/duplicate/share/delete style action lists)
- Grouped context menus with a labeled section header (e.g. "Document", "Danger zone")
- File-menu style nested actions (e.g. "Share" flying out to "Copy link" / "Email")
- Menus with a mix of enabled/disabled items, optionally shown with a diagonal-stripe disabled treatment for higher e-ink contrast legibility

---

## Limits & Restrictions
- `DropdownMenuProps.onSelect` type omits the native `onSelect` HTML attribute (`Omit<HTMLAttributes<HTMLDivElement>, "onSelect">`) since the prop is repurposed for item selection
- `DropdownMenu.Item`'s `children` prop serves double duty: non-`DropdownMenu.Item` children become the row label, while nested `DropdownMenu.Item` children become a submenu — an item cannot have a plain-text label containing further generic React children distinguished any other way
- `keys` hint is not rendered when the item has a submenu (`hasSubmenu` takes priority over `keys` in the row's trailing content)
- Requires DOM (`document`) event listeners for outside-click/Escape handling, so it only functions correctly client-side

---

## Component-Specific CSS & Tokens
- No new custom properties are introduced; consumes existing global tokens (`--eink-z-index-modal`, `--eink-size-*`, `--eink-border-medium`, `--eink-border-thin`, `--eink-color-*`, `--eink-font-size-default`)
- The disabled `mono` variant (`.eink-dropdown-menu-item__row--mono`) reuses the masked `::after` diagonal-stripe technique documented in the CSS as matching the disabled `mono` Button variant

---

## Related Concepts
- `src/components/button/` — used internally as the trigger button
- `src/components/icons/` — used internally for item icons and submenu chevrons
