import type { ChangeEvent, InputHTMLAttributes, ReactNode } from "react";
import { useContext, useId } from "react";
import { cx } from "../../utils/cx.utils";
import { FormContext } from "../form/form.context";
import { Label } from "../label/label.component";
import "./slider.component.css";

/** Orientations accepted by {@link Slider}. Defaults to `"horizontal"`. */
export type SliderOrientation = "horizontal" | "vertical";

/** Props accepted by {@link Slider}. */
export interface SliderProps
  extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "children" | "onChange" | "value" | "defaultValue" | "min" | "max" | "step"
  > {
  /** Label rendered next to the slider. */
  children: ReactNode;
  /**
   * Field name to bind to the enclosing `<Form>`. When provided, `Slider`
   * reads/writes its value through the form context and the
   * `value`/`onChange` props are ignored.
   */
  name?: string;
  /** Current value. Ignored when `name` is set. */
  value?: number;
  /** Called with the next value when changed. Ignored when `name` is set. */
  onChange?: (value: number) => void;
  /** Minimum value. */
  min: number;
  /** Maximum value. */
  max: number;
  /** Step the value snaps to. Defaults to `1`. */
  step?: number;
  /** When true, renders a `*` after the label and sets the native `required` state. */
  required?: boolean;
  /** Layout direction of the slider. Defaults to `"horizontal"`. */
  orientation?: SliderOrientation;
}

/**
 * Discrete-step value picker for e-ink displays. Renders a native
 * `<input type="range">` (real slider semantics, keyboard support, and
 * click/tap-to-jump behavior) layered invisibly on top of a custom track
 * made of individual segments that fill solid black up to the current
 * value, like a segmented progress bar. There is no thumb animation —
 * clicking/tapping a position (or using the keyboard) snaps the value
 * straight to the nearest `step`, since the theme disables transitions.
 *
 * Pass `name` to bind it to the enclosing `<Form>`; the form's value for
 * that field is read/written as the numeric value. Without `name`, use it
 * as a controlled component with `value`/`onChange`.
 *
 * Pass `orientation="vertical"` to lay the track out top-to-bottom instead
 * of left-to-right.
 *
 * Pass `required` to render a `*` after the label and mark the input as
 * required; this does not hook into `<Form>` validation on its own.
 *
 * @example
 * ```tsx
 * <Slider name="brightness" min={0} max={10}>Brightness</Slider>
 * <Slider value={value} onChange={setValue} min={0} max={100} step={10} orientation="vertical">Volume</Slider>
 * ```
 */
export function Slider({
  className,
  children,
  name,
  value,
  onChange,
  min,
  max,
  step = 1,
  disabled,
  required,
  orientation = "horizontal",
  id,
  ...rest
}: SliderProps) {
  const form = useContext(FormContext);
  const generatedId = useId();
  const inputId = id ?? generatedId;

  const currentValue = name && form ? Number(form.getValue(name) ?? min) : (value ?? min);
  const segmentCount = Math.max(1, Math.round((max - min) / step));
  const filledSegments = Math.min(
    segmentCount,
    Math.max(0, Math.round((currentValue - min) / step)),
  );

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    const nextValue = Number(event.target.value);
    if (name && form) {
      form.setValue(name, nextValue);
    } else {
      onChange?.(nextValue);
    }
  };

  return (
    <div className={cx(`eink-slider eink-slider--${orientation}`, [className ?? "", !!className])}>
      <Label.Form htmlFor={inputId} className="eink-slider__label">
        {children}
        {required ? <span className="eink-slider__required">*</span> : null}
      </Label.Form>
      <span className="eink-slider__control">
        <input
          {...rest}
          id={inputId}
          type="range"
          className="eink-slider__input"
          min={min}
          max={max}
          step={step}
          value={currentValue}
          disabled={disabled}
          required={required}
          aria-orientation={orientation}
          name={name}
          onChange={handleChange}
        />
        <span className="eink-slider__track" aria-hidden="true">
          {Array.from({ length: segmentCount }, (_, index) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: segments are a fixed-length, position-only sequence
              key={`segment-${index}`}
              className={cx("eink-slider__segment", [
                "eink-slider__segment--filled",
                index < filledSegments,
              ])}
            />
          ))}
        </span>
      </span>
    </div>
  );
}
