import type { HTMLAttributes, ReactNode } from "react";
import {
  type CalendarAppointment,
  getAppointmentsForDate,
  toDateKey,
} from "../../utils/calendar.utils";
import { cx } from "../../utils/cx.utils";
import { Button } from "../button/button.component";
import { Title } from "../title/title.component";

import "./schedule.component.css";

/** Props accepted by {@link Schedule}. */
export interface ScheduleProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Day the schedule is showing. Only its year/month/day are used. */
  date: Date;
  /** Appointments to render. Entries for other days are ignored; the rest are sorted by time. */
  appointments: CalendarAppointment[];
  /** Heading shown above the list. Defaults to `date` formatted as a full weekday + date. */
  title?: ReactNode;
  /** Shown instead of the list when there are no appointments for `date`. */
  emptyLabel?: ReactNode;
  /** When provided, renders a back button in the header that calls this on click. */
  onBack?: () => void;
}

const DATE_FORMATTER = new Intl.DateTimeFormat(undefined, {
  weekday: "long",
  year: "numeric",
  month: "long",
  day: "numeric",
});

/**
 * Standalone schedule of a single day's {@link CalendarAppointment}s, sorted
 * by time. Usable on its own or as the day view of {@link Calendar}.
 *
 * Renders a header with the date (and an optional back button when `onBack`
 * is provided), followed by one row per appointment showing its time,
 * title, and optional description. Uses `min-width`/`min-height` to
 * guarantee a readable size but otherwise fills the space it's given.
 *
 * @example
 * ```tsx
 * <Schedule
 *   date={new Date()}
 *   appointments={[
 *     { id: "standup", date: "2026-09-14", time: "09:00", title: "Stand-up" },
 *     { id: "review", date: "2026-09-14", time: "14:30", title: "Design review", description: "Room 2B" },
 *   ]}
 * />
 * ```
 */
export function Schedule({
  className,
  date,
  appointments,
  title,
  emptyLabel = "No appointments",
  onBack,
  ...rest
}: ScheduleProps) {
  const dayKey = toDateKey(date);
  const items = getAppointmentsForDate(appointments, date);

  return (
    <div className={cx("eink-schedule", [className ?? "", !!className])} {...rest}>
      <div className="eink-schedule__header">
        {onBack ? (
          <Button.IconNaked
            icon="chevron-left"
            aria-label="Back"
            className="eink-schedule__back"
            onClick={onBack}
          />
        ) : null}
        <Title size={3} className="eink-schedule__title">
          {title ?? DATE_FORMATTER.format(date)}
        </Title>
      </div>
      {items.length === 0 ? (
        <p className="eink-schedule__empty">{emptyLabel}</p>
      ) : (
        <ol className="eink-schedule__list" key={dayKey}>
          {items.map((appointment) => (
            <li key={appointment.id} className="eink-schedule__item">
              <span className="eink-schedule__time">{appointment.time}</span>
              <span className="eink-schedule__content">
                <span className="eink-schedule__item-title">{appointment.title}</span>
                {appointment.description ? (
                  <span className="eink-schedule__description">{appointment.description}</span>
                ) : null}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
