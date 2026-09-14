---
type: component
title: "Calendar"
description: "Black-and-white calendar with month, year, and single-day schedule views, showing appointment count indicators."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/calendar/calendar.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (pending)
---

# Calendar

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Three internal views: year grid, month grid, and a single-day `Schedule` view, navigated via an internal `CalendarProvider`/`useCalendarContext` (not part of the public API).
- Opens on the current month with today's day/month highlighted (`eink-calendar__day--today`, `eink-calendar__month-tile--today`).
- Header lets the user step back/forward a month (or year, in year view), jump to today, and switch between month and year views by clicking the label.
- Accepts an `appointments` array (`CalendarAppointment[]` from `src/utils/calendar.utils.ts`); days/months containing appointments show a count via `Pill.Filled`.
- Clicking a day switches to that day's `Schedule` component; the schedule's back action returns to the month view.
- `today` prop lets callers fix "today" and the initially focused month (defaults to `new Date()`).

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` for all conditional className merging.
- BEM classes prefixed `eink-`: block `.eink-calendar`, elements like `.eink-calendar__header`, `.eink-calendar__grid`, `.eink-calendar__day`, `.eink-calendar__month-tile`, modifiers like `.eink-calendar__day--today`, `.eink-calendar__day--outside`.
- Imports its own stylesheet via `import "./calendar.component.css"`.
- Composes other library components: `Button.IconNaked` (header nav), `Pill.Filled` (appointment counts), `Schedule` (day view).
- State/navigation logic lives in a co-located `calendar.context.tsx` (React context + provider), following the pattern of separating stateful context from presentational markup.
- Date/label helpers (`getMonthGrid`, `groupAppointmentsByDate`, `isSameDay`, `isSameMonth`, `toDateKey`, `MONTH_LABELS`, `WEEKDAY_LABELS`) are imported from the framework-agnostic `src/utils/calendar.utils.ts`.

---

## Primary Use Cases
- A full-screen or panel calendar for e-ink tablets/e-readers where users browse months/years and drill into a day's appointments.
- Displaying appointment density at a glance (per-day and per-month counts) without needing color.
- Quickly jumping back to "today" via the header's calendar icon button (shown in day view).

---

## Limits & Restrictions
- Uses `min-width`/`min-height` (`var(--eink-size-320)`) to guarantee a readable minimum size but otherwise fills its container.
- `CalendarProvider`/`useCalendarContext` are internal; `useCalendarContext` throws if used outside a `Calendar`.
- `appointments` defaults to `[]` if omitted; the day view only renders when a day has actually been selected (`selectedDate` is non-null).

---

## Component-Specific CSS & Tokens
- No component-specific custom properties beyond the global theme tokens (`--eink-size-*`, `--eink-color-*`, `--eink-border-*`, `--eink-font-family-main`) are defined.
- Notable structural/modifier classes: `.eink-calendar__header-nav--inverted` (inverted-color nav buttons), `.eink-calendar__day--today` / `.eink-calendar__day--outside`, `.eink-calendar__month-tile--today`.

---

## Related Concepts
- `src/components/schedule/` — renders the single-day appointment list shown by the calendar's day view.
- `src/components/pill/` — used for appointment count badges.
- `src/components/button/` — `Button.IconNaked` used for header navigation.
