import type { HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { createContext, useContext, useId, useState } from "react";
import { cx } from "../../utils/cx.utils";
import { FormContext } from "../form/form.context";
import { Label } from "../label/label.component";
import "./radio-input.component.css";

interface RadioGroupContextValue {
  selectedValue: string;
  select: (value: string) => void;
  name: string;
  disabled: boolean;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

/** Layout direction for {@link RadioInput.Group}'s items. */
export type RadioInputOrientation = "horizontal" | "vertical";

/** Props accepted by {@link RadioInput.Group}. */
export interface RadioInputGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Label rendered above the group, via {@link Label.Form}. */
  label: ReactNode;
  /** Layout direction for the group's items. Defaults to `"vertical"`. */
  orientation?: RadioInputOrientation;
  /**
   * Field name to bind to the enclosing `<Form>`. When provided, the group
   * reads/writes its value through the form context and the
   * `value`/`onChange` props are ignored.
   */
  name?: string;
  /** Currently selected value for standalone use, outside a `<Form>`. */
  value?: string;
  /** Initial selected value for uncontrolled standalone use. */
  defaultValue?: string;
  /** Called with the next selected value whenever it changes. Ignored when `name` is set. */
  onChange?: (value: string) => void;
  /** Disables every {@link RadioInput} inside the group. Defaults to `false`. */
  disabled?: boolean;
  /** {@link RadioInput} elements making up the group, each with its own `value`. */
  children: ReactNode;
}

/**
 * Groups {@link RadioInput} items into a single mutually-exclusive field.
 * Renders as a `role="radiogroup"` labeled via {@link Label.Form} (associated
 * through `aria-labelledby`), and generates the shared native `name` its
 * radio inputs need to behave as one exclusive group.
 *
 * Pass `name` to bind it to the enclosing `<Form>`; the form's value for that
 * field is treated as the selected `value`. Without `name`, use it as a
 * controlled component with `value`/`onChange`, or uncontrolled with
 * `defaultValue`.
 *
 * Pass `orientation="horizontal"` to lay the items out in a row instead of
 * the default column.
 *
 * A {@link RadioInput} only makes sense inside this group — it's what
 * supplies the exclusivity and the value binding.
 *
 * @example
 * ```tsx
 * <RadioInput.Group label="Size" name="size" orientation="horizontal">
 *   <RadioInput value="s">Small</RadioInput>
 *   <RadioInput value="m">Medium</RadioInput>
 * </RadioInput.Group>
 * ```
 */
function RadioInputGroup({
  className,
  label,
  orientation = "vertical",
  name,
  value,
  defaultValue = "",
  onChange,
  disabled = false,
  children,
  ...rest
}: RadioInputGroupProps) {
  const form = useContext(FormContext);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const labelId = useId();
  const groupName = useId();

  const currentValue =
    name && form ? ((form.getValue(name) as string | undefined) ?? "") : (value ?? internalValue);

  const select = (next: string) => {
    if (disabled) return;
    if (name && form) {
      form.setValue(name, next);
    } else {
      if (value === undefined) setInternalValue(next);
      onChange?.(next);
    }
  };

  return (
    <div
      role="radiogroup"
      aria-labelledby={labelId}
      className={cx("eink-radio-group", [className ?? "", !!className])}
      {...rest}
    >
      <Label.Form id={labelId} className="eink-radio-group__label">
        {label}
      </Label.Form>
      <div
        className={cx("eink-radio-group__items", [
          "eink-radio-group__items--horizontal",
          orientation === "horizontal",
        ])}
      >
        <RadioGroupContext.Provider
          value={{ selectedValue: currentValue, select, name: groupName, disabled }}
        >
          {children}
        </RadioGroupContext.Provider>
      </div>
    </div>
  );
}

/** Props accepted by {@link RadioInput}. */
export interface RadioInputProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | "type"
    | "children"
    | "onChange"
    | "checked"
    | "defaultChecked"
    | "value"
    | "defaultValue"
    | "name"
  > {
  /** Label rendered next to the circle. */
  children: ReactNode;
  /** Value reported to the enclosing {@link RadioInput.Group} when this option is chosen. */
  value: string;
}

/**
 * Single radio option for e-ink displays, for use inside a
 * {@link RadioInput.Group}. Renders a native `<input type="radio">`
 * associated with its label via a wrapping `<label>`, sharing the group's
 * generated `name` so the browser enforces exclusivity, next to a custom
 * circle/dot driven purely by CSS off the input's `:checked`/`:disabled`
 * state.
 *
 * @example
 * ```tsx
 * <RadioInput.Group label="Size" name="size">
 *   <RadioInput value="s">Small</RadioInput>
 *   <RadioInput value="m">Medium</RadioInput>
 * </RadioInput.Group>
 * ```
 */
export function RadioInput({ className, value, children, disabled, id, ...rest }: RadioInputProps) {
  const group = useContext(RadioGroupContext);
  if (!group) {
    throw new Error("RadioInput must be used within a RadioInput.Group");
  }
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const isChecked = group.selectedValue === value;
  const isDisabled = disabled || group.disabled;

  const handleChange = () => group.select(value);

  return (
    <label htmlFor={inputId} className={cx("eink-radio-input", [className ?? "", !!className])}>
      <input
        {...rest}
        id={inputId}
        type="radio"
        name={group.name}
        className="eink-radio-input__input"
        checked={isChecked}
        aria-checked={isChecked}
        onChange={handleChange}
        disabled={isDisabled}
        value={value}
      />
      <span className="eink-radio-input__circle" aria-hidden="true">
        <span className="eink-radio-input__dot" />
      </span>
      <span className="eink-radio-input__label">{children}</span>
    </label>
  );
}

RadioInput.Group = RadioInputGroup;
