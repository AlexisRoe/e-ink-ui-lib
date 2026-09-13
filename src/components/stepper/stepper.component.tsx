import type { HTMLAttributes, ReactNode } from "react";
import { Children, cloneElement, isValidElement } from "react";
import { cx } from "../../utils/cx.utils";

import "./stepper.component.css";

/** Props accepted by {@link Stepper.Item}. */
export interface StepperItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Title of this step. */
  title: ReactNode;
  /** Optional supporting detail shown below the title. */
  children?: ReactNode;
}

interface StepperItemInternalProps extends StepperItemProps {
  index?: number;
  isActive?: boolean;
}

/**
 * Single step of a {@link Stepper}, numbered by its position among siblings
 * and highlighted when it is the active step. Can only be used inside
 * {@link Stepper}.
 *
 * @example
 * ```tsx
 * <Stepper.Item title="Ordered">28 Aug, 09:12</Stepper.Item>
 * ```
 */
function StepperItem({
  className,
  title,
  children,
  index = 0,
  isActive = false,
  ...rest
}: StepperItemInternalProps) {
  return (
    <div
      className={cx(
        "eink-stepper-item",
        [className ?? "", !!className],
        ["eink-stepper-item--active", isActive],
      )}
      {...rest}
    >
      <span className="eink-stepper-item__number">{index + 1}</span>
      <span className="eink-stepper-item__content">
        <span className="eink-stepper-item__title">{title}</span>
        {children && <span className="eink-stepper-item__description">{children}</span>}
      </span>
    </div>
  );
}

/** Props accepted by {@link Stepper}. */
export interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  /** Index of the step highlighted when the stepper first renders. Defaults to `0`. */
  initialIndex?: number;
  /** Index of the step to highlight, overriding `initialIndex` when different. */
  currentIndex?: number;
  /** Stretches the stepper to 100% of its parent's width. Defaults to `true`. */
  fullWidth?: boolean;
}

/**
 * Horizontal row of equally-distributed {@link Stepper.Item}s, numbered by
 * position and highlighting the step at `currentIndex` (falling back to
 * `initialIndex`).
 *
 * @example
 * ```tsx
 * <Stepper initialIndex={1}>
 *   <Stepper.Item title="Ordered">28 Aug, 09:12</Stepper.Item>
 *   <Stepper.Item title="Packed">Fulfillment Leipzig</Stepper.Item>
 *   <Stepper.Item title="In transit">DHL · 0034043471</Stepper.Item>
 *   <Stepper.Item title="Delivered">Against signature</Stepper.Item>
 * </Stepper>
 * ```
 */
export function Stepper({
  className,
  children,
  initialIndex = 0,
  currentIndex,
  fullWidth = true,
  ...rest
}: StepperProps) {
  const activeIndex = currentIndex ?? initialIndex;

  let index = 0;
  const items = Children.map(children, (child) => {
    if (!isValidElement<StepperItemInternalProps>(child)) {
      return child;
    }
    const itemIndex = index++;
    return cloneElement(child, {
      index: itemIndex,
      isActive: itemIndex === activeIndex,
    });
  });

  return (
    <div
      className={cx(
        "eink-stepper",
        [className ?? "", !!className],
        ["eink-stepper--full-width", fullWidth],
      )}
      {...rest}
    >
      {items}
    </div>
  );
}

Stepper.Item = StepperItem;
