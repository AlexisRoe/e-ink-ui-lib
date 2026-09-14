---
type: component
title: "Pagination"
description: "Page navigation control with high-contrast bordered buttons that always shows first/last/current pages plus siblings, collapsing gaps into an ellipsis marker."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/pagination/pagination.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (pending)
---

# Pagination

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Renders a `<nav aria-label="Pagination">` with first-page, previous-page, page-number, next-page, and last-page buttons
- Always shows the first and last page plus the current page and `siblingCount` (default `1`) siblings on each side, collapsing any gap in between into a dot-based ellipsis marker (`getPaginationRange` from `src/utils/pagination.utils.ts`) so the control stays a fixed, non-overflowing width regardless of `pageCount`
- First/previous buttons are disabled when already on the first page; next/last buttons are disabled when on the last page
- Current page button is marked with `aria-current="page"` and a distinct filled style
- `Pagination.Item` is exported separately so consumers can build a custom page-number layout while reusing the same button styling
- `onPageChange` is only called for valid target pages (within `1..pageCount` and different from the current page)

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` to merge the root `nav`'s className and the `eink-pagination__button--current` modifier
- BEM classes prefixed `eink-`: block `.eink-pagination`, elements `__list`, `__item`, `__button`, `__ellipsis`, `__ellipsis-dot`; modifiers `.eink-pagination__button--current`, `.eink-pagination__button--control`
- Imports its own stylesheet via `import "./pagination.component.css"`
- Reuses the shared `Icon` component (`src/components/icons/icon.tsx`) for the chevron/chevrons navigation icons
- Delegates the page-range-with-ellipsis computation to the framework-agnostic `getPaginationRange` helper in `src/utils/pagination.utils.ts` rather than computing it inline
- Uses a `biome-ignore lint/suspicious/noArrayIndexKey` comment for ellipsis list-item keys, since gaps have no stable identity and there are at most two per render
- Exposes `Pagination.Item` as a static property on `Pagination`

---

## Primary Use Cases
- Navigating paginated tables, datasheets, or long documents on e-ink devices, where high-contrast bordered buttons (rather than hover-only affordances) are needed for legibility
- Any list/grid view with a controlled `page` and known `pageCount` that needs first/prev/next/last controls plus numbered page buttons

---

## Limits & Restrictions
- `pageCount` and `page` (1-indexed) are required; `page` is expected to be controlled by the consumer via `onPageChange`
- `onPageChange` is a no-op if the target page is out of the `1..pageCount` range or equals the current page
- `siblingCount` only controls how many page numbers are shown beside the current page — it doesn't affect whether first/last pages are shown (they always are)

---

## Component-Specific CSS & Tokens
- No custom properties beyond global theme tokens are defined (`--eink-color-*`, `--eink-border-medium`, `--eink-size-*`, `--eink-font-size-default`)
- Notable classes: `.eink-pagination__button--control` (first/prev/next/last icon buttons), `.eink-pagination__ellipsis`/`__ellipsis-dot` (three-dot gap marker sized to match a page button)

---

## Related Concepts
- `src/utils/pagination.utils.ts` — provides the `getPaginationRange` helper this component uses to compute which page numbers/ellipses to show
- `src/components/icons/icon.tsx` — renders the navigation chevron icons
- `src/components/table/` — a common consumer of pagination for paged tabular data
