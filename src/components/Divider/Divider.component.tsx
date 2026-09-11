import type { HTMLAttributes } from "react";
import { cx } from "../theme/theme.provider";
import "./Divider.component.css";

/** Props accepted by {@link Divider}. */
export type DividerProps = HTMLAttributes<HTMLHRElement>;

/**
 * Full-width horizontal divider, rendered as a 2px solid black rule.
 *
 * @example
 * ```tsx
 * <Divider />
 * ```
 */
export function Divider({ className, ...rest }: DividerProps) {
  return <hr className={cx("eink-divider", [className ?? "", !!className])} {...rest} />;
}
