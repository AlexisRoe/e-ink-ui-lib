import type {
  ChangeEvent,
  ClipboardEvent,
  FocusEvent,
  InputHTMLAttributes,
  KeyboardEvent,
  ReactNode,
} from "react";
import { useCallback, useContext, useEffect, useRef } from "react";
import { cx } from "../../utils/cx.utils";
import { FormContext } from "../form/form.context";
import "../label/label.component.css";
import "./pin.component.css";

/** Props accepted by {@link Pin}. */
export interface PinProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | "type"
    | "children"
    | "onChange"
    | "value"
    | "defaultValue"
    | "id"
    | "maxLength"
    | "pattern"
    | "inputMode"
    | "autoComplete"
  > {
  /** Label rendered above the digit boxes. */
  children: ReactNode;
  /**
   * Field name to bind to the enclosing `<Form>`. When provided, `Pin`
   * reads/writes its string value through the form context and the
   * `value`/`onChange` props are ignored.
   */
  name?: string;
  /** Current value. Ignored when `name` is set. */
  value?: string;
  /** Called with the next value whenever a digit is entered, removed, or pasted. Ignored when `name` is set. */
  onChange?: (value: string) => void;
  /** Number of digit boxes to render. */
  length: number;
  /** Whether each digit is rendered masked (`type="password"`). Defaults to `true`. */
  useMask?: boolean;
  /** When true, renders a `*` after the label and marks every box as required. */
  required?: boolean;
}

/**
 * Fixed-length numeric code input for e-ink displays (PIN, OTP, etc.),
 * rendered as one native `<input>` per digit inside a `<fieldset>`/`<legend>`
 * so the whole group shares a single accessible label. Each box uses
 * `inputMode="numeric"` and accepts a single character, auto-advancing focus
 * to the next box as digits are entered (so a full code can be typed without
 * ever clicking) and back to the previous box on backspace. Focusing a box
 * selects its existing digit, so typing over an already-filled box replaces
 * it instead of being blocked by its length limit; arrow keys also move
 * focus between boxes.
 *
 * Digits are masked with `type="password"` by default; pass `useMask={false}`
 * to render them as plain text instead.
 *
 * Pass an initial `value` (or a `name`-bound `<Form>` field with an initial
 * value) to prefill the boxes.
 *
 * Pasting anywhere in the group (typically into the first box) distributes
 * the clipboard's digits across the remaining boxes from that point on,
 * so a full code can be filled in one paste.
 *
 * Pass `name` to bind it to the enclosing `<Form>`; the form's value for that
 * field is treated as the code string. Without `name`, use it as a
 * controlled component with `value`/`onChange`.
 *
 * Pass `required` to render a `*` after the label and mark every box as
 * required. When bound to a `<Form>` via `name`, the component also sets its
 * own field error whenever the code is shorter than `length` (or, if
 * `required`, empty), which keeps `Form.SubmitButton` disabled until a full
 * code has been entered.
 *
 * @example
 * ```tsx
 * <Pin name="pin" length={4}>PIN code</Pin>
 * <Pin value={code} onChange={setCode} length={6} useMask={false}>One-time code</Pin>
 * ```
 */
export function Pin({
  className,
  children,
  name,
  value,
  onChange,
  length,
  useMask = true,
  disabled,
  required,
  ...rest
}: PinProps) {
  const form = useContext(FormContext);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const currentValue = (name && form ? String(form.getValue(name) ?? "") : (value ?? "")).slice(
    0,
    length,
  );
  const digits = Array.from({ length }, (_, index) => currentValue[index] ?? "");

  const validate = useCallback(
    (next: string) => {
      if (required && next.length === 0) return "Enter a code";
      if (next.length > 0 && next.length < length) return `Enter all ${length} digits`;
      return undefined;
    },
    [required, length],
  );

  const commit = (next: string) => {
    if (name && form) {
      form.setValue(name, next);
      const nextError = validate(next);
      if (form.getError(name) !== nextError) {
        form.setError(name, nextError);
      }
    } else {
      onChange?.(next);
    }
  };

  // Validate the initial/prefilled value too, so an incomplete code blocks
  // submission from the start rather than only after the first edit.
  useEffect(() => {
    if (name && form) {
      const nextError = validate(currentValue);
      if (form.getError(name) !== nextError) {
        form.setError(name, nextError);
      }
    }
  }, [name, form, currentValue, validate]);

  const setDigitAt = (index: number, digit: string) => {
    const next = digits.slice();
    next[index] = digit;
    commit(next.join(""));
  };

  const focusBox = (index: number) => {
    inputRefs.current[index]?.focus();
  };

  const handleChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
    const digit = event.target.value.replace(/\D/g, "").slice(-1);
    setDigitAt(index, digit);
    if (digit && index < length - 1) {
      focusBox(index + 1);
    }
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace" && !digits[index] && index > 0) {
      event.preventDefault();
      setDigitAt(index - 1, "");
      focusBox(index - 1);
    } else if (event.key === "ArrowLeft" && index > 0) {
      event.preventDefault();
      focusBox(index - 1);
    } else if (event.key === "ArrowRight" && index < length - 1) {
      event.preventDefault();
      focusBox(index + 1);
    }
  };

  const handleFocus = (event: FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

  const handlePaste = (index: number, event: ClipboardEvent<HTMLInputElement>) => {
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;
    event.preventDefault();
    const next = digits.slice();
    let cursor = index;
    for (const char of pasted) {
      if (cursor >= length) break;
      next[cursor] = char;
      cursor++;
    }
    commit(next.join(""));
    focusBox(Math.min(cursor, length - 1));
  };

  return (
    <fieldset disabled={disabled} className={cx("eink-pin", [className ?? "", !!className])}>
      <legend className="eink-label eink-label--form eink-pin__label">
        {children}
        {required ? <span className="eink-pin__required">*</span> : null}
      </legend>
      <div className="eink-pin__boxes">
        {digits.map((digit, index) => (
          <input
            {...rest}
            // biome-ignore lint/suspicious/noArrayIndexKey: boxes are a fixed-length, position-only sequence
            key={`digit-${index}`}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type={useMask ? "password" : "text"}
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            className="eink-pin__input"
            value={digit}
            required={required}
            aria-label={`Digit ${index + 1} of ${length}`}
            onChange={(event) => handleChange(index, event)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onFocus={handleFocus}
            onPaste={(event) => handlePaste(index, event)}
          />
        ))}
      </div>
    </fieldset>
  );
}
