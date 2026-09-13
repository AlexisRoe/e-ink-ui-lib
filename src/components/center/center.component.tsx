import type { HTMLAttributes } from "react";

import { cx } from "../../utils/cx.utils";

import "./center.component.css";

/** Props accepted by {@link Center}. */
export interface CenterProps extends HTMLAttributes<HTMLDivElement> {
  /** Stretches the container to 100% width of its parent. Defaults to `false`. */
  fullWidth?: boolean;
  /** Stretches the container to 100% height of its parent. Defaults to `false`. */
  fullHeight?: boolean;
}

/**
 * `display: flex` container that centers its children both horizontally
 * and vertically. Accepts optional `fullWidth`/`fullHeight` to stretch to
 * fill its parent along either axis.
 *
 * @example
 * ```tsx
 * <Center fullWidth fullHeight>
 *   <Text>Nothing here yet</Text>
 * </Center>
 * ```
 */
export function Center({ className, fullWidth = false, fullHeight = false, ...rest }: CenterProps) {
  return (
    <div
      className={cx(
        "eink-center",
        ["eink-center--full-width", fullWidth],
        ["eink-center--full-height", fullHeight],
        [className ?? "", !!className],
      )}
      {...rest}
    />
  );
}
