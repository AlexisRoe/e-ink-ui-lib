---
type: component
title: "DateInput"
description: "Single-line date field that opens a fully custom-styled day/month/year picker dialog, instead of the OS-drawn native date picker."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/date-input/date-input.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (2026-09-14T18:19:01.260Z)
---

# DateInput

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Full-width `<button>` trigger (`aria-haspopup="dialog"`, `aria-expanded`) that displays the picked date as `DD.MM.YYYY` (placeholder text is `"DD.MM.YYYY"` when empty), with a calendar icon
- Opens a `role="dialog"` popup entirely styled by the library (unlike native `<input type="date">`, whose picker is drawn by the OS/browser), containing three `role="listbox"` columns (day, month, year)
- Each listbox column supports roving `tabIndex` keyboard navigation: `ArrowUp`/`ArrowDown` move by one unit and wrap at the ends, `Home`/`End` jump to first/last option, `Enter`/`Space` picks the focused option
- `Escape` or an outside click closes the popup and returns focus to the trigger
- Picking a month/year that would put the selected day out of range (e.g. day 31 in February) clamps the day to the new month's last valid day
- Supports `min`/`max` ISO date bounds that constrain which committed dates are accepted
- Can bind to an enclosing `<Form>` via `name` (reads/writes through `FormContext`), or be used as a controlled component via `value`/`onChange`
- `disabled` and `required` (renders a `*` after the label) props

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` for all conditional class merging (root className, selected option modifier)
- BEM classes prefixed `eink-`: block `.eink-date-input`, elements `__label`, `__required`, `__trigger`, `__trigger-label`, `__icon`, `__popup`, `__columns`, `__column`, `__option`; modifier `.eink-date-input__option--selected`
- Imports its own stylesheet via `import "./date-input.component.css"`
- Reuses shared components: `Label.Form` (`src/components/label/label.component.tsx`) for the field label, and `Icon` (`src/components/icons/icon.tsx`) for the calendar icon
- Integrates with the library's form system via `FormContext` from `src/components/form/form.context.ts`
- Uses `biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole` comments on the `<ul role="listbox">` elements, matching the pattern used by `Select`'s listbox

---

## Primary Use Cases
- Date-of-birth, start-date/end-date, or scheduling fields inside forms where a consistent, restylable picker UI is needed across e-ink devices
- Fields bound directly to a `<Form>` via `name`, storing values as ISO `YYYY-MM-DD` strings
- Date fields with bounded ranges via `min`/`max` (e.g. disallowing past or far-future dates)

---

## Limits & Restrictions
- `children` (the label) is required
- Values are always ISO `YYYY-MM-DD` strings — no other date formats are accepted for `value`/`onChange`/`min`/`max`
- When `name` is set and a `<Form>` ancestor exists, the `value`/`onChange` props are ignored — the form context is the source of truth
- Year range in the picker defaults to 100 years before to 10 years after the current year when `min`/`max` don't specify otherwise
- `disabled` prevents commits even if a picker interaction is attempted

---

## Component-Specific CSS & Tokens
- No custom properties beyond the global theme tokens are defined (`--eink-color-*`, `--eink-border-medium`, `--eink-size-*`, `--eink-font-size-default`, `--eink-z-index-modal`)
- Notable structural classes: `.eink-date-input__popup` (absolutely positioned dialog using `--eink-z-index-modal`), `.eink-date-input__column` (fixed-width scrollable listbox column), `.eink-date-input__option--selected` (inverted color for the selected day/month/year)

---

## Related Concepts
- `src/components/time-input/time-input.component.tsx` — analogous custom-picker input for time values
- `src/components/label/label.component.tsx` — provides the `Label.Form` used for the field label
- `src/components/form/form.context.ts` — provides the `FormContext` used for form binding
- `src/components/select/` — shares the roving-tabIndex `role="listbox"` pattern referenced in the biome-ignore comments
