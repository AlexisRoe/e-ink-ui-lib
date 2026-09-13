import type { HTMLAttributes } from "react";
import {
  type CalendarAppointment,
  getMonthGrid,
  groupAppointmentsByDate,
  isSameDay,
  isSameMonth,
  MONTH_LABELS,
  toDateKey,
  WEEKDAY_LABELS,
} from "../../utils/calendar.utils";
import { cx } from "../../utils/cx.utils";
import { Button } from "../button/button.component";
import { Pill } from "../pill/pill.component";
import { Schedule } from "../schedule/schedule.component";
import { CalendarProvider, useCalendarContext } from "./calendar.context";

import "./calendar.component.css";

/** Props accepted by {@link Calendar}. */
export interface CalendarProps extends HTMLAttributes<HTMLDivElement> {
  /** Appointments to plot as indicators and show in the day schedule. Defaults to `[]`. */
  appointments?: CalendarAppointment[];
  /** Date treated as "today" and used for the initially focused month. Defaults to `new Date()`. */
  today?: Date;
}

function CalendarHeader() {
  const {
    view,
    focusedDate,
    selectedDate,
    goToPrevious,
    goToNext,
    goToToday,
    showYear,
    showMonth,
  } = useCalendarContext();

  const label =
    view === "year"
      ? `${focusedDate.getFullYear()}`
      : view === "month"
        ? `${MONTH_LABELS[focusedDate.getMonth()]} ${focusedDate.getFullYear()}`
        : (selectedDate ?? focusedDate).toLocaleDateString(undefined, {
            month: "long",
            year: "numeric",
          });

  return (
    <div className="eink-calendar__header">
      {view === "day" ? (
        <Button.IconNaked
          icon="chevron-left"
          aria-label="Back to month"
          className="eink-calendar__header-nav eink-calendar__header-nav--inverted"
          onClick={showMonth}
        />
      ) : (
        <Button.IconNaked
          icon="chevron-left"
          aria-label="Previous"
          className="eink-calendar__header-nav eink-calendar__header-nav--inverted"
          onClick={goToPrevious}
        />
      )}
      <button
        type="button"
        className="eink-calendar__header-label"
        onClick={view === "month" ? showYear : undefined}
        disabled={view !== "month"}
      >
        {label}
      </button>
      {view === "day" ? (
        <Button.IconNaked
          icon="calendar"
          aria-label="Today"
          className="eink-calendar__header-nav eink-calendar__header-nav--inverted"
          onClick={goToToday}
        />
      ) : (
        <Button.IconNaked
          icon="chevron-right"
          aria-label="Next"
          className="eink-calendar__header-nav eink-calendar__header-nav--inverted"
          onClick={goToNext}
        />
      )}
    </div>
  );
}

function CalendarMonthView({ appointments }: { appointments: CalendarAppointment[] }) {
  const { focusedDate, today, selectDay } = useCalendarContext();
  const days = getMonthGrid(focusedDate.getFullYear(), focusedDate.getMonth());
  const byDate = groupAppointmentsByDate(appointments);

  return (
    <div className="eink-calendar__month">
      <div className="eink-calendar__weekdays">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label} className="eink-calendar__weekday">
            {label}
          </span>
        ))}
      </div>
      <div className="eink-calendar__grid">
        {days.map((day) => {
          const count = byDate.get(toDateKey(day))?.length;
          const isToday = isSameDay(day, today);
          const isOutside = !isSameMonth(day, focusedDate);

          return (
            <button
              type="button"
              key={day.toISOString()}
              className={cx(
                "eink-calendar__day",
                ["eink-calendar__day--today", isToday],
                ["eink-calendar__day--outside", isOutside],
              )}
              onClick={() => selectDay(day)}
            >
              <span className="eink-calendar__day-number">{day.getDate()}</span>
              {count ? (
                <Pill.Filled size="sm" className="eink-calendar__day-count">
                  {count}
                </Pill.Filled>
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CalendarYearView({ appointments }: { appointments: CalendarAppointment[] }) {
  const { focusedDate, today, selectMonth } = useCalendarContext();
  const byDate = groupAppointmentsByDate(appointments);
  const year = focusedDate.getFullYear();

  const countForMonth = (month: number) => {
    let total = 0;
    for (const [key, group] of byDate) {
      const [y, m] = key.split("-").map(Number);
      if (y === year && m - 1 === month) total += group.length;
    }
    return total;
  };

  return (
    <div className="eink-calendar__year">
      {MONTH_LABELS.map((label, month) => {
        const count = countForMonth(month);
        const isCurrent = today.getFullYear() === year && today.getMonth() === month;

        return (
          <button
            type="button"
            key={label}
            className={cx("eink-calendar__month-tile", [
              "eink-calendar__month-tile--today",
              isCurrent,
            ])}
            onClick={() => selectMonth(month)}
          >
            <span>{label}</span>
            {count ? (
              <Pill.Filled size="sm" className="eink-calendar__month-tile-count">
                {count}
              </Pill.Filled>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

function CalendarBody({ appointments }: { appointments: CalendarAppointment[] }) {
  const { view, selectedDate, backToMonth } = useCalendarContext();

  if (view === "year") return <CalendarYearView appointments={appointments} />;
  if (view === "day" && selectedDate) {
    return (
      <Schedule
        date={selectedDate}
        appointments={appointments}
        onBack={backToMonth}
        className="eink-calendar__schedule"
      />
    );
  }
  return <CalendarMonthView appointments={appointments} />;
}

/**
 * Black-and-white calendar with month, year, and single-day schedule views,
 * driven by an internal React context (not part of the public API).
 *
 * Opens on the current month with today highlighted. Clicking a day
 * switches to its {@link Schedule}; clicking the header label switches to
 * the year view, from which picking a month returns to the month view.
 * Days/months with {@link CalendarAppointment}s show a count indicator.
 *
 * Uses `min-width`/`min-height` to guarantee a readable size but otherwise
 * fills the space it's given.
 *
 * @example
 * ```tsx
 * <Calendar
 *   appointments={[
 *     { id: "standup", date: "2026-09-14", time: "09:00", title: "Stand-up" },
 *   ]}
 * />
 * ```
 */
export function Calendar({ className, appointments = [], today, ...rest }: CalendarProps) {
  return (
    <CalendarProvider initialDate={today}>
      <div className={cx("eink-calendar", [className ?? "", !!className])} {...rest}>
        <CalendarHeader />
        <div className="eink-calendar__body">
          <CalendarBody appointments={appointments} />
        </div>
      </div>
    </CalendarProvider>
  );
}
