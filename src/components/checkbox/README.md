---
type: component
title: "Checkbox"
description: "A single checkbox, and an accompanying Checkbox.Group for multi-select, both integrable with the Form component or usable standalone."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/checkbox/checkbox.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (pending)
---

# Checkbox

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Renders a native `<input type="checkbox">` visually hidden and replaced by a CSS-driven custom box containing a `check` icon, toggled via the input's `:checked`/`:disabled` state.
- Works three ways: standalone controlled (`checked`/`onChange`), standalone uncontrolled (`defaultChecked`), or bound to a `<Form>` via `name` (boolean field value).
- `Checkbox.Group` groups multiple `Checkbox` items into one multi-select field, tracking an array of checked `value`s; works standalone (`value`/`onChange`/`defaultValue`) or bound to a `<Form>` via `name`.
- Inside a `Checkbox.Group`, each `Checkbox` identifies itself via its `value` prop instead of managing its own boolean state, and the group's `disabled` prop disables every checkbox inside it.
- `required` renders a trailing `*` after the label and sets the native `required`/`aria-required` attributes.
- `Checkbox.Group` is labeled via `Label.Form` and associated to its items with `role="group"` + `aria-labelledby` (since a single `<label>` can't wrap multiple inputs).

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` for className merging on both `Checkbox` and `Checkbox.Group`.
- BEM classes prefixed `eink-`: `.eink-checkbox`, `.eink-checkbox__input`, `.eink-checkbox__box`, `.eink-checkbox__check`, `.eink-checkbox__label`, `.eink-checkbox__required`, `.eink-checkbox-group`, `.eink-checkbox-group__label`, `.eink-checkbox-group__items`.
- Imports its own `checkbox.component.css` directly.
- Reads/writes form state via `FormContext` from `../form/form.context`, uses `Label.Form` from `../label/label.component`, and the shared `Icon` component from `../icons/icon.tsx`.
- `Checkbox.Group` is attached as a static property (`Checkbox.Group = CheckboxGroup`).

---

## Primary Use Cases
- Single boolean toggles like "Accept terms" checkboxes, standalone or inside a `<Form>`.
- Multi-select option groups (e.g. pizza toppings, filters) using `Checkbox.Group` to track an array of selected values.
- Any form field needing a required-field indicator (`required` prop).

---

## Limits & Restrictions
- Inside a `Checkbox.Group`, an individual `Checkbox`'s own `checked`/`onChange`/`name` props are ignored — the group owns state via its `value` identification.
- `Checkbox.Group` ignores its own `value`/`onChange`/`defaultValue` props when `name` is set and a `<Form>` context is present (form binding takes precedence).
- A `Checkbox` used inside a `Checkbox.Group` must supply a `value` prop to be recognized as grouped (`isGrouped` requires both a group context and a defined `value`).
- No component-specific restrictions beyond standard theme token usage.

---

## Component-Specific CSS & Tokens
- `.eink-checkbox__input` is visually hidden with a standard clip-based screen-reader-only pattern (not a design token) while remaining focusable/checkable.
- Focus state is shown via `outline` on `.eink-checkbox__box` when the hidden input has `:focus-visible`.
- Disabled state styling on `.eink-checkbox__box`/`.eink-checkbox__check` uses `var(--eink-color-grey-70)`, `var(--eink-color-grey-95)`, and `var(--eink-color-disabled)`.

---

## Related Concepts
- `../form/form.context` and the Form component — for form-bound checkboxes and checkbox groups.
- `../label/label.component` — used by `Checkbox.Group` for its group label.
- `../icons/icon.tsx` — provides the `check` icon shown inside a checked box.
- `../toggle/README.md` — an alternative boolean-input component.
- `../radio-input` — related single-select form input pattern.
