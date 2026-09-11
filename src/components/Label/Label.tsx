import type { HTMLAttributes } from "react";
import "./Label.css";

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
    <span className={["eink-label", className].filter(Boolean).join(" ")} {...rest}>
      {children}
    </span>
  );
}
