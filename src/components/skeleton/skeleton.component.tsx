import type { HTMLAttributes } from "react";

import { cx } from "../../utils/cx.utils";
import { PatternOverlay } from "../pattern-overlay/pattern-overlay.component";

import "./skeleton.component.css";

/** Shapes accepted by {@link Skeleton}. Defaults to `"rectangle"`. */
export type SkeletonVariant = "rectangle" | "round" | "square";

/** Props accepted by {@link Skeleton}. */
export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Shape of the placeholder. Defaults to `"rectangle"`. */
  variant?: SkeletonVariant;
}

/**
 * Loading placeholder for content that hasn't arrived yet: a 2px solid
 * black border filled with diagonal black strokes. Always renders at 100%
 * of its parent's width; use `style` (e.g. `style={{ height: 120 }}`) or a
 * `className` with your own rules to size it like the content it mocks.
 *
 * @example
 * ```tsx
 * <Skeleton style={{ height: 12 }} />
 * <Skeleton variant="round" style={{ height: 48 }} />
 * <Skeleton variant="square" style={{ height: 96 }} />
 * ```
 */
export function Skeleton({ className, variant = "rectangle", ...rest }: SkeletonProps) {
  return (
    <div
      className={cx(`eink-skeleton eink-skeleton--${variant}`, [className ?? "", !!className])}
      role="status"
      aria-label="Loading"
      {...rest}
    >
      <PatternOverlay />
    </div>
  );
}
