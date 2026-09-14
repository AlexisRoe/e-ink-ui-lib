---
type: component
title: "Pin"
description: "A fixed-length numeric code input (PIN/OTP) rendered as one auto-advancing digit box per character inside a fieldset/legend group."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/pin/pin.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (pending)
---

# Pin

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Renders `length` individual `<input>` boxes (one digit each) inside a `<fieldset>`/`<legend>` sharing a single accessible label (`children`)
- Each box is `inputMode="numeric"`, `pattern="[0-9]*"`, `maxLength={1}`, and non-digit input is stripped
- Auto-advances focus to the next box as digits are typed, and back to the previous box on `Backspace` when the current box is empty; `ArrowLeft`/`ArrowRight` move focus between boxes
- Focusing a box selects its existing digit, so typing over a filled box replaces it
- Pasting distributes the clipboard's digits (non-digit characters stripped) across the remaining boxes from the paste point
- `useMask` (default `true`) renders boxes as `type="password"`; pass `false` for plain text
- Dual usage modes: bind to an enclosing `<Form>` via `name` (reads/writes through `FormContext`), or standalone as controlled (`value`/`onChange`)
- `required` renders a `*` after the label and marks every box `required`
- When form-bound via `name`, sets its own field error ("Enter a code" / "Enter all N digits") whenever the code is incomplete, keeping `Form.SubmitButton` disabled until fully entered — validated both on change and on mount (for prefilled values)
- First box gets `autoComplete="one-time-code"` to support OTP autofill; other boxes get `autoComplete="off"`

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` for className merging
- BEM classes prefixed `eink-`: `.eink-pin`, `.eink-pin__label`, `.eink-pin__boxes`, `.eink-pin__input`, `.eink-pin__required`
- Imports both its own `pin.component.css` and `label.component.css` directly (reusing the `eink-label`/`eink-label--form` classes on its `<legend>` rather than rendering the `Label.Form` component, since a `<legend>` can't be a `<label>`)
- Reads/writes form state and errors through `FormContext` (`src/components/form/form.context`) when `name` is provided
- A `biome-ignore lint/suspicious/noArrayIndexKey` comment documents the deliberate use of array index as `key` since boxes are a fixed-length, position-only sequence

---

## Primary Use Cases
- PIN entry for device/app authentication
- One-time-code (OTP) entry from SMS/authenticator apps, aided by `autoComplete="one-time-code"`
- Any fixed-length numeric code capture that benefits from auto-advancing, paste-friendly digit boxes

---

## Limits & Restrictions
- `length` is a required prop; there is no default
- `PinProps` omits several native input attributes (`type`, `children`, `onChange`, `value`, `defaultValue`, `id`, `maxLength`, `pattern`, `inputMode`, `autoComplete`) since these are all controlled internally by the component
- When `name` is set, `value`/`onChange` are ignored in favor of the form context
- Only digit characters are accepted; all other characters are stripped on input and paste

---

## Component-Specific CSS & Tokens
- No new custom properties are introduced; consumes global tokens only (`--eink-font-size-default`, `--eink-size-*`, `--eink-border-medium`, `--eink-border-thick`, `--eink-color-*`)

---

## Related Concepts
- `src/components/label/` — its `.eink-label`/`.eink-label--form` classes are reused directly on Pin's `<legend>`
- `src/components/form/` — provides the `FormContext` used for form-bound usage and validation via `name`
