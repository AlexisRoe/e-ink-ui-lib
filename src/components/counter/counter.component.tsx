import type { HTMLAttributes } from "react";

import { cx } from "../theme/theme.provider";

import "./counter.component.css";

/** Sizes accepted by {@link Counter}. Defaults to `"md"`. */
export type CounterSize = "sm" | "md" | "xl";

interface CounterBaseProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Text shown inside the bordered box. */
  label: string;
  /** Size of the counter. Defaults to `"md"`. */
  size?: CounterSize;
}

/**
 * Props accepted by {@link Counter}. `count` and `dot` are mutually
 * exclusive: providing both is a type error.
 */
export type CounterProps = CounterBaseProps &
  ({ count?: number; dot?: never } | { dot?: boolean; count?: never });

function formatCount(count: number): string {
  return count > 99 ? "99+" : String(count);
}

/**
 * Bordered, labeled box with an optional badge overlapping its top-right
 * corner: either a `count` (numbers above 99 are shown as `"99+"`) or a
 * small `dot`. Accepts an optional `size` (`"sm"` | `"md"` | `"xl"`,
 * defaults to `"md"`).
 *
 * @example
 * ```tsx
 * <Counter label="Inbox" count={5} />
 * <Counter label="Inbox" count={132} />
 * <Counter label="Inbox" dot size="xl" />
 * ```
 */
export function Counter({ className, label, size = "md", count, dot, ...rest }: CounterProps) {
  const hasCount = typeof count === "number";

  return (
    <div
      className={cx(`eink-counter eink-counter--${size}`, [className ?? "", !!className])}
      {...rest}
    >
      <span className="eink-counter__label">{label}</span>
      {dot ? (
        <span className="eink-counter__badge eink-counter__badge--dot" aria-hidden="true" />
      ) : null}
      {hasCount ? <span className="eink-counter__badge">{formatCount(count)}</span> : null}
    </div>
  );
}
