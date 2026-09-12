import type { HTMLAttributes } from "react";
import { cx } from "../../utils/cx.utils";

import "./stroke.component.css";

/** Props accepted by {@link Stroke}. */
export interface StrokeProps extends HTMLAttributes<HTMLSpanElement> {}

/**
 * Renders text with a line through it (`text-decoration: line-through`).
 *
 * @example
 * ```tsx
 * <Stroke>no longer available</Stroke>
 * ```
 */
export function Stroke({ className, children, ...rest }: StrokeProps) {
  return (
    <span className={cx("eink-stroke", [className ?? "", !!className])} {...rest}>
      {children}
    </span>
  );
}
