---
type: component
title: "TextArea"
description: "A full-width, labeled multi-line text field with an optional character counter and form-bound required validation."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/text-area/text-area.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (2026-09-14T18:19:01.260Z)
---

# TextArea

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Renders a native `<textarea>` associated with its label (`children`) via `Label.Form` and a wrapping `<label>` relationship using `htmlFor`/`id`
- Always spans the full width of its container; `minHeight` (default `"96px"`) controls its starting height and it can still grow via browser/user resize
- `maxCharacters` caps input length via the native `maxLength` and renders a live `current / max` counter (`aria-live="polite"`) next to the label
- Dual usage modes: bind to an enclosing `<Form>` via `name` (reads/writes through `FormContext`), or standalone as controlled (`value`/`onChange`)
- `required` renders a `*` after the label, sets the native `required`/`aria-required` attributes, and — when form-bound — sets a "This field is required" form error while empty, validated both on change and on mount (for prefilled values)

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` for className merging
- BEM classes prefixed `eink-`: `.eink-text-area`, `.eink-text-area__header`, `.eink-text-area__input`, `.eink-text-area__counter`, `.eink-text-area__required`
- Imports its own `text-area.component.css`
- Reuses `Label.Form` (`src/components/label/`) for both the field label and the character counter, rather than custom markup
- Reads/writes form state and errors through `FormContext` (`src/components/form/form.context`) when `name` is provided

---

## Primary Use Cases
- Free-text form fields needing multiple lines (e.g. "Bio", "Notes", comments)
- Bounded-length text entry with a visible remaining-character counter (e.g. a 500-character bio field)
- Required text fields inside a `<Form>` that should block submission until filled

---

## Limits & Restrictions
- `TextAreaProps` omits the native `children`, `onChange`, `value`, `defaultValue`, and `id` attributes since these are repurposed (`children` as the label) or fully controlled internally
- When `name` is set, `value`/`onChange` are ignored in favor of the form context
- `children` (the label) is a required prop

---

## Component-Specific CSS & Tokens
- No new custom properties are introduced; consumes global tokens only (`--eink-font-size-default`, `--eink-size-*`, `--eink-border-medium`, `--eink-border-thick`, `--eink-color-*`)

---

## Related Concepts
- `src/components/label/` — provides the `Label.Form` used for the field label and character counter
- `src/components/form/` — provides the `FormContext` used for form-bound usage and required-field validation via `name`
- `src/components/input/` — a related single-line text field with a similar form-binding pattern
