---
type: component
title: "Keypad"
description: "Numeric access pad with a 3-column grid of digit, clear, and backspace keys for entering PINs or short numeric values by touch."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/keypad/keypad.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (2026-09-14T18:19:01.260Z)
---

# Keypad

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Labeled 3-column grid of digit keys (`1`-`9`, `0`), a clear key (`C`), and a backspace key (icon button), rendered as native `<button>` elements inside a `role="group"` container
- `maxLength` (required) caps the number of entered digits, not counting a decimal point
- `allowDecimal` adds a fourth row with a decimal-point key so the value can represent a float; only one decimal point can be entered
- `display` renders a bordered, `aria-live="polite"` box above the key grid showing the current value
- Works standalone as controlled (`value`/`onChange`) or uncontrolled (`defaultValue`), or bound to an enclosing `<Form>` via `name` — when `name` is set, value/onChange are ignored and the form context (`useContext(FormContext)`) is used instead
- `disabled` disables every key
- Backspace key uses the shared `Icon` component (`name="backspace"`) with `aria-label="Backspace"`
- Label rendered via `Label.Form`, associated to the group with `aria-labelledby`/`useId()`

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` to merge the base `eink-keypad` class with an optional consumer `className`
- BEM classes prefixed `eink-`: `.eink-keypad`, `.eink-keypad__label`, `.eink-keypad__display`, `.eink-keypad__grid`, `.eink-keypad__key`, `.eink-keypad__key--action`, `.eink-keypad__key--empty`
- Imports its own `keypad.component.css` directly
- All sizes, colors, and borders in the CSS reference design tokens (`--eink-size-*`, `--eink-color-*`, `--eink-border-medium`) rather than hardcoded literals
- Integrates with the shared `FormContext` (`src/components/form/form.context`) the same way other form inputs in this library do
- Uses a documented `biome-ignore` for `lint/a11y/useSemanticElements`, explaining why `role="group"` + `aria-labelledby` is used instead of a `<fieldset>`/`<legend>` (the label is `Label.Form`, which renders a `<label>`, not a `<legend>`)
- JSDoc on the exported `KeypadProps` interface and the `Keypad` function, including two `@example`s (standalone and form-bound usage)

---

## Primary Use Cases
- PIN entry on e-ink tablets/kiosks (`<Keypad name="pin" label="PIN" maxLength={4} />`)
- Quantity or short numeric value entry with a visible running display (`<Keypad label="Quantity" maxLength={4} display />`)
- Any touch-numeric-entry field bound to a library `<Form>`

---

## Limits & Restrictions
- `maxLength` is a required prop
- `value`/`onChange`/`defaultValue` are ignored whenever `name` is provided and a `FormContext` is present — form binding always takes precedence
- Only one decimal point can ever be entered, and the decimal key is only rendered when `allowDecimal` is `true`
- The component's own `onChange` type omits the native `HTMLAttributes` `onChange` in favor of a custom `(value: string) => void` signature

---

## Related Concepts
- [NumberInput](../number/number.component.tsx) — related numeric-input component
- [Pin](../pin/pin.component.tsx) — comparable PIN-style entry pattern
- Form context (`src/components/form/form.context`) — shared binding mechanism used by `name`
- [Label](../label/label.component.tsx) — provides the `Label.Form` used for the keypad's accessible label
