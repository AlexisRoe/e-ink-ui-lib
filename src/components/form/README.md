---
type: component
title: "Form"
description: "Form state container (values, errors, dirty/error status) exposed via React context, with built-in submit/reset action buttons."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/form/form.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (pending)
---

# Form

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Wraps a native `<form>` and tracks `values`, `errors`, `isDirty`, and `hasErrors` state, exposed to descendants via `FormContext`/`useFormContext` (and the convenience `useFormField(name)` hook for individual fields).
- `initialValues` is tracked automatically: whenever the prop shallowly changes (e.g. async data finishes loading), values re-sync to it and errors clear, as if freshly mounted.
- Dirtiness defaults to a shallow (`===` per top-level key) comparison of `values` against `initialValues`; an `isEqual` prop can override the comparison (e.g. for deep equality).
- `onSubmit` fires only when the native submit event occurs, `isDirty` is true, and `hasErrors` is false; the event is always `preventDefault()`-ed.
- `Form.SubmitButton` renders a primary `Button` that disables itself automatically when the form is not dirty or has errors.
- `Form.ResetButton` renders an outlined `Button.Outlined` that restores `initialValues`, clears all errors, and calls `onReset`.

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` for className merging.
- BEM class prefixed `eink-`: block `.eink-form` (a flex column layout).
- Imports its own stylesheet via `import "./form.component.css"`.
- Stateful context logic lives in a co-located `form.context.ts` (`FormContext`, `useFormContext`, `useFormField`), separate from the presentational `form.component.tsx`, matching the same pattern as `calendar`.
- Uses the shared `shallowEqual` utility (`src/utils/shallow-equal.utils.ts`) for the default dirty-check and for detecting `initialValues` prop changes.
- Composes `Button` and `Button.Outlined` from `src/components/button/` for its action buttons rather than rendering raw `<button>` elements.

---

## Primary Use Cases
- Building a settings/edit form where a Save button should only be enabled once something has changed and all fields are valid.
- Wiring custom or third-party input fields to a shared form state via `useFormField(name)` without prop-drilling.
- Forms that need to re-initialize when their initial data arrives asynchronously (e.g. loaded from an API after mount).

---

## Limits & Restrictions
- `initialValues` and `children` are required; `onSubmit` is not called unless the form is dirty and has no errors — there is no way to force submission of an unchanged or invalid form through `Form.SubmitButton`.
- `Form.SubmitButton` and `Form.ResetButton` only accept a `children` label prop — no other customization is exposed, since they're wired directly to the enclosing form's context.
- `useFormContext` and `useFormField` throw an error if called outside a `<Form>`.
- `onSubmit`/`onReset`/`children` are omitted from the native `<form>` attributes accepted by `FormProps` (replaced by the typed callback props).

---

## Component-Specific CSS & Tokens
- No component-specific custom properties are defined beyond the global theme tokens (`--eink-size-2` for the field gap).

---

## Related Concepts
- `src/components/button/` — `Button` / `Button.Outlined` used for the form's submit/reset actions.
- Other form-field components in `src/components/` (e.g. input, toggle, select) are expected to consume `useFormField`/`useFormContext` to wire themselves into a `Form`.
