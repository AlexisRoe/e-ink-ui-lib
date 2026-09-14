---
type: component
title: "Todo"
description: "A list of checkable tasks rendered as one-line buttons with a round checkbox that fills in with a check icon when marked done."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/todo/todo.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (pending)
---

# Todo

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Compound component: `Todo` (list container) and `Todo.Item` (individual task, rendered as a `<button>`)
- Optional `title` rendered above the list of items
- Each `Todo.Item` toggles between empty and checked state on click, rendering a check icon (`Icon name="check"`) inside a round circle once checked
- `Todo.Item` accepts `initialState` (default `false`) to start pre-checked
- Item identity reported to `Todo`'s `onChange` is either the item's explicit `id` prop or its index among siblings when `id` is omitted, via the `Todo` injecting a positional `index` prop through `Children.map`/`cloneElement`
- `Todo`'s `onChange` is called with `(identifier, checked)` whenever any item is toggled, propagated up through internal `TodoContext`
- Accessible: each item button sets `aria-pressed` reflecting its checked state

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` for className merging
- BEM classes prefixed `eink-`: `.eink-todo`, `.eink-todo__title`, `.eink-todo-item`, `.eink-todo-item__circle`, `.eink-todo-item__circle--checked`, `.eink-todo-item__icon`, `.eink-todo-item__label`
- Imports its own `todo.component.css`
- Reuses the shared `Icon` component (`src/components/icons/`) for the check glyph rather than inlining an SVG
- Shares the toggle callback between `Todo` and its items via a local React Context (`TodoContext`), not prop drilling
- `Todo` only injects the positional `index` onto children that are actually `Todo.Item` elements (checked via `child.type !== TodoItem`), leaving other children untouched

---

## Primary Use Cases
- Simple daily/task checklists (e.g. "Today" list: "Water the plants", "Feed the cat")
- Any short, flat list of independently-checkable items where each toggle should be reported individually rather than managed as a single form field

---

## Limits & Restrictions
- `TodoItemProps` omits the native `id` and `onClick` HTML button attributes since `id` is repurposed as the reported identifier and `onClick` is fully controlled internally
- `TodoProps` omits the native `title` and `onChange` attributes (`title` is repurposed as the heading, `onChange` as the toggle callback)
- Each `Todo.Item` manages its own checked state internally (`useState`) — `Todo` does not hold a single controlled source of truth for all items' checked states, only relays toggle events via `onChange`
- `children` (the task text) is a required prop on `Todo.Item`

---

## Component-Specific CSS & Tokens
- No new custom properties are introduced; consumes global tokens only (`--eink-size-*`, `--eink-border-medium`, `--eink-color-*`, `--eink-font-family-main`)

---

## Related Concepts
- `src/components/icons/` — provides the `Icon` component used for the checked-state check glyph
- `src/components/checkbox/` — a related but distinct checkable-input component, used for form-bound boolean fields rather than a standalone task list
