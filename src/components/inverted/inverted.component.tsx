import type { HTMLAttributes } from "react";
import { cx } from "../../utils/cx.utils";
import "./inverted.component.css";

/** Props accepted by {@link Inverted}. */
export interface InvertedProps extends HTMLAttributes<HTMLDivElement> {
  /** When `false`, renders children without inverting. Defaults to `true`. */
  active?: boolean;
}

/**
 * Surface that swaps the primary and secondary color tokens for everything inside it, so any
 * library component renders white-on-black without needing its own inverted variant.
 *
 * @example
 * ```tsx
 * <Inverted active={isToday}>
 *   <Text>Today</Text>
 * </Inverted>
 * ```
 */
export function Inverted({ className, active = true, children, ...rest }: InvertedProps) {
  return (
    <div
      className={cx(
        "eink-inverted",
        [className ?? "", !!className],
        ["eink-inverted--active", active],
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
