import type { ReactNode } from "react";
import { useContext, useId } from "react";
import { cx } from "../../utils/cx.utils";
import { FormContext } from "../form/form.context";
import { Icon } from "../icons/icon";
import type { IconName } from "../icons/icons";
import "../label/label.component.css";
import "./rating.component.css";

/** Icon styles available for {@link Rating}. */
export type RatingIcon = "heart" | "star" | "smiley";

const RATING_ICON_NAMES: Record<RatingIcon, IconName> = {
  heart: "heart",
  star: "star",
  smiley: "mood-smile-beam",
};

/** Props accepted by {@link Rating}. */
export interface RatingProps {
  /** Label rendered above the rating icons. */
  children: ReactNode;
  /** Extra class name(s) applied to the root element. */
  className?: string;
  /**
   * Field name to bind to the enclosing `<Form>`. When provided, `Rating`
   * reads/writes its value through the form context and the
   * `value`/`onChange` props are ignored.
   */
  name?: string;
  /** Current value. Ignored when `name` is set. Clamped down to `max` if it exceeds it. */
  value?: number;
  /** Called with the next value when a rating icon is clicked, or `0` when cleared. Ignored when `name` is set. */
  onChange?: (value: number) => void;
  /** Number of icons to render, and the highest selectable value. */
  max: number;
  /** Which icon to render for each rating step. Defaults to `"star"`. */
  icon?: RatingIcon;
  /** Renders the current rating without allowing changes, and hides the clear button. Defaults to `false`. */
  readOnly?: boolean;
  /** Disables the whole control. Defaults to `false`. */
  disabled?: boolean;
  /** Renders a border around each icon. Defaults to `true`. */
  withBorder?: boolean;
  /** Renders a button to clear the rating back to `0`. Hidden by default. */
  withClear?: boolean;
}

/**
 * Rating input rendered as a row of icon buttons (heart, star, or smiley
 * face), implemented as an ARIA `radiogroup` of `radio` buttons so exactly
 * one value from `1` to `max` is selected at a time. Clicking the
 * currently-selected icon, or the separate "Clear rating" button, resets
 * the value to `0`.
 *
 * Pass `name` to bind it to the enclosing `<Form>`; the form's value for
 * that field is read/written as the numeric rating. Without `name`, use it
 * as a controlled component with `value`/`onChange`.
 *
 * If the initial `value` exceeds `max`, it is clamped down to `max`.
 *
 * Pass `readOnly` to render the current rating as a plain, non-interactive
 * icon display (no button chrome, no clear button, exposed as a single
 * `img`-role element summarizing the value), or `disabled` to render the
 * normal interactive control but fully inert.
 *
 * Pass `withBorder={false}` to render the icons without their surrounding
 * border. Pass `withClear` to also render a "Clear rating" button, sized to
 * match the rating icons, that resets the value to `0`.
 *
 * @example
 * ```tsx
 * <Rating name="satisfaction" max={5}>How was your visit?</Rating>
 * <Rating value={rating} onChange={setRating} max={5} icon="heart">Favorite?</Rating>
 * ```
 */
export function Rating({
  className,
  children,
  name,
  value,
  onChange,
  max,
  icon = "star",
  readOnly = false,
  disabled = false,
  withBorder = true,
  withClear = false,
}: RatingProps) {
  const form = useContext(FormContext);
  const legendId = useId();
  const rawValue = name && form ? Number(form.getValue(name) ?? 0) : (value ?? 0);
  const currentValue = Math.min(Math.max(rawValue, 0), max);
  const iconName = RATING_ICON_NAMES[icon];

  const commit = (next: number) => {
    if (readOnly || disabled) return;
    if (name && form) {
      form.setValue(name, next);
    } else {
      onChange?.(next);
    }
  };

  const handleSelect = (step: number) => {
    commit(currentValue === step ? 0 : step);
  };

  const icons = Array.from({ length: max }, (_, index) => index + 1).map((step) => {
    const filled = step <= currentValue;
    const iconElement = (
      <Icon
        name={iconName}
        aria-hidden="true"
        fill={filled ? "currentColor" : "none"}
        color={filled && icon === "smiley" ? "var(--eink-color-secondary)" : undefined}
      />
    );

    if (readOnly) {
      return (
        <span
          key={`step-${step}`}
          aria-hidden="true"
          className="eink-rating__icon eink-rating__icon--readonly"
        >
          {iconElement}
        </span>
      );
    }

    return (
      // biome-ignore lint/a11y/useSemanticElements: a native radio input can't render a custom icon; role="radio" on a button reproduces the same semantics
      <button
        key={`step-${step}`}
        type="button"
        role="radio"
        aria-checked={step === currentValue}
        aria-label={`${step} out of ${max}`}
        className={cx(
          "eink-rating__icon",
          ["eink-rating__icon--filled", filled],
          ["eink-rating__icon--no-border", !withBorder],
        )}
        onClick={() => handleSelect(step)}
      >
        {iconElement}
      </button>
    );
  });

  return (
    <fieldset disabled={disabled} className={cx("eink-rating", [className ?? "", !!className])}>
      <legend id={legendId} className="eink-label eink-label--form eink-rating__label">
        {children}
      </legend>
      <div className="eink-rating__control">
        {readOnly ? (
          <div
            role="img"
            aria-label={`${currentValue} out of ${max}`}
            className="eink-rating__icons"
          >
            {icons}
          </div>
        ) : (
          <div role="radiogroup" aria-labelledby={legendId} className="eink-rating__icons">
            {icons}
          </div>
        )}
        {withClear && !readOnly ? (
          <button
            type="button"
            className="eink-rating__clear"
            aria-label="Clear rating"
            disabled={currentValue === 0}
            onClick={() => commit(0)}
          >
            <Icon name="close" aria-hidden="true" />
          </button>
        ) : null}
      </div>
    </fieldset>
  );
}
