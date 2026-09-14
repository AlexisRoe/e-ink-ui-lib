import type { InputHTMLAttributes, ReactNode } from "react";
import { useContext, useId } from "react";
import { cx } from "../../utils/cx.utils";
import { FormContext } from "../form/form.context";
import "./toggle.component.css";

/** Props accepted by {@link Toggle}. */
export interface ToggleProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "children" | "onChange" | "checked" | "defaultChecked" | "value" | "defaultValue"
  > {
  /** Label rendered next to the switch. */
  children: ReactNode;
  /**
   * Field name to bind to the enclosing `<Form>`. When provided, `Toggle`
   * reads/writes its boolean value through {@link useFormField} and the
   * `checked`/`onChange` props are ignored.
   */
  name?: string;
  /** Current value. Ignored when `name` is set. */
  checked?: boolean;
  /** Called with the next value when clicked. Ignored when `name` is set. */
  onChange?: (checked: boolean) => void;
  /** When true, renders a `*` after the label and sets the native `required` state. */
  required?: boolean;
}

/**
 * Boolean on/off switch for e-ink displays. Renders a native
 * `<input type="checkbox" role="switch">` associated with its label via a
 * wrapping `<label>` (so clicking/tapping the label toggles it, and screen
 * readers/browsers get real checkbox semantics — keyboard support,
 * `:checked`, `required` validity — on top of the `switch` ARIA role). The
 * input itself is visually hidden in favor of a custom track/thumb, driven
 * purely by CSS off the input's `:checked`/`:disabled` state.
 *
 * The thumb is a diagonal-striped block while off and a solid block while
 * on, and jumps from one side of the track to the other rather than
 * animating, since the theme disables transitions.
 *
 * Pass `name` to bind it to the enclosing `<Form>` (via `useFormField`); the
 * form's value for that field is treated as the boolean `checked` state and
 * updated on click. Without `name`, use it as a controlled component with
 * `checked`/`onChange`.
 *
 * Pass `required` to render a `*` after the label and mark the input as
 * required; this does not hook into `<Form>` validation on its own.
 *
 * @example
 * ```tsx
 * <Toggle name="notifications">Notifications</Toggle>
 * <Toggle checked={visible} onChange={setVisible}>Visible</Toggle>
 * ```
 */
export function Toggle({
  className,
  children,
  name,
  checked,
  onChange,
  disabled,
  required,
  id,
  ...rest
}: ToggleProps) {
  const form = useContext(FormContext);
  const generatedId = useId();
  const inputId = id ?? generatedId;
  const isChecked = name && form ? Boolean(form.getValue(name)) : Boolean(checked);
  const handleChange = () => {
    if (disabled) return;
    if (name && form) {
      form.setValue(name, !isChecked);
    } else {
      onChange?.(!isChecked);
    }
  };

  return (
    <label htmlFor={inputId} className={cx("eink-toggle", [className ?? "", !!className])}>
      <input
        {...rest}
        id={inputId}
        type="checkbox"
        role="switch"
        className="eink-toggle__input"
        checked={isChecked}
        aria-checked={isChecked}
        onChange={handleChange}
        disabled={disabled}
        required={required}
        aria-required={required}
        name={name}
      />
      <span className="eink-toggle__track">
        <span className="eink-toggle__thumb" />
      </span>
      <span className="eink-toggle__label">
        {children}
        {required ? <span className="eink-toggle__required">*</span> : null}
      </span>
    </label>
  );
}
