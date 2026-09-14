import type { ChangeEvent, HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { useContext, useId, useState } from "react";
import { cx } from "../../utils/cx.utils";
import { FormContext } from "../form/form.context";
import { Icon } from "../icons/icon";
import { Label } from "../label/label.component";
import { PatternOverlay } from "../pattern-overlay/pattern-overlay.component";
import "./input.component.css";

/** `type` values {@link Input} supports. */
export type InputType = "text" | "password" | "email" | "url" | "tel" | "search" | "number";

/** Props accepted by {@link Input}. */
export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange" | "value" | "children"> {
  /** Label rendered above the field, via {@link Label.Form}. */
  children: ReactNode;
  /** Native input type. Defaults to `"text"`. */
  type?: InputType;
  /**
   * Field name to bind to the enclosing `<Form>`. When provided, `Input`
   * reads/writes its value through the form context and the `value`/
   * `onChange` props are ignored.
   */
  name?: string;
  /** Current value for standalone use, outside a `<Form>`. */
  value?: string;
  /** Called with the next value whenever it changes. Ignored when `name` is set. */
  onChange?: (value: string) => void;
  /**
   * Runs on every change and on blur. Returning a non-empty string renders it
   * as an error message underneath the field and marks the field
   * `aria-invalid`; returning `null`/`undefined`/an empty string clears the
   * error. When bound to a `<Form>` via `name`, the error is also written to
   * the form's error state for that field.
   */
  validate?: (value: string) => string | null | undefined;
  /** Maximum number of characters allowed. */
  maxLength?: number;
  /** Placeholder text shown when the field is empty. */
  placeholder?: string;
  /** Marks the field as required and renders a `*` after the label. */
  required?: boolean;
  /** Disables the field. Defaults to `false`. */
  disabled?: boolean;
  /**
   * For `type="password"`, shows a toggle button to reveal/hide the value.
   * Defaults to `true`.
   */
  useEye?: boolean;
  /** Shows a button to clear the field's value. Defaults to `true`. */
  useClear?: boolean;
  /** Props forwarded to the outer wrapping `<div>`. */
  containerProps?: HTMLAttributes<HTMLDivElement>;
}

/**
 * Single-line text field for e-ink displays, covering text, password,
 * email, url, tel, search and number inputs behind one component. Always
 * full-width, labeled via {@link Label.Form}, and built on a native
 * `<input>` so browser/assistive-tech behavior (autofill, spellcheck,
 * numeric keyboards on mobile, etc.) keeps working.
 *
 * Pass `validate` to check the value on every change and on blur; a
 * returned error string is rendered in a box directly underneath the field
 * (a filled diagonal-stripe swatch on the left, matching the library's
 * e-ink error styling) and the input gets `aria-invalid`/
 * `aria-describedby` pointing at the message. When bound to a `<Form>` via
 * `name`, the error is also written to the form's error state, so
 * `Form.SubmitButton` is disabled while it's present.
 *
 * `type="password"` renders a reveal toggle (disable with `useEye={false}`)
 * and, like every other type, a clear button (disable with
 * `useClear={false}`) that appears once the field has a value.
 *
 * Pass `name` to bind it to the enclosing `<Form>`. Without `name`, use it
 * as a controlled component with `value`/`onChange`.
 *
 * @example
 * ```tsx
 * <Input name="email" type="email" validate={isEmail}>Email</Input>
 * <Input value={pw} onChange={setPw} type="password" maxLength={64}>Password</Input>
 * ```
 */
export function Input({
  className,
  children,
  type = "text",
  name,
  value,
  onChange,
  validate,
  maxLength,
  required,
  disabled = false,
  useEye = true,
  useClear = true,
  containerProps,
  id,
  ...rest
}: InputProps) {
  const form = useContext(FormContext);
  const [internalValue, setInternalValue] = useState("");
  const [standaloneError, setStandaloneError] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const errorId = `${inputId}-error`;

  const currentValue = name && form ? String(form.getValue(name) ?? "") : (value ?? internalValue);
  const error = name && form ? form.getError(name) : (standaloneError ?? undefined);

  const runValidation = (next: string) => {
    if (!validate) return;
    const result = validate(next) || undefined;
    if (name && form) {
      form.setError(name, result);
    } else {
      setStandaloneError(result ?? null);
    }
  };

  const commit = (next: string) => {
    if (name && form) {
      form.setValue(name, next);
    } else {
      if (value === undefined) setInternalValue(next);
      onChange?.(next);
    }
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value;
    commit(next);
    runValidation(next);
  };

  const handleBlur = () => {
    runValidation(currentValue);
  };

  const handleClear = () => {
    if (disabled) return;
    commit("");
    runValidation("");
  };

  const isPassword = type === "password";
  const inputType = isPassword && revealed ? "text" : type;
  const showClear = useClear && currentValue.length > 0 && !disabled;
  const showEye = isPassword && useEye;

  return (
    <div className={cx("eink-input", [className ?? "", !!className])} {...containerProps}>
      <Label.Form htmlFor={inputId} className="eink-input__label">
        {children}
        {required ? <span className="eink-input__required">*</span> : null}
      </Label.Form>
      <div className="eink-input__control">
        <input
          id={inputId}
          name={name}
          type={inputType}
          className="eink-input__field"
          value={currentValue}
          maxLength={maxLength}
          required={required}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={error ? errorId : undefined}
          onChange={handleChange}
          onBlur={handleBlur}
          {...rest}
        />
        {showClear ? (
          <button
            type="button"
            className="eink-input__action"
            aria-label="Clear"
            onClick={handleClear}
          >
            <Icon name="close" size={16} aria-hidden="true" />
          </button>
        ) : null}
        {showEye ? (
          <button
            type="button"
            className="eink-input__action"
            aria-label={revealed ? "Hide password" : "Show password"}
            aria-pressed={revealed}
            disabled={disabled}
            onClick={() => setRevealed((current) => !current)}
          >
            <Icon name={revealed ? "eye-off" : "eye"} size={16} aria-hidden="true" />
          </button>
        ) : null}
      </div>
      {error ? (
        <div id={errorId} role="alert" className="eink-input__error">
          <span className="eink-input__error-swatch">
            <PatternOverlay />
          </span>
          <span className="eink-input__error-message">{error}</span>
        </div>
      ) : null}
    </div>
  );
}
