import type { HTMLAttributes } from "react";

import { cx } from "../../utils/cx.utils";

import "./space.component.css";

/** Size scale rendered by {@link Space}, mapped to `--eink-size-*` tokens. Defaults to `16`. */
export type SpaceSize = 2 | 4 | 6 | 8 | 10 | 12 | 14 | 16 | 20 | 24 | 36 | 48 | 64 | 128;

/** Props accepted by {@link Space}. */
export interface SpaceProps extends HTMLAttributes<HTMLDivElement> {
  /** Height of the space, in `--eink-size-*` steps. Defaults to `16`. */
  size?: `${SpaceSize}`;
}

/**
 * Full-width vertical spacer, sized from the `--eink-size-*` token scale.
 *
 * @example
 * ```tsx
 * <Space size="24" />
 * ```
 */
export function Space({ size = "16", className, style, ...rest }: SpaceProps) {
  return (
    <div
      className={cx("eink-space", [className ?? "", !!className])}
      style={{ ["--eink-space-size" as string]: `var(--eink-size-${size})`, ...style }}
      {...rest}
    />
  );
}
