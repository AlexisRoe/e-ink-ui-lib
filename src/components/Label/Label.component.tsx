import type { HTMLAttributes } from "react";
import { cx } from "../theme/theme.provider";
import "./Label.component.css";

/** Props accepted by {@link Label}. */
export type LabelProps = HTMLAttributes<HTMLSpanElement>;

/**
 * Small uppercase label, rendered as a `<span>` in the Inter font.
 *
 * @example
 * ```tsx
 * <Label>Battery status</Label>
 * ```
 */
export function Label({ className, children, ...rest }: LabelProps) {
  return (
    <span className={cx("eink-label", [className ?? "", !!className])} {...rest}>
      {children}
    </span>
  );
}
