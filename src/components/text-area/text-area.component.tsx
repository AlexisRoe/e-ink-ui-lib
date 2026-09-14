import type { ChangeEvent, ReactNode, TextareaHTMLAttributes } from "react";
import { useContext, useId } from "react";
import { cx } from "../../utils/cx.utils";
import { FormContext } from "../form/form.context";
import "./text-area.component.css";

/** Props accepted by {@link TextArea}. */
export interface TextAreaProps
  extends Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    "children" | "onChange" | "value" | "defaultValue" | "id"
  > {
  /** Label rendered above the field. */
  children: ReactNode;
  /**
   * Field name to bind to the enclosing `<Form>`. When provided, `TextArea`
   * reads/writes its string value through the form context and the
   * `value`/`onChange` props are ignored.
   */
  name?: string;
  /** Current value. Ignored when `name` is set. */
  value?: string;
  /** Called with the next value on every change. Ignored when `name` is set. */
  onChange?: (value: string) => void;
  /** Minimum height of the field, as a CSS length. Defaults to `"96px"`. */
  minHeight?: string;
  /**
   * Maximum number of characters allowed. When provided, a `current / max`
   * counter is rendered next to the label and the field is capped at `max`
   * characters.
   */
  maxCharacters?: number;
  /** When true, renders a `*` after the label and sets the native `required` state. */
  required?: boolean;
}

/**
 * Multi-line text field for e-ink displays, rendered as a native
 * `<textarea>` associated with its label via a wrapping `<label>`. Always
 * spans the full width of its container; `minHeight` controls its starting
 * height (it can still grow if the browser/user resizes it).
 *
 * Pass `maxCharacters` to cap the input length (via the native `maxLength`)
 * and render a live `current / max` counter next to the label
 * (`aria-live="polite"` so screen readers announce updates).
 *
 * Pass `name` to bind it to the enclosing `<Form>`; the form's value for that
 * field is treated as the text string. Without `name`, use it as a
 * controlled component with `value`/`onChange`.
 *
 * Pass `required` to render a `*` after the label and mark the field as
 * required.
 *
 * @example
 * ```tsx
 * <TextArea name="bio" maxCharacters={500}>Bio</TextArea>
 * <TextArea value={notes} onChange={setNotes} minHeight="160px">Notes</TextArea>
 * ```
 */
export function TextArea({
  className,
  children,
  name,
  value,
  onChange,
  minHeight = "96px",
  maxCharacters,
  disabled,
  required,
  ...rest
}: TextAreaProps) {
  const form = useContext(FormContext);
  const inputId = useId();
  const currentValue = name && form ? String(form.getValue(name) ?? "") : (value ?? "");

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const next = maxCharacters ? event.target.value.slice(0, maxCharacters) : event.target.value;
    if (name && form) {
      form.setValue(name, next);
    } else {
      onChange?.(next);
    }
  };

  return (
    <div className={cx("eink-text-area", [className ?? "", !!className])}>
      <div className="eink-text-area__header">
        <label htmlFor={inputId} className="eink-text-area__label">
          {children}
          {required ? <span className="eink-text-area__required">*</span> : null}
        </label>
        {maxCharacters ? (
          <span className="eink-text-area__counter" aria-live="polite">
            {currentValue.length} / {maxCharacters}
          </span>
        ) : null}
      </div>
      <textarea
        {...rest}
        id={inputId}
        className="eink-text-area__input"
        style={{ minHeight }}
        value={currentValue}
        onChange={handleChange}
        disabled={disabled}
        required={required}
        aria-required={required}
        maxLength={maxCharacters}
        name={name}
      />
    </div>
  );
}
