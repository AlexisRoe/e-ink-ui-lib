import type { HTMLAttributes, ReactNode } from "react";
import { useContext, useId, useState } from "react";
import { cx } from "../../utils/cx.utils";
import { FormContext } from "../form/form.context";
import { Icon } from "../icons/icon";
import { Label } from "../label/label.component";
import "./keypad.component.css";

type KeypadKey =
  | { type: "digit"; digit: string }
  | { type: "clear" }
  | { type: "backspace" }
  | { type: "decimal" }
  | { type: "empty" };

const DIGIT_ROWS: KeypadKey[][] = [
  [
    { type: "digit", digit: "1" },
    { type: "digit", digit: "2" },
    { type: "digit", digit: "3" },
  ],
  [
    { type: "digit", digit: "4" },
    { type: "digit", digit: "5" },
    { type: "digit", digit: "6" },
  ],
  [
    { type: "digit", digit: "7" },
    { type: "digit", digit: "8" },
    { type: "digit", digit: "9" },
  ],
  [{ type: "clear" }, { type: "digit", digit: "0" }, { type: "backspace" }],
];

const DECIMAL_ROW: KeypadKey[] = [{ type: "empty" }, { type: "decimal" }, { type: "empty" }];

function digitCount(value: string): number {
  return value.replace(".", "").length;
}

/** Props accepted by {@link Keypad}. */
export interface KeypadProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Label rendered above the keypad, via {@link Label.Form}. */
  label: ReactNode;
  /** Maximum number of digits (excluding a decimal point) that can be entered. */
  maxLength: number;
  /** Allows entering a decimal point, so the value can be a float. Defaults to `false`. */
  allowDecimal?: boolean;
  /** Shows a bordered display of the current value above the key grid. Defaults to `false`. */
  display?: boolean;
  /**
   * Field name to bind to the enclosing `<Form>`. When provided, `Keypad`
   * reads/writes its value through the form context and the
   * `value`/`onChange` props are ignored.
   */
  name?: string;
  /** Currently entered value for standalone use, outside a `<Form>`. */
  value?: string;
  /** Initial value for uncontrolled standalone use. */
  defaultValue?: string;
  /** Called with the next value whenever a key is pressed. Ignored when `name` is set. */
  onChange?: (value: string) => void;
  /** Disables every key. Defaults to `false`. */
  disabled?: boolean;
}

/**
 * Numeric access pad for e-ink displays: a labeled 3-column grid of digit
 * keys (`1`-`9`, `0`), a clear key, and a backspace key, for entering PINs,
 * quantities, or other short numeric values by touch. Renders as a
 * `role="group"` of native `<button>`s, keyboard- and screen-reader-
 * accessible without any extra markup.
 *
 * Pass `name` to bind it to the enclosing `<Form>`; the form's string value
 * for that field is treated as the entered digits. Without `name`, use it as
 * a controlled component with `value`/`onChange`, or uncontrolled with
 * `defaultValue`.
 *
 * `maxLength` is required and caps how many digits (the decimal point isn't
 * counted) can be entered. Pass `allowDecimal` to add a decimal-point key,
 * so the value can represent a float instead of just an integer. Pass
 * `display` to show a bordered box with the current value above the grid.
 *
 * @example
 * ```tsx
 * <Keypad label="Quantity" maxLength={4} display />
 *
 * <Keypad name="pin" label="PIN" maxLength={4} />
 * ```
 */
export function Keypad({
  className,
  label,
  maxLength,
  allowDecimal = false,
  display = false,
  name,
  value,
  defaultValue = "",
  onChange,
  disabled = false,
  ...rest
}: KeypadProps) {
  const form = useContext(FormContext);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const labelId = useId();

  const currentValue =
    name && form ? ((form.getValue(name) as string | undefined) ?? "") : (value ?? internalValue);

  const commit = (next: string) => {
    if (name && form) {
      form.setValue(name, next);
    } else {
      if (value === undefined) setInternalValue(next);
      onChange?.(next);
    }
  };

  const press = (key: KeypadKey) => {
    if (disabled) return;
    switch (key.type) {
      case "digit": {
        if (digitCount(currentValue) >= maxLength) return;
        commit(currentValue + key.digit);
        return;
      }
      case "clear": {
        commit("");
        return;
      }
      case "backspace": {
        commit(currentValue.slice(0, -1));
        return;
      }
      case "decimal": {
        if (currentValue.includes(".")) return;
        commit(currentValue === "" ? "0." : `${currentValue}.`);
        return;
      }
      case "empty":
        return;
    }
  };

  const rows = allowDecimal ? [...DIGIT_ROWS, DECIMAL_ROW] : DIGIT_ROWS;

  return (
    // biome-ignore lint/a11y/useSemanticElements: a fieldset's legend must be a <legend>, but the label here is Label.Form, which renders a <label>; role="group" with aria-labelledby is the correct fallback.
    <div
      role="group"
      aria-labelledby={labelId}
      className={cx("eink-keypad", [className ?? "", !!className])}
      {...rest}
    >
      <Label.Form id={labelId} className="eink-keypad__label">
        {label}
      </Label.Form>
      {display && (
        <div className="eink-keypad__display" aria-live="polite">
          {currentValue}
        </div>
      )}
      <div className="eink-keypad__grid">
        {rows.flatMap((row, rowIndex) =>
          row.map((key, keyIndex) => {
            const keyId = `${rowIndex}-${keyIndex}`;
            if (key.type === "empty") {
              return (
                <span
                  key={keyId}
                  className="eink-keypad__key eink-keypad__key--empty"
                  aria-hidden="true"
                />
              );
            }
            if (key.type === "digit") {
              return (
                <button
                  key={keyId}
                  type="button"
                  className="eink-keypad__key"
                  disabled={disabled}
                  onClick={() => press(key)}
                >
                  {key.digit}
                </button>
              );
            }
            if (key.type === "decimal") {
              return (
                <button
                  key={keyId}
                  type="button"
                  className="eink-keypad__key"
                  disabled={disabled}
                  onClick={() => press(key)}
                >
                  .
                </button>
              );
            }
            if (key.type === "clear") {
              return (
                <button
                  key={keyId}
                  type="button"
                  className="eink-keypad__key eink-keypad__key--action"
                  disabled={disabled}
                  onClick={() => press(key)}
                >
                  C
                </button>
              );
            }
            return (
              <button
                key={keyId}
                type="button"
                className="eink-keypad__key eink-keypad__key--action"
                disabled={disabled}
                aria-label="Backspace"
                onClick={() => press(key)}
              >
                <Icon name="backspace" size={20} aria-hidden="true" />
              </button>
            );
          }),
        )}
      </div>
    </div>
  );
}
