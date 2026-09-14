---
type: component
title: "Table"
description: "Full-width table with an inverted header row and selectable data rows, composed from Table.Head/Body/Row/Cell/HeaderCell subcomponents."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/table/table.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (2026-09-14T18:19:01.260Z)
---

# Table

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Composable subcomponents: `Table.Head`, `Table.Body`, `Table.Row`, `Table.Cell`, `Table.HeaderCell`, each a static property of `Table`
- Clicking a `Table.Row`, or pressing Enter/Space while it is focused, toggles its selection (inverts its colors via an `eink-invert-colors` class); `Table` tracks the full set of selected row indexes and reports them, sorted, via `onSelectionChange`
- `preselectedIndexes` sets which rows are selected on first render
- Rows are individually `selectable` (defaults to `true`) and/or `disabled` (defaults to `false`); disabled rows are dimmed with a grey background, or — when the table has `mono` enabled — show a diagonal black-stripe pattern (via `PatternOverlay`) instead
- `Table.Body` renders a configurable `emptyLabel` (defaults to a `list` icon) in a single full-width cell spanning every declared column when it has no rows; `Table` itself gets an `eink-table--empty` modifier (dashed bottom border) when no rows exist anywhere
- `stickyHeader` pins the header row to the top of the nearest scroll container
- Table-wide sequential row indexing is computed automatically across multiple `Table.Body` sections, so each `Table.Row` gets a unique index even when split across bodies

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` for all conditional class merging across every subcomponent
- BEM-ish classes prefixed `eink-`, but structured per subcomponent rather than strictly nested under one block: `.eink-table`, `.eink-table-head`, `.eink-table-header-cell`, `.eink-table-body`, `.eink-table-row` (elements `__stripes`, `__stripes-svg`), `.eink-table-cell` (element `__empty-icon`); modifiers `.eink-table--sticky-header`, `.eink-table--empty`, `.eink-table-row--selectable`, `--disabled`, `--disabled-mono`, `--empty`, `.eink-table-cell--empty`
- Imports its own stylesheet via `import "./table.component.css"`
- Reuses shared components: `Icon` (`src/components/icons/icon.tsx`) for the default empty-state icon, `PatternOverlay` (`src/components/pattern-overlay/pattern-overlay.component.tsx`) for the disabled-row diagonal stripes in `mono` mode
- Uses React Context (`TableContext`) to share `selectedIndexes`/`toggleRow` from `Table` down to every `Table.Row` without prop drilling
- Uses `Children`/`cloneElement`/`isValidElement` tree-walking helpers (`countColumns`, `processChildren`) to inject internal props (`index`, `mono`, `columnCount`) into nested `Table.Row`/`Table.Body` elements based on their component type

---

## Primary Use Cases
- Tabular data display with an inverted, high-contrast header row suited to e-ink screens
- Data tables where rows can be selected (e.g. bulk actions), with the selection state reported back to the consumer
- Tables that need an explicit "no rows" state and/or a sticky header while scrolling

---

## Limits & Restrictions
- `Table.Row`, `Table.Cell`, `Table.HeaderCell`, `Table.Head`, `Table.Body` are only meaningful nested inside `Table` — `Table.Row` relies on `TableContext` for its selection behavior
- Row indexes are assigned automatically by `Table` based on child position/type; rows cannot be given arbitrary custom indexes
- `mono`'s diagonal-stripe treatment on disabled rows only applies when both the row is `disabled` and the table's `mono` prop is `true`
- The empty-state `colSpan` is derived from the number of `Table.HeaderCell` children found in any `Table.Head`, defaulting to `1` if none is found

---

## Component-Specific CSS & Tokens
- No custom properties beyond global theme tokens are defined (`--eink-color-*`, `--eink-border-*`, `--eink-size-*`, `--eink-font-family-main`)
- `table-layout: fixed` with `border-collapse: collapse`; `.eink-table--empty` switches the outer border to dashed on the bottom/left/right edges (the header's own top/left/right edges stay solid via `:first-child`/`:last-child` overrides, since solid outranks dashed at a collapsed border segment)
- `.eink-table-head` is inverted (black background, white text); `.eink-table--sticky-header .eink-table-head` uses `position: sticky; top: 0`
- `.eink-table-cell` truncates overflowing text (`max-width: 0` + `text-overflow: ellipsis`); `.eink-table-cell--empty` resets that to allow the empty-state content to wrap and center
- `.eink-table-row__stripes`/`__stripes-svg` absolutely position the `PatternOverlay` over a disabled+mono row

---

## Related Concepts
- `src/components/pagination/pagination.component.tsx` — commonly paired with `Table` for paged tabular data
- `src/components/icons/icon.tsx` — renders the default empty-state icon
- `src/components/pattern-overlay/pattern-overlay.component.tsx` — renders the disabled-row diagonal stripes in `mono` mode
