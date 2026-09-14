import type { HTMLAttributes, KeyboardEvent, ReactNode } from "react";
import { useContext, useEffect, useId, useRef, useState } from "react";
import { cx } from "../../utils/cx.utils";
import { FormContext } from "../form/form.context";
import { Icon } from "../icons/icon";
import { Label } from "../label/label.component";
import "./time-input.component.css";

const HOURS = Array.from({ length: 24 }, (_, hour) => hour);
const MINUTES = Array.from({ length: 60 }, (_, minute) => minute);

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

function parseTime(value: string): { hour: number; minute: number } | undefined {
  const match = /^(\d{2}):(\d{2})$/.exec(value);
  if (!match) return undefined;
  return { hour: Number(match[1]), minute: Number(match[2]) };
}

/** Props accepted by {@link TimeInput}. */
export interface TimeInputProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Label rendered above the field. */
  children: ReactNode;
  /**
   * Field name to bind to the enclosing `<Form>`. When provided, `TimeInput`
   * reads/writes its value through the form context and the `value`/`onChange`
   * props are ignored.
   */
  name?: string;
  /** Current value, as an `HH:MM` string. Ignored when `name` is set. */
  value?: string;
  /** Called with the next `HH:MM` value whenever a time is picked. Ignored when `name` is set. */
  onChange?: (value: string) => void;
  /** Disables the field. Defaults to `false`. */
  disabled?: boolean;
  /** When true, renders a `*` after the label. */
  required?: boolean;
}

/**
 * Single-line time field for e-ink displays. Renders a full-width
 * `<button>` trigger (`aria-haspopup="dialog"`, `aria-expanded`) showing the
 * picked time, which opens a custom hour/minute picker entirely styled by
 * the library — unlike a native `<input type="time">`, whose spinner UI is
 * drawn by the OS/browser and can't be restyled for an e-ink screen.
 *
 * The popup is a `role="dialog"` containing two `role="listbox"` columns
 * (hours, minutes), each with a single option kept in the tab order (roving
 * `tabIndex`) and full keyboard support: `ArrowUp`/`ArrowDown` move by one
 * unit (wrapping at the ends), `Home`/`End` jump to the first/last option,
 * `Enter`/`Space` picks the focused option, and `Escape` or an outside click
 * closes the popup and returns focus to the trigger.
 *
 * Pass `name` to bind it to the enclosing `<Form>`; the form's value for that
 * field is treated as an `HH:MM` string. Without `name`, use it as a
 * controlled component with `value`/`onChange`.
 *
 * @example
 * ```tsx
 * <TimeInput name="alarm">Alarm</TimeInput>
 * <TimeInput value={time} onChange={setTime}>Meeting time</TimeInput>
 * ```
 */
