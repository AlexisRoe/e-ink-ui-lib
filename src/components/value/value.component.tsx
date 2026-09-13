import type { HTMLAttributes } from "react";
import { cx } from "../../utils/cx.utils";

import "./value.component.css";

/** Sizes accepted by {@link Value}. Defaults to `"md"`. */
export type ValueSize = "sm" | "md" | "xl";

/** Props accepted by {@link Value}. */
export interface ValueProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /** The value to display, e.g. `44` or `21.4`. */
  children: number | string;
  /** Unit rendered alongside the value, e.g. `"%"` or `"°C"`. */
  unit: string;
  /** Size of the value. Defaults to `"md"`. */
  size?: ValueSize;
}

/**
 * Displays a measurement as a large value paired with a smaller unit,
 * matching common gauge/reading typography (e.g. `44%` or `21.4°C`).
 *
 * @example
 * ```tsx
 * <Value unit="%">44</Value>
 * <Value unit="°C" size="xl">21.4</Value>
 * ```
 */
export function Value({ className, children, unit, size = "md", ...rest }: ValueProps) {
  return (
    <span
      className={cx(`eink-value eink-value--${size}`, [className ?? "", !!className])}
      {...rest}
    >
      <span className="eink-value__value">{children}</span>
      <span className="eink-value__unit">{unit}</span>
    </span>
  );
}
