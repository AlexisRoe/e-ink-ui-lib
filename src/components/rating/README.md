---
type: component
title: "Rating"
description: "An icon-based rating input implemented as an ARIA radiogroup, supporting heart, star, or smiley icons, with optional clear button and Form binding."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/rating/rating.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (pending)
---

# Rating

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Renders a row of icon buttons as an ARIA `radiogroup` of `role="radio"` buttons, so exactly one value from `1` to `max` is selected at a time.
- `icon` selects the icon style: `"heart"`, `"star"` (default), or `"smiley"` (mapped internally to the `heart`/`star`/`mood-smile-beam` icons from the icon registry).
- Clicking the currently-selected icon resets the value to `0`; an optional `withClear` button also resets to `0` and is disabled when the value is already `0`.
- Works standalone (`value`/`onChange`) or bound to a `<Form>` via `name`, in which case the form's value is read/written as the numeric rating.
- If the initial `value` exceeds `max`, it is clamped down to `max` (and also floored at `0`).
- `readOnly` renders the current rating as a non-interactive display exposed as a single `role="img"` element (no button chrome, no clear button); `disabled` instead renders the normal interactive control but fully inert via a wrapping `<fieldset disabled>`.
- `withBorder` (default `true`) toggles a border around each icon.
- `required`, only effective when bound via `name`, sets a "Select a rating" form error while the value is `0`, blocking form submission.

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` for className merging on the root `<fieldset>` and on each icon button's conditional modifier classes.
- BEM classes prefixed `eink-`: `.eink-rating`, `.eink-rating__label`, `.eink-rating__control`, `.eink-rating__icons`, `.eink-rating__icon` with `--filled`/`--no-border`/`--readonly` modifiers, `.eink-rating__clear`.
- Imports both its own `rating.component.css` and `../label/label.component.css` directly, and reuses the shared `.eink-label`/`.eink-label--form` classes on its `<legend>` for consistent label styling.
- Reads/writes form state and validation via `FormContext` from `../form/form.context`, and uses the shared `Icon` component (typed via `IconName` from `../icons/icons`).
- Uses a `<fieldset>`/`<legend>` pairing for native grouping semantics, with a `biome-ignore` comment explaining why a `role="radio"` button is used in place of a native radio input (native radios can't render a custom icon).

---

## Primary Use Cases
- Satisfaction/feedback surveys (e.g. "How was your visit?") with a numeric scale.
- "Favorite" or mood-style inputs using the heart/smiley icon variants instead of stars.
- Required rating fields inside a `<Form>` that must block submission until a value is chosen.

---

## Limits & Restrictions
- `max` has no enforced upper bound in code, but is expected to be a small integer since each step renders its own icon button in a row.
- `required` only blocks form submission when bound via `name` inside a `<Form>` — it has no effect on a standalone controlled/uncontrolled `Rating`.
- `readOnly` and `disabled` are visually and semantically different: `readOnly` swaps the whole control for a single `role="img"` summary (no per-step buttons, no clear button), while `disabled` keeps the interactive radio buttons/clear button present but inert.
- No component-specific restrictions beyond standard theme token usage.

---

## Component-Specific CSS & Tokens
- `.eink-rating__icon` and `.eink-rating__clear` are fixed-size square buttons using `var(--eink-size-48)`, sized to match each other regardless of icon style.
- `.eink-rating__icon--readonly` strips border/background/cursor styling to render as a plain display element.
- `.eink-rating__icon--no-border` supports `withBorder={false}`.

---

## Related Concepts
- `../form/form.context` and the Form component — for form-bound, required rating fields.
- `../label/label.component` — its CSS classes (`.eink-label`, `.eink-label--form`) are reused directly on `Rating`'s `<legend>`.
- `../icons/icon.tsx` — provides the `heart`, `star`, `mood-smile-beam`, and `close` icons used by this component.
