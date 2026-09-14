---
type: component
title: "RadioInput"
description: "A single radio option for use inside a RadioInput.Group, which groups options into a single mutually-exclusive labeled field."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/radio-input/radio-input.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (2026-09-14T18:19:01.260Z)
---

# RadioInput

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Compound component: `RadioInput.Group` (container) and `RadioInput` (individual option, only usable inside a group)
- `RadioInput.Group` renders `role="radiogroup"` labeled via `Label.Form`, associated through `aria-labelledby`, and generates the shared native `name` (via `useId`) its radios need for exclusivity
- `orientation` (`"horizontal" | "vertical"`, default `"vertical"`) controls the group's item layout direction
- Dual usage modes on the group: bind to an enclosing `<Form>` via `name` (reads/writes through `FormContext`), or standalone as controlled (`value`/`onChange`) or uncontrolled (`defaultValue`)
- Group-level `disabled` disables every `RadioInput` inside it; each `RadioInput` can also be individually `disabled`
- Each `RadioInput` renders a visually-hidden native `<input type="radio">` plus a CSS-driven circle/dot indicator reflecting `:checked`/`:disabled` state
- `RadioInput` throws an explicit error ("RadioInput must be used within a RadioInput.Group") if rendered outside a `RadioInput.Group`

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` for className merging
- BEM classes prefixed `eink-`: `.eink-radio-group`, `.eink-radio-group__items`, `.eink-radio-input`, `.eink-radio-input__circle`, `.eink-radio-input__dot`, etc.
- Imports its own `radio-input.component.css`
- Reuses `Label.Form` (`src/components/label/`) for the group label rather than a custom label element
- Shares selection state between the group and its items via a local React Context (`RadioGroupContext`), not prop drilling
- Reads/writes form state through `FormContext` (`src/components/form/form.context`) when the group's `name` is provided
- Visually-hidden native input technique (absolute, 1px, clipped) keeps native radio semantics/keyboard behavior while the visible circle/dot is pure CSS off `:checked`/`:disabled`

---

## Primary Use Cases
- Mutually-exclusive single-choice fields (e.g. size selection: Small/Medium/Large)
- Any form field needing accessible native radio-group semantics with e-ink-appropriate custom styling

---

## Limits & Restrictions
- `RadioInput` can only be used inside a `RadioInput.Group` — using it standalone throws at render time
- `RadioInputProps` omits `type`, `children` (repurposed as label), `onChange`, `checked`, `defaultChecked`, `value` (repurposed as the option's reported value), `defaultValue`, and `name` (all controlled by the group) from the native input attributes
- `RadioInputGroupProps` omits the native `onChange` attribute since it's repurposed for the selected-value callback
- `RadioInput.Group`'s `label` and `children` are required props

---

## Component-Specific CSS & Tokens
- No new custom properties are introduced; consumes global tokens only (`--eink-size-*`, `--eink-border-medium`, `--eink-color-*`, `--eink-font-size-default`)

---

## Related Concepts
- `src/components/label/` — provides the `Label.Form` used for the group's label
- `src/components/form/` — provides the `FormContext` used for form-bound usage via `name`
- `src/components/checkbox/` — a related single-field selection input using a similar visually-hidden-input + CSS-indicator pattern
