---
type: component
title: "Tree"
description: "Hierarchical folder/file tree with guide lines connecting each node to its siblings and parent, with expandable/collapsible branches."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/tree/tree.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (2026-09-14T18:19:01.260Z)
---

# Tree

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Composed from `Tree` (root container) and `Tree.Item` (a node), the latter exposed as a static property
- `Tree.Item` renders as an expandable branch (folder icon + chevron toggle) when it has nested `Tree.Item` children, or as a leaf (file icon, no toggle) otherwise
- Branches toggle expanded/collapsed state locally on click (`aria-expanded` on the toggle button); `initialExpanded` (defaults to `true`) sets the branch's starting state and is ignored on leaf items
- Vertical/horizontal guide lines connect each nested item to its siblings and parent, drawn via CSS pseudo-elements (`::before`) based on whether an item is the last child (tracked through `TreeItemContext`)
- Chevron icon flips between `chevron-down` (expanded) and `chevron-right` (collapsed)

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` to merge base classes with the `eink-tree-item--last` modifier and any consumer `className`
- BEM classes prefixed `eink-`: block `.eink-tree`, `.eink-tree-group` (elements via modifier `--nested`), `.eink-tree-item` (elements `__row`, `__toggle`, `__leaf`, `__chevron`, `__icon`, `__label`; modifier `--last`)
- Imports its own stylesheet via `import "./tree.component.css"`
- Reuses the shared `Icon` component (`src/components/icons/icon.tsx`) for folder/file/chevron icons
- Uses React Context (`TreeItemContext`) to pass down whether an item is the last among its siblings, so its connector guide line stops at the branch point instead of running the full height
- Internal `TreeGroup` helper component (not exported) renders the `<ul>` wrapper and provides `TreeItemContext` per child, shared by both the root `Tree` and nested branches

---

## Primary Use Cases
- File/folder explorers or any nested hierarchical data (categories, org charts, outline views) that benefits from visible guide lines showing parent/child/sibling relationships
- Collapsible navigation of deeply nested structures where users need to expand only the branches they care about

---

## Limits & Restrictions
- `Tree.Item` can only be used inside `Tree` (or nested inside another `Tree.Item`) — its guide-line rendering depends on `TreeItemContext`, provided by the internal `TreeGroup`
- Whether an item is a branch or leaf is determined purely by whether it has `children`; there's no explicit `type="folder"`/`"file"` prop
- Expansion state is local/uncontrolled per item (`initialExpanded` sets the initial value only) — there's no controlled `expanded`/`onExpandedChange` API to drive it externally
- `label` and `children` (for nested items) are the only content props; no drag-and-drop, selection, or multi-select behavior is implemented

---

## Component-Specific CSS & Tokens
- No custom properties beyond global theme tokens are defined (`--eink-color-primary`, `--eink-border-width-medium`, `--eink-size-*`, `--eink-font-family-main`)
- Guide lines are implemented as absolutely positioned `::before` pseudo-elements on `.eink-tree-group--nested > .eink-tree-item` (vertical line) and `.eink-tree-item__row` (horizontal branch connector), using `--eink-size-20`-based offsets; `.eink-tree-item--last` shortens the vertical line so it stops at the last child's branch point instead of continuing further down

---

## Related Concepts
- `src/components/icons/icon.tsx` — renders the folder, file, and chevron icons for each node
- `src/components/navigation/` — another hierarchical/expandable list component, though built for menu navigation rather than tree data display
