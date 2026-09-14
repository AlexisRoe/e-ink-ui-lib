---
type: component
title: "Label"
description: "A small uppercase text label, with a form-field variant rendered as a native <label> element."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/label/label.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (2026-09-14T18:19:01.260Z)
---

# Label

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Compound component: `Label` (base) and `Label.Form` (form-field variant)
- `Label` renders as a `<span>` with the secondary font family, uppercase text, and a small font size (`--eink-size-8`)
- `Label.Form` renders as a native `<label>` element in a larger size (`--eink-size-14`), for use with `htmlFor` to associate with a form field or by wrapping a field directly
- `Label` extends `HTMLAttributes<HTMLSpanElement>`; `Label.Form` extends `LabelHTMLAttributes<HTMLLabelElement>`, so native span/label attributes pass through

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` to merge base classes with consumer-supplied `className`
- BEM classes prefixed `eink-`: `.eink-label`, `.eink-label--form`
- Imports its own `label.component.css`
- `Label.Form` intentionally allows omitting `htmlFor` (documented via a `biome-ignore lint/a11y/noLabelWithoutControl` comment) for standalone uses like wrapping a field directly

---

## Primary Use Cases
- Small uppercase captions/annotations (e.g. "Battery status")
- Form field labels associated via `htmlFor` (e.g. `<Label.Form htmlFor="email">Email</Label.Form>`) or wrapping a field's control directly (as with `Toggle`)

---

## Limits & Restrictions
- `Label.Form` does not enforce `htmlFor` at the type level — it is the consumer's responsibility to associate the label with its field for accessibility, either via `htmlFor` or by wrapping the control

---

## Component-Specific CSS & Tokens
- No new custom properties are introduced; consumes global tokens only (`--eink-font-family-secondary`, `--eink-size-8`, `--eink-size-14`)

---

## Related Concepts
- `src/components/toggle/` — an example consumer that can wrap its switch and text with `Label.Form`
