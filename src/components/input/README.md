---
type: component
title: "Input"
description: "Single-line text field covering text, password, email, url, tel, search, and number types, with optional Form binding, validation, clear button, and password reveal toggle."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/input/input.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (pending)
---

# Input

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- One component covers `text`, `password`, `email`, `url`, `tel`, `search`, and `number` native input types (defaults to `"text"`).
- Always full-width, labeled above the field via `Label.Form` (the `children` prop is the label content).
- Two binding modes: pass `name` to read/write its value and error through the enclosing `<Form>`'s context (`FormContext`), or omit it to use as a standalone controlled component with `value`/`onChange`.
- `validate` runs on every change and on blur; a returned error string renders in an error box under the field (with a `PatternOverlay` diagonal-stripe swatch) and sets `aria-invalid`/`aria-describedby`. When bound via `name`, the error also propagates into the form's error state.
- `type="password"` shows a reveal/hide toggle button (disable with `useEye={false}`).
- Shows a clear button once the field has a value (disable with `useClear={false}`).
- Supports `required` (renders a `*` after the label), `disabled`, and `maxLength`.

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` for className merging.
- BEM classes prefixed `eink-`: block `.eink-input`, elements `.eink-input__label`, `.eink-input__control`, `.eink-input__field`, `.eink-input__action`, `.eink-input__error`, `.eink-input__error-swatch`, `.eink-input__error-message`.
- Imports its own stylesheet via `import "./input.component.css"`.
- Reads `FormContext` directly (`useContext(FormContext)`) rather than requiring `useFormContext`, so it works both inside and outside a `<Form>`.
- Reuses `Label.Form` (`src/components/label/`), `Icon` (`src/components/icons/`), and `PatternOverlay` (`src/components/pattern-overlay/`) instead of duplicating markup.
- Generates a stable id via React's `useId()` when no `id` prop is supplied, and derives the error message id from it for `aria-describedby`.

---

## Primary Use Cases
- Standard text/email/password/number entry fields in forms rendered on e-ink devices, with the clear/reveal affordances suited to on-device text entry.
- Fields bound to a `<Form>` via `name` so their value/error automatically participate in the form's dirty/error tracking (e.g. gating `Form.SubmitButton`).
- Standalone controlled inputs (search boxes, filters) outside any `<Form>`, driven purely by `value`/`onChange`.

---

## Limits & Restrictions
- `children` (the label) is required; `type`, `onChange`, `value`, and `children` are omitted from the underlying native `InputHTMLAttributes` and replaced by this component's own typed props.
- When `name` is provided, the `value`/`onChange` props are ignored — the field is fully driven by the enclosing `Form`'s context instead.
- `useEye`/reveal toggle only applies when `type="password"`.

---

## Component-Specific CSS & Tokens
- No component-specific custom properties are defined beyond global theme tokens (`--eink-size-*`, `--eink-color-*`, `--eink-border-*`, `--eink-font-size-default`).
- Notable structural classes: `.eink-input__control:has(.eink-input__field:disabled)` (disabled-state styling via `:has()`), `.eink-input__error-swatch` (hosts the `PatternOverlay`).

---

## Related Concepts
- `src/components/form/` — `FormContext`/`useFormContext`/`useFormField`, which `Input` binds to via `name`.
- `src/components/label/` — `Label.Form` used for the field label.
- `src/components/pattern-overlay/` — diagonal-stripe swatch used in the error state.
- `src/components/icons/` — clear/reveal icon buttons.
