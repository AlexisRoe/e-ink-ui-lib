---
type: component
title: "List"
description: "List component rendering an unordered, ordered, or bordered detailed title/description list, with a companion ListItem."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/list/list.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (2026-09-14T18:19:01.260Z)
---

# List

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Three variants via `as`: `"unordered"` (default, renders `<ul>` with a small black square marker via `::before`), `"ordered"` (renders `<ol>` with a CSS counter, e.g. `1.`, `2.`), and `"detailed"` (bordered `<ul>` with items separated by borders, no bullet marker)
- `List.Item` (also exported as `ListItem`) renders plain `children` by default, or a `title`/`description` pair (used by the `"detailed"` variant) as a bold title line plus a smaller description line
- `title`/`description` and `children` are mutually exclusive in practice: when either `title` or `description` is defined, `children` is not rendered
- Custom bullet/number markers are pure CSS (`::before` content), not native list markers, so `list-style: none` is set on the root

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` to merge base BEM classes (including the `as`-based modifier) with an optional consumer `className`
- BEM classes prefixed `eink-`: `.eink-list`, `.eink-list--unordered`, `.eink-list--ordered`, `.eink-list--detailed`, `.eink-list__item`, `.eink-list__item-content`, `.eink-list__item-title`, `.eink-list__item-description`
- Imports its own `list.component.css` directly
- All sizes/colors/borders in the CSS reference design tokens (`--eink-size-*`, `--eink-color-primary`, `--eink-border-medium`) rather than hardcoded literals
- `ListItemProps` omits the native `title` attribute from `LiHTMLAttributes` to repurpose `title` as a typed `ReactNode` prop
- `List.Item` attached as a static property (`List.Item = ListItem`)
- JSDoc on `ListAs`, `ListProps`, `ListItemProps`, and `List`, including an `@example` covering all three variants

---

## Primary Use Cases
- Simple bulleted or numbered lists of short text items
- Bordered "detailed" lists showing a title and supporting description per row, e.g. a list of documents or records (similar in spirit to `Card.Header`'s title/subtitle pairing)

---

## Limits & Restrictions
- `List` renders either a `<ul>` or `<ol>` based on `as`; there is no way to render both list semantics with the `"detailed"` styling other than choosing `as="detailed"` (which uses a `<ul>`)
- `ListItemProps` omits the native `title` HTML attribute (tooltip text) since `title` is repurposed as content; a native tooltip `title` attribute cannot be passed to `ListItem`

---

## Related Concepts
- [Card](../card/card.component.tsx) — similar title/subtitle pairing pattern used in `Card.Header`
