import type { HTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import { createContext, useContext, useId, useState } from "react";
import { cx } from "../../utils/cx.utils";
import { FormContext } from "../form/form.context";
import { Icon } from "../icons/icon";
import { Label } from "../label/label.component";
import "./checkbox.component.css";

interface CheckboxGroupContextValue {
  isChecked: (value: string) => boolean;
  toggle: (value: string) => void;
  disabled: boolean;
}

const CheckboxGroupContext = createContext<CheckboxGroupContextValue | null>(null);

/** Props accepted by {@link Checkbox.Group}. */
export interface CheckboxGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "onChange"> {
  /** Label rendered above the group, via {@link Label.Form}. */
  label: ReactNode;
  /**
   * Field name to bind to the enclosing `<Form>`. When provided, the group
   * reads/writes its value (an array of the checked {@link Checkbox}
   * `value`s) through the form context and the `value`/`onChange` props are
   * ignored.
   */
  name?: string;
  /** Currently checked values for standalone use, outside a `<Form>`. */
  value?: string[];
  /** Initial checked values for uncontrolled standalone use. */
  defaultValue?: string[];
  /** Called with the next array of checked values whenever it changes. Ignored when `name` is set. */
  onChange?: (value: string[]) => void;
  /** Disables every {@link Checkbox} inside the group. Defaults to `false`. */
  disabled?: boolean;
  /** {@link Checkbox} elements making up the group, each with its own `value`. */
  children: ReactNode;
}

/**
 * Groups {@link Checkbox} items into a single multi-select field. Renders as
 * a `role="group"` labeled via {@link Label.Form} (associated through
 * `aria-labelledby`, since a `<label>` can't wrap a group of inputs the way
 * it wraps one).
 *
 * Pass `name` to bind it to the enclosing `<Form>`; the form's value for that
 * field is treated as the array of checked `value`s. Without `name`, use it
 * as a controlled component with `value`/`onChange`, or uncontrolled with
 * `defaultValue`.
 *
 * @example
 * ```tsx
 * <Checkbox.Group label="Toppings" name="toppings">
 *   <Checkbox value="cheese">Cheese</Checkbox>
 *   <Checkbox value="olives">Olives</Checkbox>
 * </Checkbox.Group>
 * ```
 */
function CheckboxGroup({
  className,
  label,
  name,
  value,
  defaultValue = [],
  onChange,
  disabled = false,
  children,
  ...rest
}: CheckboxGroupProps) {
  const form = useContext(FormContext);
  const [internalValue, setInternalValue] = useState(defaultValue);
  const labelId = useId();

  const currentValue =
    name && form ? ((form.getValue(name) as string[] | undefined) ?? []) : (value ?? internalValue);

  const toggle = (item: string) => {
    const next = currentValue.includes(item)
      ? currentValue.filter((entry) => entry !== item)
      : [...currentValue, item];
    if (name && form) {
      form.setValue(name, next);
    } else {
      if (value === undefined) setInternalValue(next);
      onChange?.(next);
    }
  };

  const isChecked = (item: string) => currentValue.includes(item);

  return (
    // biome-ignore lint/a11y/useSemanticElements: a fieldset's legend must be a <legend>, but the label here is Label.Form, which renders a <label>; role="group" with aria-labelledby is the correct fallback.
    <div
      role="group"
      aria-labelledby={labelId}
      className={cx("eink-checkbox-group", [className ?? "", !!className])}
      {...rest}
    >
      <Label.Form id={labelId} className="eink-checkbox-group__label">
        {label}
      </Label.Form>
      <div className="eink-checkbox-group__items">
        <CheckboxGroupContext.Provider value={{ isChecked, toggle, disabled }}>
          {children}
        </CheckboxGroupContext.Provider>
      </div>
    </div>
  );
}

/** Props accepted by {@link Checkbox}. */
export interface CheckboxProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "children" | "onChange" | "checked" | "defaultChecked" | "value" | "defaultValue"
  > {
  /** Label rendered next to the box. */
  children: ReactNode;
  /**
   * Field name to bind to the enclosing `<Form>`. Ignored inside a
   * {@link Checkbox.Group} (the group binds instead). When provided outside a
   * group, `Checkbox` reads/writes a boolean value through the form context
   * and the `checked`/`onChange` props are ignored.
   */
  name?: string;
  /**
   * Identifies this box inside a {@link Checkbox.Group}. Required there;
   * ignored otherwise.
   */
  value?: string;
  /** Current checked state for standalone use, outside a `<Form>` or `Checkbox.Group`. */
  checked?: boolean;
  /** Initial checked state for uncontrolled standalone use. Defaults to `false`. */
  defaultChecked?: boolean;
  /** Called with the next checked state when clicked. Ignored when `name` is set or inside a group. */
  onChange?: (checked: boolean) => void;
  /** When true, renders a `*` after the label and sets the native `required` state. */
  required?: boolean;
}

/**
 * Single checkbox for e-ink displays. Renders a native
 * `<input type="checkbox">` associated with its label via a wrapping
 * `<label>`, next to a custom box driven purely by CSS off the input's
 * `:checked`/`:disabled` state, with a checkmark icon inside.
 *
 * Works three ways:
 * - Standalone, controlled with `checked`/`onChange` or uncontrolled with `defaultChecked`.
 * - Bound to a `<Form>` via `name` (boolean field value).
 * - Inside a {@link Checkbox.Group}, identified by `value` (the group owns the
 *   array of checked values, standalone or form-bound).
 *
 * @example
 * ```tsx
 * <Checkbox name="terms">Accept terms</Checkbox>
 *
 * <Checkbox.Group label="Toppings" name="toppings">
 *   <Checkbox value="cheese">Cheese</Checkbox>
 * </Checkbox.Group>
 * ```
 */
export function Checkbox({
  className,
  children,
  name,
  value,
  checked,
  defaultChecked = false,
  onChange,
  disabled,
  required,
  id,
  ...rest
}: CheckboxProps) {
  const group = useContext(CheckboxGroupContext);
  const form = useContext(FormContext);
  const [internalChecked, setInternalChecked] = useState(defaultChecked);
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const isGrouped = group !== null && value !== undefined;
  const isDisabled = isGrouped ? disabled || group.disabled : disabled;

  const isChecked = isGrouped
    ? group.isChecked(value)
    : name && form
      ? Boolean(form.getValue(name))
      : (checked ?? internalChecked);

  const handleChange = () => {
    if (isDisabled) return;
    if (isGrouped) {
      group.toggle(value);
      return;
    }
    if (name && form) {
      form.setValue(name, !isChecked);
      return;
    }
    if (checked === undefined) setInternalChecked(!isChecked);
    onChange?.(!isChecked);
  };

  return (
    <label htmlFor={inputId} className={cx("eink-checkbox", [className ?? "", !!className])}>
      <input
        {...rest}
        id={inputId}
        type="checkbox"
        className="eink-checkbox__input"
        checked={isChecked}
        aria-checked={isChecked}
        onChange={handleChange}
        disabled={isDisabled}
        required={required}
        aria-required={required}
        name={isGrouped ? undefined : name}
        value={value}
      />
      <span className="eink-checkbox__box" aria-hidden="true">
        <Icon name="check" size={14} className="eink-checkbox__check" />
      </span>
      <span className="eink-checkbox__label">
        {children}
        {required ? <span className="eink-checkbox__required">*</span> : null}
      </span>
    </label>
  );
}

Checkbox.Group = CheckboxGroup;
