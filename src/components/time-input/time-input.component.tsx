import type { ChangeEvent, InputHTMLAttributes, ReactNode } from "react";
import { useContext, useId } from "react";
import { cx } from "../../utils/cx.utils";
import { FormContext } from "../form/form.context";
import { Label } from "../label/label.component";
import "./time-input.component.css";

/** Props accepted by {@link TimeInput}. */
export interface TimeInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "children" | "onChange" | "value" | "defaultValue" | "id"
  > {
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
  /** Called with the next `HH:MM` value on every change. Ignored when `name` is set. */
  onChange?: (value: string) => void;
  /** When true, renders a `*` after the label and sets the native `required` state. */
  required?: boolean;
}

/**
 * Single-line time field for e-ink displays, rendered as a native
 * `<input type="time">` associated with its label via a wrapping `<label>`.
 * Always spans the full width of its container. Delegates time parsing,
 * formatting, and picker UI to the browser, keeping the markup minimal.
 *
 * Pass `name` to bind it to the enclosing `<Form>`; the form's value for that
 * field is treated as an `HH:MM` string. Without `name`, use it as a
 * controlled component with `value`/`onChange`.
 *
 * @example
 * ```tsx
 * <TimeInput name="alarm">Alarm</TimeInput>
 * <TimeInput value={time} onChange={setTime} min="09:00" max="17:00">Meeting time</TimeInput>
 * ```
 */
export function TimeInput({
  className,
  children,
  name,
  value,
  onChange,
  disabled,
  required,
  ...rest
}: TimeInputProps) {
  const form = useContext(FormContext);
  const inputId = useId();
  const currentValue = name && form ? String(form.getValue(name) ?? "") : (value ?? "");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    if (name && form) {
      form.setValue(name, next);
    } else {
      onChange?.(next);
    }
  };

  return (
    <div className={cx("eink-time-input", [className ?? "", !!className])}>
      <Label.Form htmlFor={inputId} className="eink-time-input__label">
        {children}
        {required ? <span className="eink-time-input__required">*</span> : null}
      </Label.Form>
      <input
        {...rest}
        id={inputId}
        type="time"
        className="eink-time-input__input"
        value={currentValue}
        onChange={handleChange}
        disabled={disabled}
        required={required}
        name={name}
      />
    </div>
  );
}
