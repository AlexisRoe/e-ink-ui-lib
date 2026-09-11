import type { HTMLAttributes } from "react";
import "./Divider.css";

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
  return <hr className={["eink-divider", className].filter(Boolean).join(" ")} {...rest} />;
}
