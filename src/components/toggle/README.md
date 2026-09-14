---
type: component
title: "Toggle"
description: "A boolean on/off switch built on a native checkbox with role=switch, rendered as a diagonal-striped/solid thumb that jumps (no animation) between track ends."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/toggle/toggle.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (pending)
---

# Toggle

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Renders a native `<input type="checkbox" role="switch">`, visually hidden, wrapped in a `<label>` alongside a custom CSS-driven track/thumb, so it keeps real checkbox semantics (keyboard support, `:checked`, `required` validity) plus the ARIA `switch` role.
- The thumb renders as a diagonal-striped block (via a CSS `mask-image` repeating-linear-gradient) while off, and a solid block while on — no `mask-image` when checked.
- The thumb jumps instantly from one side of the track to the other rather than animating, since (per its own JSDoc) "the theme disables transitions" — consistent with e-ink refresh constraints.
- Works two ways: standalone controlled (`checked`/`onChange`), or bound to a `<Form>` via `name`, reading/writing a boolean value through form context.
- `required` renders a trailing `*` after the label and sets the native `required`/`aria-required` attributes, but per its own JSDoc "does not hook into `<Form>` validation on its own".

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` for className merging on the root `<label>`.
- BEM classes prefixed `eink-`: `.eink-toggle`, `.eink-toggle__input`, `.eink-toggle__track`, `.eink-toggle__thumb`, `.eink-toggle__label`, `.eink-toggle__required`.
- Imports its own `toggle.component.css` directly.
- Reads/writes form state via `FormContext` from `../form/form.context`.

---

## Primary Use Cases
- Settings-style boolean switches (e.g. "Notifications", "Visible") standalone or inside a `<Form>`.
- Any binary on/off control where a checkbox visually reads better as a switch than a checkmark box (see `../checkbox/README.md` for the checkmark-box alternative).

---

## Limits & Restrictions
- `required` sets native HTML validity attributes but explicitly does not integrate with `<Form>`'s own validation/error state — unlike, e.g., `Rating`'s `required`, which does block form submission.
- When bound to a `<Form>` via `name`, the `checked`/`onChange` props are ignored entirely.
- No component-specific restrictions beyond standard theme token usage.

---

## Component-Specific CSS & Tokens
- `.eink-toggle__thumb` uses a `mask-image`/`-webkit-mask-image` repeating 45deg linear gradient to render diagonal stripes while unchecked, removed (`mask-image: none`) when `.eink-toggle__input:checked`.
- `.eink-toggle__track` is fixed at `var(--eink-size-36)` × `var(--eink-size-20)`; the thumb is `var(--eink-size-16)` wide and moves via `left: calc(100% - var(--eink-size-16))` when checked.
- `.eink-toggle__input` uses the standard clip-based screen-reader-only pattern to stay accessible while visually hidden.

---

## Related Concepts
- `../checkbox/README.md` — an alternative boolean-input component using a checkmark box instead of a switch, sharing the same standalone/Form-bound/required patterns.
- `../form/form.context` — for form-bound toggles.
