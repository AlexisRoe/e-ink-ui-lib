/**
 * A single appointment shown by {@link Calendar} and {@link Schedule}.
 *
 * `date` and `time` are kept as plain strings (rather than a `Date`) so
 * appointment data can be authored as static JSON/YAML and stay
 * timezone-free — the calendar always renders the wall-clock time as given.
 *
 * @example
 * ```ts
 * const appointment: CalendarAppointment = {
 *   id: "standup",
 *   date: "2026-09-14",
 *   time: "09:00",
 *   title: "Daily stand-up",
 *   description: "15 minutes, video call",
 * };
 * ```
 */
export interface CalendarAppointment {
  /** Stable unique identifier, used as the React key. */
  id: string;
  /** Date the appointment falls on, as `"YYYY-MM-DD"`. */
  date: string;
  /** Time of day the appointment starts, as 24h `"HH:mm"`. */
  time: string;
  /** Short title shown in the schedule list. */
  title: string;
  /** Optional supporting detail shown below the title. */
  description?: string;
}

/** Formats a `Date` as the `"YYYY-MM-DD"` key used to key {@link CalendarAppointment.date}. */
export function toDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Parses a `"YYYY-MM-DD"` key back into a local `Date` at midnight. */
export function parseDateKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** Whether `a` and `b` fall on the same calendar day. */
export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

/** Whether `a` and `b` fall in the same calendar month and year. */
export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}

/**
 * Full 6-week (42-day) grid of `Date`s covering `month` (0-indexed) of
 * `year`, starting on the Monday on/before the 1st and ending on the Sunday
 * on/after the last day of the month.
 */
export function getMonthGrid(year: number, month: number): Date[] {
  const firstOfMonth = new Date(year, month, 1);
  // Monday-first week: ISO weekday 1..7, Sunday (0) treated as 7.
  const firstWeekday = (firstOfMonth.getDay() + 6) % 7;
  const start = new Date(year, month, 1 - firstWeekday);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });
}

/** Groups `appointments` by their `date` key, each group sorted by `time`. */
export function groupAppointmentsByDate(
  appointments: CalendarAppointment[],
): Map<string, CalendarAppointment[]> {
  const groups = new Map<string, CalendarAppointment[]>();

  for (const appointment of appointments) {
    const group = groups.get(appointment.date);
    if (group) {
      group.push(appointment);
    } else {
      groups.set(appointment.date, [appointment]);
    }
  }

  for (const group of groups.values()) {
    group.sort((a, b) => a.time.localeCompare(b.time));
  }

  return groups;
}

/** Appointments falling on `date`, sorted by time. */
export function getAppointmentsForDate(
  appointments: CalendarAppointment[],
  date: Date,
): CalendarAppointment[] {
  const key = toDateKey(date);
  return appointments
    .filter((appointment) => appointment.date === key)
    .sort((a, b) => a.time.localeCompare(b.time));
}

/** Monday-first weekday labels, for calendar column headers. */
export const WEEKDAY_LABELS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"] as const;

/** Month names, for calendar/year headers. */
export const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;
