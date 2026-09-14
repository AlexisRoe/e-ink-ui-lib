---
type: component
title: "BreadCrumbs"
description: "A page navigation trail that renders a home icon and a series of clickable steps separated by slashes."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/breadcrumbs/breadcrumbs.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (pending)
---

# BreadCrumbs

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- `BreadCrumbs` renders a `<nav>` containing an ordered list of `BreadCrumbs.Item` children.
- Automatically prepends a `home` icon to the first item.
- Renders a `/` separator (via `.eink-breadcrumbs__separator`) between items after the first.
- Each item is a clickable `<button>`; clicking it calls the optional `onNavigate` callback with that item's `target` string.
- Filters children to only render actual `BreadCrumbs.Item` elements (via `Children.toArray` + `isValidElement` type check), ignoring anything else passed as children.

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` for className merging on the root `<nav>`.
- BEM classes prefixed `eink-`: `.eink-breadcrumbs`, `.eink-breadcrumbs__list`, `.eink-breadcrumbs__item-wrapper`, `.eink-breadcrumbs__separator`, `.eink-breadcrumbs__item`, `.eink-breadcrumbs__icon`.
- Imports its own `breadcrumbs.component.css` directly.
- Uses the shared `Icon` component from `src/components/icons/icon.tsx` for the leading home icon.
- `BreadCrumbs.Item` is attached as a static property (`BreadCrumbs.Item = BreadCrumbsItem`) and is a thin passthrough component whose props (`target`, `children`) are read directly off the React element by the parent rather than being rendered by the item itself in the trail.

---

## Primary Use Cases
- Showing a user's current location within a page hierarchy (e.g. Home / Settings / Profile).
- Providing quick-jump navigation to any ancestor level of the current page, driven by an app's own router via `onNavigate`.

---

## Limits & Restrictions
- `BreadCrumbs.Item` only works as a direct (or nested-but-detectable) child of `BreadCrumbs` — its own rendering body just returns its `children`; the `target` label and icon placement logic live entirely in the parent `BreadCrumbs` component.
- `BreadCrumbs` does not perform navigation itself; consumers must supply `onNavigate` to react to clicks.
- No component-specific restrictions beyond standard theme token usage.

---

## Related Concepts
- `../icons/icon.tsx` — provides the `home` icon rendered before the first breadcrumb item.
- `../page/README.md` — page-level layout component likely to be paired with breadcrumb navigation.
