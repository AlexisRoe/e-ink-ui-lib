---
type: component
title: "Select"
description: "Accessible dropdown selector combobox supporting single- or multi-select, optional grouping, icons, and Form binding."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/select/select.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (2026-09-14T18:19:01.260Z)
---

# Select

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Trigger `<button>` (`aria-haspopup="listbox"`, `aria-expanded`) that opens a `role="listbox"` populated with `Select.Option` rows, optionally grouped via `Select.Group`
- Single-select (default) or multi-select via `multiple`; in multi-select mode each chosen `Select.Option` shows a checkmark and the listbox stays open between picks
- `Select.Option` renders `role="option"` list items with `aria-selected`, an optional leading icon, and keyboard support (`Enter`/`Space` toggles selection)
- `Select.Group` renders a `role="group"` `<ul>` with an optional filled-black heading `label` bar above its options, visually separated from adjacent groups by a border
- Closes on outside click and `Escape` key (`useEffect` listeners on `mousedown`/`keydown`)
- Works standalone as controlled (`value`/`onChange`) or uncontrolled (`defaultValue`), or bound to an enclosing `<Form>` via `name` — form binding takes precedence and ignores `value`/`onChange`
- `required` renders a `*` after the label and, when bound to a `<Form>`, sets a field error ("Select an option") while nothing is selected, keeping `Form.SubmitButton` disabled until a choice is made — validated both on change and on mount via a `useEffect`
- Trigger label shows `placeholder` until a choice is made, then the selected option's rendered label (looked up recursively through groups via an internal `findOption` helper), or a `"N selected"` count in multi-select mode

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` throughout (`Select`, `SelectOption`, `SelectGroup`) to merge base BEM classes, conditional modifiers, and consumer `className`
- BEM classes prefixed `eink-`: `.eink-select`, `.eink-select__trigger`, `.eink-select__list`, `.eink-select-group`, `.eink-select-group__label`, `.eink-select-option`, `.eink-select-option--selected`
- Imports its own `select.component.css` directly
- All colors, borders, spacing, and z-index reference design tokens (`--eink-color-*`, `--eink-border-*`, `--eink-size-*`, `--eink-z-index-modal`) rather than hardcoded literals
- Integrates with the shared `FormContext` (`src/components/form/form.context`) the same way other form inputs in this library do
- Shares selection state with option/group children via a local `SelectContext` (React context), rather than prop drilling
- Uses documented `biome-ignore` comments for `lint/a11y/noNoninteractiveElementToInteractiveRole` (listbox `ul`/`li` pattern, matching `DropdownMenu`) and `lint/a11y/useSemanticElements` (group `ul` can't be a `fieldset` inside a listbox)
- Uses the shared `Icon` component and curated `IconName` type from `src/components/icons/`, and `Label.Form` for the accessible label
- Sub-components attached as static properties (`Select.Option`, `Select.Group`)
- JSDoc on every exported prop type and component, including `@example`s

---

## Primary Use Cases
- Single-choice dropdowns bound to a `<Form>` (e.g. `<Select name="fruit" label="Fruit" placeholder="Pick…" required>`)
- Multi-select dropdowns where a user picks several options from a list, with a running "N selected" summary
- Long option lists organized into labeled groups (`Select.Group`)

---

## Limits & Restrictions
- `label`, `placeholder`, and `children` are required props
- `value`/`onChange`/`defaultValue` are ignored whenever `name` is provided and a `FormContext` is present
- `value` is typed as `string` when `multiple` is `false` and `string[]` when `multiple` is `true`, but this isn't enforced by a discriminated union in `SelectProps` — the type is a plain union (`string | string[]`)
- `Select.Option`'s `onSelect` HTML attribute is omitted from its props type in favor of internal selection handling
- Option lookup (`findOption`) only recognizes direct `Select.Option`/`Select.Group` children by exact component reference; other element types won't be matched for trigger-label display

---

## Component-Specific CSS & Tokens
- `.eink-select-option--selected` — modifier controlling checkmark visibility (`.eink-select-option__check` is `visibility: hidden` unless selected)
- `.eink-select-group + .eink-select-group` and `.eink-select-option + .eink-select-option` — adjacent-sibling border rules separating groups/options without extra wrapper markup

---

## Related Concepts
- [Keypad](../keypad/keypad.component.tsx) — another Form-bindable input using the same `FormContext` pattern
- Form context (`src/components/form/form.context`) — shared binding/validation mechanism used by `name`/`required`
- Icons (`src/components/icons/icon.tsx`, `src/components/icons/icons.ts`) — source of `IconName`/`Icon` used for option icons and the trigger chevron
