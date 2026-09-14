import type { ChangeEvent, InputHTMLAttributes, ReactNode } from "react";
import { useContext, useId } from "react";
import { cx } from "../../utils/cx.utils";
import { FormContext } from "../form/form.context";
import { Label } from "../label/label.component";
import "./date-input.component.css";

/** Props accepted by {@link DateInput}. */
export interface DateInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "children" | "onChange" | "value" | "defaultValue" | "id"
  > {
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
  /** Called with the next `YYYY-MM-DD` value on every change. Ignored when `name` is set. */
  onChange?: (value: string) => void;
  /** When true, renders a `*` after the label and sets the native `required` state. */
  required?: boolean;
}

/**
 * Single-line date field for e-ink displays, rendered as a native
 * `<input type="date">` associated with its label via a wrapping `<label>`.
 * Always spans the full width of its container. Delegates date parsing,
 * formatting, and picker UI to the browser, keeping the markup minimal.
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
  disabled,
  required,
  ...rest
}: DateInputProps) {
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
    <div className={cx("eink-date-input", [className ?? "", !!className])}>
      <Label.Form htmlFor={inputId} className="eink-date-input__label">
        {children}
        {required ? <span className="eink-date-input__required">*</span> : null}
      </Label.Form>
      <input
        {...rest}
        id={inputId}
        type="date"
        className="eink-date-input__input"
        value={currentValue}
        onChange={handleChange}
        disabled={disabled}
        required={required}
        name={name}
      />
    </div>
  );
}
