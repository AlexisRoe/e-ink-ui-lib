---
type: component
title: "Schedule"
description: "Standalone day view listing a single date's appointments sorted by time, usable on its own or as the day view of Calendar."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/schedule/schedule.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (pending)
---

# Schedule

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Takes a `date` (only year/month/day are used) and a flat `appointments` array (`CalendarAppointment[]` from `src/utils/calendar.utils.ts`); entries for other days are filtered out and the rest sorted by time via `getAppointmentsForDate`
- Header shows the date, defaulting to a full weekday + date string via `Intl.DateTimeFormat` (`{ weekday: "long", year: "numeric", month: "long", day: "numeric" }`), or a custom `title` node
- Optional `onBack` renders a `Button.IconNaked` back-chevron in the header that calls it on click
- Renders an ordered list (`<ol>`) of appointment rows, each showing `time`, `title`, and an optional `description`
- Shows a configurable `emptyLabel` (defaults to `"No appointments"`) instead of the list when there are no appointments for `date`
- Enforces a `min-width`/`min-height` (`--eink-size-320`) for a guaranteed readable size, but otherwise fills the space it's given (`width: 100%; height: 100%`), with the list scrolling internally (`overflow-y: auto`) if it overflows

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` to merge the root className with any consumer-supplied `className`
- BEM classes prefixed `eink-`: block `.eink-schedule`, elements `__header`, `__back`, `__title`, `__list`, `__item`, `__time`, `__content`, `__item-title`, `__description`, `__empty`
- Imports its own stylesheet via `import "./schedule.component.css"`
- Reuses shared components: `Button.IconNaked` (`src/components/button/button.component.tsx`) for the back button, `Title` (`src/components/title/title.component.tsx`) for the header heading
- Delegates date filtering/sorting and day-key derivation to `getAppointmentsForDate`/`toDateKey` in `src/utils/calendar.utils.ts` rather than reimplementing that logic locally

---

## Primary Use Cases
- Displaying a single day's agenda/appointments list, e.g. as a dedicated "day view" screen
- Acting as the day-view sub-component of a larger `Calendar` component, reached by drilling into a specific date
- Any screen needing a scrollable, time-sorted list of events for one date with a back-navigation affordance

---

## Limits & Restrictions
- `date` and `appointments` are required
- Only the year/month/day portion of `date` is used to select appointments — time-of-day on `date` itself is ignored
- Appointments not matching `date` (via `toDateKey`) are silently excluded, not shown as an error state
- `title` fully replaces the default formatted date heading; there's no way to append to the default rather than override it

---

## Component-Specific CSS & Tokens
- No custom properties beyond global theme tokens are defined (`--eink-color-*`, `--eink-border-*`, `--eink-size-*`, `--eink-font-family-main`)
- Notable structural detail: `.eink-schedule` sets `min-width`/`min-height: var(--eink-size-320)` to guarantee a readable minimum footprint

---

## Related Concepts
- `src/utils/calendar.utils.ts` — provides the `CalendarAppointment` type and the `getAppointmentsForDate`/`toDateKey` helpers this component depends on
- `src/components/button/button.component.tsx` — provides `Button.IconNaked` used for the optional back button
- `src/components/title/title.component.tsx` — renders the header heading