export function TimeInput({
  className,
  children,
  name,
  value,
  onChange,
  disabled = false,
  required,
  ...rest
}: TimeInputProps) {
  const form = useContext(FormContext);
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const hourRefs = useRef(new Map<number, HTMLButtonElement>());
  const minuteRefs = useRef(new Map<number, HTMLButtonElement>());
  const triggerId = useId();

  const currentValue = name && form ? String(form.getValue(name) ?? "") : (value ?? "");
  const parsed = parseTime(currentValue);
  const [focusedHour, setFocusedHour] = useState(parsed?.hour ?? 0);
  const [focusedMinute, setFocusedMinute] = useState(parsed?.minute ?? 0);

  // Focus the hour column's active option only when the popup opens.
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally re-runs only on open, not on every parsed change
  useEffect(() => {
    if (!open) return;
    setFocusedHour(parsed?.hour ?? 0);
    setFocusedMinute(parsed?.minute ?? 0);
    hourRefs.current.get(parsed?.hour ?? 0)?.focus();
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

  const commit = (next: string) => {
    if (name && form) {
      form.setValue(name, next);
    } else {
      onChange?.(next);
    }
  };

  const selectHour = (hour: number) => {
    if (disabled) return;
    setFocusedHour(hour);
    commit(`${pad(hour)}:${pad(parsed?.minute ?? 0)}`);
  };

  const selectMinute = (minute: number) => {
    if (disabled) return;
    setFocusedMinute(minute);
    commit(`${pad(parsed?.hour ?? 0)}:${pad(minute)}`);
  };

  const focusHour = (hour: number) => {
    setFocusedHour(hour);
    hourRefs.current.get(hour)?.focus();
  };

  const focusMinute = (minute: number) => {
    setFocusedMinute(minute);
    minuteRefs.current.get(minute)?.focus();
  };

  const handleHourKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        focusHour((focusedHour - 1 + 24) % 24);
        break;
      case "ArrowDown":
        event.preventDefault();
        focusHour((focusedHour + 1) % 24);
        break;
      case "Home":
        event.preventDefault();
        focusHour(0);
        break;
      case "End":
        event.preventDefault();
        focusHour(23);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        selectHour(focusedHour);
        break;
      default:
        break;
    }
  };

  const handleMinuteKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        focusMinute((focusedMinute - 1 + 60) % 60);
        break;
      case "ArrowDown":
        event.preventDefault();
        focusMinute((focusedMinute + 1) % 60);
        break;
      case "Home":
        event.preventDefault();
        focusMinute(0);
        break;
      case "End":
        event.preventDefault();
        focusMinute(59);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        selectMinute(focusedMinute);
        break;
      default:
        break;
    }
  };

  return (
    <div
      ref={containerRef}
      className={cx("eink-time-input", [className ?? "", !!className])}
      {...rest}
    >
      <Label.Form htmlFor={triggerId} className="eink-time-input__label">
        {children}
        {required ? <span className="eink-time-input__required">*</span> : null}
      </Label.Form>
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        className="eink-time-input__trigger"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="eink-time-input__trigger-label">{currentValue || "HH:MM"}</span>
        <Icon name="clock" size={20} className="eink-time-input__icon" aria-hidden="true" />
      </button>
      {open && (
        <div role="dialog" aria-label="Choose time" className="eink-time-input__popup">
          <div className="eink-time-input__columns">
            <ul
              // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: listbox semantics require a ul/li structure, matching Select's listbox.
              role="listbox"
              aria-label="Hour"
              className="eink-time-input__column"
              onKeyDown={handleHourKeyDown}
            >
              {HOURS.map((hour) => (
                <li key={hour}>
                  <button
                    ref={(node) => {
                      if (node) hourRefs.current.set(hour, node);
                      else hourRefs.current.delete(hour);
                    }}
                    type="button"
                    role="option"
                    tabIndex={hour === focusedHour ? 0 : -1}
                    aria-selected={parsed?.hour === hour}
                    className={cx("eink-time-input__option", [
                      "eink-time-input__option--selected",
                      parsed?.hour === hour,
                    ])}
                    onClick={() => selectHour(hour)}
                    onFocus={() => setFocusedHour(hour)}
                  >
                    {pad(hour)}
                  </button>
                </li>
              ))}
            </ul>
            <ul
              // biome-ignore lint/a11y/noNoninteractiveElementToInteractiveRole: listbox semantics require a ul/li structure, matching Select's listbox.
              role="listbox"
              aria-label="Minute"
              className="eink-time-input__column"
              onKeyDown={handleMinuteKeyDown}
            >
              {MINUTES.map((minute) => (
                <li key={minute}>
                  <button
                    ref={(node) => {
                      if (node) minuteRefs.current.set(minute, node);
                      else minuteRefs.current.delete(minute);
                    }}
                    type="button"
                    role="option"
                    tabIndex={minute === focusedMinute ? 0 : -1}
                    aria-selected={parsed?.minute === minute}
                    className={cx("eink-time-input__option", [
                      "eink-time-input__option--selected",
                      parsed?.minute === minute,
                    ])}
                    onClick={() => selectMinute(minute)}
                    onFocus={() => setFocusedMinute(minute)}
                  >
                    {pad(minute)}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
