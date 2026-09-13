import type { HTMLAttributes, ReactNode } from "react";
import { cx } from "../../utils/cx.utils";

import "./trend.component.css";

/** Sizes accepted by {@link Trend}. Defaults to `"md"`. */
export type TrendSize = "sm" | "md" | "xl";

/** Direction of the change indicated by {@link Trend}. */
export type TrendDirection = "up" | "down" | "none";

/** Props accepted by {@link Trend}. */
export interface TrendProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Direction of the change: `"up"`, `"down"`, or `"none"`. */
  direction: TrendDirection;
  /** Size of the trend. Defaults to `"md"`. */
  size?: TrendSize;
  /** Content rendered alongside the direction indicator, e.g. a value or label. */
  children: ReactNode;
}

/**
 * Displays a bordered square direction indicator (up/down/no-change triangle)
 * followed by arbitrary content, typically a value describing the change.
 *
 * @example
 * ```tsx
 * <Trend direction="up">0.6</Trend>
 * <Trend direction="down" size="xl">-12%</Trend>
 * ```
 */
export function Trend({ className, direction, size = "md", children, ...rest }: TrendProps) {
  return (
    <span
      className={cx(`eink-trend eink-trend--${size}`, [className ?? "", !!className])}
      {...rest}
    >
      <span className={`eink-trend__indicator eink-trend__indicator--${direction}`}>
        <span className={`eink-trend__shape eink-trend__shape--${direction}`} />
      </span>
      <span className="eink-trend__content">{children}</span>
    </span>
  );
}
