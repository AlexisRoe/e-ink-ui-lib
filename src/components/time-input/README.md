---
type: component
title: "TimeInput"
description: "Single-line time field that opens a fully custom-styled hour/minute picker dialog, instead of the OS-drawn native time spinner."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/time-input/time-input.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (pending)
---

# TimeInput

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Full-width `<button>` trigger (`aria-haspopup="dialog"`, `aria-expanded`) that displays the picked time as `HH:MM` (placeholder text is `"HH:MM"` when empty), with a clock icon
- Opens a `role="dialog"` popup entirely styled by the library (unlike native `<input type="time">`, whose spinner UI is drawn by the OS/browser), containing two `role="listbox"` columns (hour: 0-23, minute: 0-59)
- Each listbox column supports roving `tabIndex` keyboard navigation: `ArrowUp`/`ArrowDown` move by one unit and wrap at the ends, `Home`/`End` jump to first/last option, `Enter`/`Space` picks the focused option
- `Escape` or an outside click closes the popup and returns focus to the trigger
- Selecting an hour or minute commits immediately (no separate "confirm" step) as an `HH:MM` string
- Can bind to an enclosing `<Form>` via `name` (reads/writes through `FormContext`), or be used as a controlled component via `value`/`onChange`
- `disabled` and `required` (renders a `*` after the label) props

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` for all conditional class merging (root className, selected option modifier)
- BEM classes prefixed `eink-`: block `.eink-time-input`, elements `__label`, `__required`, `__trigger`, `__trigger-label`, `__icon`, `__popup`, `__columns`, `__column`, `__option`; modifier `.eink-time-input__option--selected`
- Imports its own stylesheet via `import "./time-input.component.css"`
- Reuses shared components: `Label.Form` (`src/components/label/label.component.tsx`) for the field label, and `Icon` (`src/components/icons/icon.tsx`) for the clock icon
- Integrates with the library's form system via `FormContext` from `src/components/form/form.context.ts`
- Uses `biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole` comments on the `<ul role="listbox">` elements, matching the pattern used by `Select`'s and `DateInput`'s listboxes
- Mirrors `DateInput`'s implementation structure closely (same trigger/popup/listbox pattern, same CSS class shape) but for `HH:MM` values with two columns instead of three

---

## Primary Use Cases
- Alarm, meeting-time, or scheduling fields inside forms where a consistent, restylable time picker UI is needed across e-ink devices
- Fields bound directly to a `<Form>` via `name`, storing values as `HH:MM` strings

---

## Limits & Restrictions
- `children` (the label) is required
- Values are always `HH:MM` strings (24-hour, zero-padded) — no AM/PM or other formats are accepted for `value`/`onChange`
- When `name` is set and a `<Form>` ancestor exists, the `value`/`onChange` props are ignored — the form context is the source of truth
- There is no `min`/`max` time-range restriction (unlike `DateInput`'s `min`/`max`) — any hour/minute combination is selectable
- `disabled` prevents commits even if a picker interaction is attempted

---

## Component-Specific CSS & Tokens
- No custom properties beyond global theme tokens are defined (`--eink-color-*`, `--eink-border-medium`, `--eink-size-*`, `--eink-font-size-default`, `--eink-z-index-modal`)
- Notable structural classes: `.eink-time-input__popup` (absolutely positioned dialog using `--eink-z-index-modal`), `.eink-time-input__column` (fixed-width scrollable listbox column, shared visual shape with `DateInput`'s columns), `.eink-time-input__option--selected` (inverted color for the selected hour/minute)

---

## Related Concepts
- `src/components/date-input/date-input.component.tsx` — analogous custom-picker input for date values, sharing the same trigger/popup/listbox structure
- `src/components/label/label.component.tsx` — provides the `Label.Form` used for the field label
- `src/components/form/form.context.ts` — provides the `FormContext` used for form binding
- `src/components/select/` — shares the roving-tabIndex `role="listbox"` pattern referenced in the biome-ignore comments
