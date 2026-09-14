---
type: component
title: "Navigation"
description: "List of navigation entries laid out vertically or horizontally, with nested items opening inline or flyout submenus and full roving-tabindex keyboard support."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/navigation/navigation.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (pending)
---

# Navigation

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- `NavigationOrientation` (`"vertical" | "horizontal"`, defaults to `"vertical"`) controls the top-level list layout, exposed as `role="menu"` (vertical) or `role="menubar"` (horizontal)
- `Navigation.Item` entries with a `label`, optional `icon`, and a `target` string passed to `onSelect` on click
- Nesting `Navigation.Item` children inside another item turns it into a submenu trigger instead of a navigable leaf: in the vertical orientation, submenus unfold inline (indented, `role="menu"`) below their trigger; in the horizontal orientation, top-level submenus open as an absolutely-positioned dropdown flyout
- Full roving-tabindex keyboard navigation: the orientation's forward/backward arrow keys move between siblings (wrapping), the perpendicular arrow key opens a submenu, `Home`/`End` jump to first/last item, `Escape` or the closing arrow key closes an open submenu and refocuses its trigger
- Closes an open submenu on outside click or on blur outside the item
- `withBorder` (default `true`), `withBackground` (default `false`, transparent otherwise), and `fullWidth` (default `true`) toggle the outer `<nav>` container's appearance

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` to build the root `<nav>`'s class list and the item trigger/submenu modifier classes
- BEM classes prefixed `eink-`: block `.eink-navigation`, elements `__list`; the item is its own block `.eink-navigation-item` with elements `__trigger`, `__icon`, `__label`, `__chevron`, `__submenu`, `__submenu-list`; modifiers `.eink-navigation--vertical`/`--horizontal`, `--no-border`, `--with-background`, `--full-width`, `.eink-navigation-item__trigger--open`, `.eink-navigation-item__submenu--inline`
- Imports its own stylesheet via `import "./navigation.component.css"`
- Reuses the shared `Icon` component (`src/components/icons/icon.tsx`) for item icons and submenu chevrons
- Uses React Context (`NavigationContext` for `onSelect`/root orientation, `NavigationListContext` for the current list's orientation) to coordinate nested items and lists instead of prop drilling
- Injects internal-only props (`__navIndex`, `__tabIndex`, `__onFocus`) into cloned `Navigation.Item` elements via `cloneElement` to implement roving tabindex
- Exposes `Navigation.Item` as a static property on `Navigation` rather than a separate exported component
- Uses a `biome-ignore lint/a11y/noStaticElementInteractions` comment on the submenu wrapper `<div>`, since it exists only to host the submenu's own Escape/close-key handling

---

## Primary Use Cases
- Primary app/site navigation menus, either a vertical sidebar or a horizontal top nav bar
- Menus with grouped/nested destinations (e.g. a "Products" item expanding to "New"/"Archived") that need accessible submenu semantics
- Any list of destinations where clicking reports a `target` string (e.g. a route) back to the consumer via `onSelect`, leaving actual routing to the caller

---

## Limits & Restrictions
- `Navigation.Item` can only be used inside `Navigation` — it reads `target` and orientation from `Navigation`'s context and has no standalone behavior
- An item with nested `Navigation.Item` children always opens a submenu on click instead of calling `onSelect`, even if a `target` is also supplied
- `children` is required on `Navigation`
- `orientation` is restricted to `NavigationOrientation` (`"vertical" | "horizontal"`)

---

## Component-Specific CSS & Tokens
- No custom properties beyond global theme tokens are defined (`--eink-color-*`, `--eink-border-*`, `--eink-size-*`, `--eink-font-size-default`, `--eink-z-index-modal`)
- Notable structural classes: `.eink-navigation-item__submenu` (absolutely positioned flyout using `--eink-z-index-modal`) vs. `.eink-navigation-item__submenu--inline` (static, indented, top-bordered for the vertical inline case); nested-submenu positioning rules for horizontal vs. vertical orientations

---

## Related Concepts
- `src/components/icons/icon.tsx` — renders item icons and submenu chevrons
- `src/components/pagination/` — another navigation-adjacent component for paged content, distinct from this menu-style `Navigation`
