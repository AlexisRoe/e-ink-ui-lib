import type { HTMLAttributes } from "react";
import { useId } from "react";

import { cx } from "../../utils/cx.utils";
import { Label } from "../label/label.component";

import "./progress-bar.component.css";

function clampPercent(value: number): number {
  return Math.min(100, Math.max(0, value));
}

/** Props accepted by {@link ProgressBar}, {@link ProgressBar.Naked}, and {@link ProgressBar.Diagonal}. */
export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  /** Progress value, clamped to `0`-`100`. */
  value: number;
  /** Text shown below the bar as `label · value%`. Omit to render the bar alone. */
  label?: string;
}

interface TrackProps extends HTMLAttributes<HTMLDivElement> {
  value: number;
  diagonal?: boolean;
}

function Track({ className, value, diagonal, ...rest }: TrackProps) {
  const percent = clampPercent(value);
  const patternId = useId();

  return (
    <div
      className={cx("eink-progress-bar__track", [className ?? "", !!className])}
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      {...rest}
    >
      <div
        className={cx("eink-progress-bar__fill", ["eink-progress-bar__fill--diagonal", !!diagonal])}
        style={{ width: `${percent}%` }}
      >
        {diagonal && (
          <svg className="eink-progress-bar__pattern" aria-hidden="true">
            <pattern
              id={patternId}
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line x1="0" y1="0" x2="0" y2="8" stroke="black" strokeWidth="2" />
            </pattern>
            <rect width="100%" height="100%" fill={`url(#${patternId})`} />
          </svg>
        )}
      </div>
    </div>
  );
}

interface BaseProgressBarProps extends ProgressBarProps {
  diagonal?: boolean;
}

function BaseProgressBar({ className, value, label, diagonal, ...rest }: BaseProgressBarProps) {
  const percent = clampPercent(value);

  return (
    <div className={cx("eink-progress-bar", [className ?? "", !!className])} {...rest}>
      <Track value={percent} diagonal={diagonal} />
      {label && (
        <Label className="eink-progress-bar__label">
          {label} · {percent}%
        </Label>
      )}
    </div>
  );
}

/**
 * Bordered, full-width progress bar filled solid black up to `value`
 * percent. Shows an optional {@link Label} below the bar reading
 * `label · value%`.
 *
 * @example
 * ```tsx
 * <ProgressBar value={42} label="Upload" />
 * ```
 */
export function ProgressBar(props: ProgressBarProps) {
  return <BaseProgressBar {...props} />;
}

/** Props accepted by {@link ProgressBar.Naked}. */
export type ProgressBarNakedProps = Omit<ProgressBarProps, "label">;

/**
 * {@link ProgressBar} without a label, ever - just the bar.
 *
 * @example
 * ```tsx
 * <ProgressBar.Naked value={42} />
 * ```
 */
function ProgressBarNaked({ className, value, ...rest }: ProgressBarNakedProps) {
  return <Track className={className} value={value} {...rest} />;
}

/**
 * {@link ProgressBar} filled with diagonal black strokes instead of a solid
 * fill. Accepts the same props as {@link ProgressBar}.
 *
 * @example
 * ```tsx
 * <ProgressBar.Diagonal value={42} label="Upload" />
 * ```
 */
function ProgressBarDiagonal(props: ProgressBarProps) {
  return <BaseProgressBar {...props} diagonal />;
}

/** Props accepted by {@link ProgressBar.Stepper}. */
export interface ProgressBarStepperProps extends HTMLAttributes<HTMLDivElement> {
  /** Total number of steps. */
  steps: number;
  /** Number of steps filled. `0` fills none, `>= steps` fills all. */
  currentStep: number;
  /** Text shown below the bar as `label · currentStep / steps` ("-" when currentStep is 0, capped at steps). */
  label?: string;
}

/**
 * {@link ProgressBar} variant made of discrete, evenly-sized steps instead
 * of a continuous fill. Shows an optional {@link Label} below the bar
 * reading `label · currentStep / steps` ("-" when currentStep is 0, capped
 * at steps).
 *
 * @example
 * ```tsx
 * <ProgressBar.Stepper steps={5} currentStep={1} label="Upload" />
 * ```
 */
function ProgressBarStepper({
  className,
  steps,
  currentStep,
  label,
  ...rest
}: ProgressBarStepperProps) {
  const filled = Math.min(Math.max(currentStep, 0), steps);

  return (
    <div className={cx("eink-progress-bar", [className ?? "", !!className])} {...rest}>
      <div
        className="eink-progress-bar-stepper__track"
        role="progressbar"
        aria-valuenow={filled}
        aria-valuemin={0}
        aria-valuemax={steps}
      >
        {Array.from({ length: steps }, (_, index) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: steps are a fixed-length, position-only sequence
            key={`step-${index}`}
            className={cx("eink-progress-bar-stepper__step", [
              "eink-progress-bar-stepper__step--filled",
              index < filled,
            ])}
          />
        ))}
      </div>
      {label && (
        <Label className="eink-progress-bar__label">
          {label} · {filled === 0 ? "-" : filled} / {steps}
        </Label>
      )}
    </div>
  );
}

ProgressBar.Naked = ProgressBarNaked;
ProgressBar.Diagonal = ProgressBarDiagonal;
ProgressBar.Stepper = ProgressBarStepper;
