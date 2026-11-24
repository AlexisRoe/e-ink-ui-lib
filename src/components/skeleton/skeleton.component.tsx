import { createContext, type HTMLAttributes, type ReactNode, useContext } from "react";

import { cx } from "../../utils/cx.utils";
import { PatternOverlay } from "../pattern-overlay/pattern-overlay.component";

import "./skeleton.component.css";

const SkeletonGroupContext = createContext(false);

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
  const grouped = useContext(SkeletonGroupContext);

  return (
    <div
      className={cx(`eink-skeleton eink-skeleton--${variant}`, [className ?? "", !!className])}
      {...(grouped ? { "aria-hidden": true } : { role: "status", "aria-label": "Loading" })}
      {...rest}
    >
      <PatternOverlay />
    </div>
  );
}

/** Props accepted by {@link Skeleton.Group}. */
export interface SkeletonGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Number of default rectangle skeletons to render when no `children` are given. Defaults to `3`. */
  count?: number;
  /** Custom skeletons; replaces the `count` default placeholders. */
  children?: ReactNode;
  /** Accessible label announced once for the whole group. Defaults to `"Loading"`. */
  "aria-label"?: string;
}

/**
 * Stack of {@link Skeleton} placeholders announced as one loading region
 * (`role="status"`, `aria-busy`) instead of once per skeleton. Pass `count`
 * for identical rows or `children` for custom shapes and sizes.
 *
 * @example
 * ```tsx
 * <Skeleton.Group count={3} aria-label="Loading lessons" />
 * <Skeleton.Group>
 *   <Skeleton variant="round" />
 *   <Skeleton style={{ height: 120 }} />
 * </Skeleton.Group>
 * ```
 */
function SkeletonGroup({
  className,
  count = 3,
  children,
  "aria-label": ariaLabel = "Loading",
  ...rest
}: SkeletonGroupProps) {
  return (
    <SkeletonGroupContext.Provider value={true}>
      <div
        className={cx("eink-skeleton-group", [className ?? "", !!className])}
        role="status"
        aria-busy="true"
        aria-label={ariaLabel}
        {...rest}
      >
        {children ??
          // biome-ignore lint/suspicious/noArrayIndexKey: static placeholders without identity; the order never changes.
          Array.from({ length: count }, (_, index) => <Skeleton key={index} />)}
      </div>
    </SkeletonGroupContext.Provider>
  );
}

Skeleton.Group = SkeletonGroup;
