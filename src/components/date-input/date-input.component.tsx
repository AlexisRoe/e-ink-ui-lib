import type { HTMLAttributes, KeyboardEvent, ReactNode } from "react";
import { useContext, useEffect, useId, useRef, useState } from "react";
import { cx } from "../../utils/cx.utils";
import { FormContext } from "../form/form.context";
import { Icon } from "../icons/icon";
import { Label } from "../label/label.component";
import "./date-input.component.css";

const MONTH_NAMES = [
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
];
const MONTH_SHORT = MONTH_NAMES.map((name) => name.slice(0, 3));

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function toIso(year: number, month: number, day: number): string {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

function parseIso(value: string): { year: number; month: number; day: number } | undefined {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return undefined;
  return { year: Number(match[1]), month: Number(match[2]) - 1, day: Number(match[3]) };
}

function formatDisplay(value: string): string {
  const parsed = parseIso(value);
  if (!parsed) return "";
  return `${pad(parsed.day)}.${pad(parsed.month + 1)}.${parsed.year}`;
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/** Props accepted by {@link DateInput}. */
export interface DateInputProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Label rendered above the field. */
  children: ReactNode;
  /**
   * Field name to bind to the enclosing `<Form>`. When provided, `DateInput`
   * reads/writes its value through the form context and the `value`/`onChange`
   * props are ignored.
   */
  name?: string;
  /** Current value, as an ISO `YYYY-MM-DD` string. Ignored when `name` is set. */
  value?: string;
  /** Called with the next `YYYY-MM-DD` value whenever a date is picked. Ignored when `name` is set. */
  onChange?: (value: string) => void;
  /** Earliest selectable date, as an ISO `YYYY-MM-DD` string. */
  min?: string;
  /** Latest selectable date, as an ISO `YYYY-MM-DD` string. */
  max?: string;
  /** Disables the field. Defaults to `false`. */
  disabled?: boolean;
  /** When true, renders a `*` after the label. */
  required?: boolean;
}

/**
 * Single-line date field for e-ink displays. Renders a full-width
 * `<button>` trigger (`aria-haspopup="dialog"`, `aria-expanded`) showing the
 * picked date, which opens a custom day/month/year picker entirely styled by
 * the library — unlike a native `<input type="date">`, whose picker is drawn
 * by the OS/browser and can't be restyled for an e-ink screen.
 *
 * The popup is a `role="dialog"` containing three `role="listbox"` columns
 * (day, month, year), each with a single option kept in the tab order
 * (roving `tabIndex`) and full keyboard support: `ArrowUp`/`ArrowDown` move
 * by one unit (wrapping at the ends), `Home`/`End` jump to the first/last
 * option, `Enter`/`Space` picks the focused option, and `Escape` or an
 * outside click closes the popup and returns focus to the trigger. Picking a
 * month or year that would put the selected day out of range (e.g. day 31 in
 * February) clamps the day to the new month's last day.
 *
 * Pass `name` to bind it to the enclosing `<Form>`; the form's value for that
 * field is treated as an ISO `YYYY-MM-DD` string. Without `name`, use it as a
 * controlled component with `value`/`onChange`.
 *
 * @example
 * ```tsx
 * <DateInput name="birthday">Birthday</DateInput>
 * <DateInput value={date} onChange={setDate} min="2024-01-01">Start date</DateInput>
 * ```
 */
export function DateInput({
  className,
  children,
  name,
  value,
  onChange,
  min,
  max,
  disabled = false,
  required,
  ...rest
}: DateInputProps) {
  const form = useContext(FormContext);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dayRefs = useRef(new Map<number, HTMLButtonElement>());
  const monthRefs = useRef(new Map<number, HTMLButtonElement>());
  const yearRefs = useRef(new Map<number, HTMLButtonElement>());
  const triggerId = useId();

  const currentValue = name && form ? String(form.getValue(name) ?? "") : (value ?? "");
  const parsed = parseIso(currentValue);
  const today = new Date();
  const minYear = min
    ? (parseIso(min)?.year ?? today.getFullYear() - 100)
    : today.getFullYear() - 100;
  const maxYear = max
    ? (parseIso(max)?.year ?? today.getFullYear() + 10)
    : today.getFullYear() + 10;
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, index) => minYear + index);

  const [focusedDay, setFocusedDay] = useState(parsed?.day ?? today.getDate());
  const [focusedMonth, setFocusedMonth] = useState(parsed?.month ?? today.getMonth());
  const [focusedYear, setFocusedYear] = useState(parsed?.year ?? today.getFullYear());

  // Focus the day column's active option only when the popup opens.
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally re-runs only on open, not on every parsed change
  useEffect(() => {
    if (!open) return;
    setFocusedDay(parsed?.day ?? today.getDate());
    setFocusedMonth(parsed?.month ?? today.getMonth());
    setFocusedYear(parsed?.year ?? today.getFullYear());
    dayRefs.current.get(parsed?.day ?? today.getDate())?.focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const isInRange = (iso: string) => !(min && iso < min) && !(max && iso > max);

  const commit = (day: number, month: number, year: number) => {
    if (disabled) return;
    const clampedDay = Math.min(day, daysInMonth(year, month));
    const iso = toIso(year, month, clampedDay);
    if (!isInRange(iso)) return;
    setFocusedMonth(month);
    setFocusedYear(year);
    if (name && form) {
      form.setValue(name, iso);
    } else {
      onChange?.(iso);
    }
  };

  const focusDay = (day: number) => {
    setFocusedDay(day);
    dayRefs.current.get(day)?.focus();
  };
  const focusMonth = (month: number) => {
    setFocusedMonth(month);
    monthRefs.current.get(month)?.focus();
  };
  const focusYear = (year: number) => {
    setFocusedYear(year);
    yearRefs.current.get(year)?.focus();
  };

  const dayCount = daysInMonth(focusedYear, focusedMonth);
  const days = Array.from({ length: dayCount }, (_, index) => index + 1);

  const handleDayKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        focusDay(((focusedDay - 2 + dayCount) % dayCount) + 1);
        break;
      case "ArrowDown":
        event.preventDefault();
        focusDay((focusedDay % dayCount) + 1);
        break;
      case "Home":
        event.preventDefault();
        focusDay(1);
        break;
      case "End":
        event.preventDefault();
        focusDay(dayCount);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        commit(focusedDay, focusedMonth, focusedYear);
        break;
      default:
        break;
    }
  };

  const handleMonthKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        focusMonth((focusedMonth - 1 + 12) % 12);
        break;
      case "ArrowDown":
        event.preventDefault();
        focusMonth((focusedMonth + 1) % 12);
        break;
      case "Home":
        event.preventDefault();
        focusMonth(0);
        break;
      case "End":
        event.preventDefault();
        focusMonth(11);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        commit(focusedDay, focusedMonth, focusedYear);
        break;
      default:
        break;
    }
  };

  const handleYearKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    const index = years.indexOf(focusedYear);
    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        focusYear(years[Math.max(index - 1, 0)] ?? focusedYear);
        break;
      case "ArrowDown":
        event.preventDefault();
        focusYear(years[Math.min(index + 1, years.length - 1)] ?? focusedYear);
        break;
      case "Home":
        event.preventDefault();
        focusYear(years[0] ?? focusedYear);
        break;
      case "End":
        event.preventDefault();
        focusYear(years[years.length - 1] ?? focusedYear);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        commit(focusedDay, focusedMonth, focusedYear);
        break;
      default:
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      className={cx("eink-date-input", [className ?? "", !!className])}
      {...rest}
    >
      <Label.Form htmlFor={triggerId} className="eink-date-input__label">
        {children}
        {required ? <span className="eink-date-input__required">*</span> : null}
      </Label.Form>
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        className="eink-date-input__trigger"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="eink-date-input__trigger-label">
          {currentValue ? formatDisplay(currentValue) : "DD.MM.YYYY"}
        </span>
        <Icon name="calendar" size={20} className="eink-date-input__icon" aria-hidden="true" />
      </button>
      {open && (
        <div role="dialog" aria-label="Choose date" className="eink-date-input__popup">
          <div className="eink-date-input__columns">
            <ul
              // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: listbox semantics require a ul/li structure, matching Select's listbox.
              role="listbox"
              aria-label="Day"
              className="eink-date-input__column"
              onKeyDown={handleDayKeyDown}
            >
              {days.map((day) => {
                const isSelected =
                  parsed?.day === day &&
                  parsed?.month === focusedMonth &&
                  parsed?.year === focusedYear;
                return (
                  <li key={day}>
                    <button
                      ref={(node) => {
                        if (node) dayRefs.current.set(day, node);
                        else dayRefs.current.delete(day);
                      }}
                      type="button"
                      role="option"
                      tabIndex={day === focusedDay ? 0 : -1}
                      aria-selected={isSelected}
                      className={cx("eink-date-input__option", [
                        "eink-date-input__option--selected",
                        isSelected,
                      ])}
                      onClick={() => commit(day, focusedMonth, focusedYear)}
                      onFocus={() => setFocusedDay(day)}
                    >
                      {pad(day)}
                    </button>
                  </li>
                );
              })}
            </ul>
            <ul
              // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: listbox semantics require a ul/li structure, matching Select's listbox.
              role="listbox"
              aria-label="Month"
              className="eink-date-input__column"
              onKeyDown={handleMonthKeyDown}
            >
              {MONTH_SHORT.map((label, month) => {
                const isSelected = parsed?.month === month && parsed?.year === focusedYear;
                return (
                  <li key={label}>
                    <button
                      ref={(node) => {
                        if (node) monthRefs.current.set(month, node);
                        else monthRefs.current.delete(month);
                      }}
                      type="button"
                      role="option"
                      tabIndex={month === focusedMonth ? 0 : -1}
                      aria-selected={isSelected}
                      aria-label={MONTH_NAMES[month]}
                      className={cx("eink-date-input__option", [
                        "eink-date-input__option--selected",
                        isSelected,
                      ])}
                      onClick={() => commit(focusedDay, month, focusedYear)}
                      onFocus={() => setFocusedMonth(month)}
                    >
                      {label}
                    </button>
                  </li>
                );
              })}
            </ul>
            <ul
              // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: listbox semantics require a ul/li structure, matching Select's listbox.
              role="listbox"
              aria-label="Year"
              className="eink-date-input__column"
              onKeyDown={handleYearKeyDown}
            >
              {years.map((year) => {
                const isSelected = parsed?.year === year;
                return (
                  <li key={year}>
                    <button
                      ref={(node) => {
                        if (node) yearRefs.current.set(year, node);
                        else yearRefs.current.delete(year);
                      }}
                      type="button"
                      role="option"
                      tabIndex={year === focusedYear ? 0 : -1}
                      aria-selected={isSelected}
                      className={cx("eink-date-input__option", [
                        "eink-date-input__option--selected",
                        isSelected,
                      ])}
                      onClick={() => commit(focusedDay, focusedMonth, year)}
                      onFocus={() => setFocusedYear(year)}
                    >
                      {year}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
