---
type: component
title: "NumberInput"
description: "A labeled numeric stepper with decrease/increase buttons around a spinbutton value display, for bounded quantities."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/number-input/number-input.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (2026-09-14T18:19:01.260Z)
---

# NumberInput

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Renders a `Label.Form` above a decrease button, a `role="spinbutton"` value display, and an increase button
- Optional `min`/`max` bounds (unbounded when omitted); step buttons disable automatically at the bound
- `step` amount defaults to `0.1` when `useFloat` is true, `1` otherwise; explicit `step` overrides the default
- `useFloat` displays values with two decimal places and a comma decimal separator (e.g. `5,00`), except `0` which is shown bare
- Keyboard support on the value display: `ArrowUp`/`ArrowDown` to step, `Home`/`End` to jump to `min`/`max` (only when those bounds are set)
- Dual usage modes: bind to an enclosing `<Form>` via `name` (reads/writes through `FormContext`, ignoring `value`/`onChange`), or standalone as controlled (`value`/`onChange`) or uncontrolled (`defaultValue`, default `0`)
- `disabled` disables both step buttons and removes the value display from the tab order
- Full ARIA spinbutton semantics: `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, `aria-valuetext`, `aria-labelledby`, `aria-disabled`

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` for className merging
- BEM classes prefixed `eink-`: `.eink-number-input`, `.eink-number-input__control`, `.eink-number-input__button`, `.eink-number-input__value`
- Imports its own `number-input.component.css`
- Reuses `Label.Form` (`src/components/label/`) and `Icon` (`src/components/icons/`) rather than reimplementing labels or icons
- Reads/writes form state through `FormContext` (`src/components/form/form.context`) when `name` is provided
- Value clamping/rounding/formatting logic (`clamp`, `roundStep`, `formatValue`) is implemented as local module-level helper functions colocated in the component file

---

## Primary Use Cases
- Quantity pickers (e.g. "Quantity", bounded `min`/`max`, integer stepping)
- Numeric measurements needing decimal precision (e.g. "Weight (kg)" with `useFloat`)
- Any small bounded numeric input better suited to large tappable step buttons than a raw text field, especially on e-ink touch devices

---

## Limits & Restrictions
- `NumberInputProps` omits the native `onChange` HTML attribute (`Omit<HTMLAttributes<HTMLDivElement>, "onChange">`) since `onChange` is repurposed to receive the numeric value
- When `name` is set, `value` and `onChange` are ignored in favor of the form context — the two modes are not meant to be mixed
- `label` is a required prop
- `Home`/`End` keyboard shortcuts only work when `min`/`max` respectively are defined

---

## Component-Specific CSS & Tokens
- No new custom properties are introduced; consumes global tokens only (`--eink-font-size-default`, `--eink-size-*`, `--eink-border-medium`, `--eink-color-*`)

---

## Related Concepts
- `src/components/label/` — provides the `Label.Form` used for the field label
- `src/components/form/` — provides the `FormContext` used for form-bound usage via `name`
- `src/components/stepper/` — another stepping/incrementing UI pattern in the library
