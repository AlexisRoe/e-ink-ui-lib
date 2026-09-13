import type { HTMLAttributes, ReactNode } from "react";
import { useId } from "react";

import { cx } from "../../utils/cx.utils";

import "./last-updated.component.css";

/** Freshness levels computed by {@link LastUpdated}. */
export type LastUpdatedStatus = "fresh" | "stale" | "expired";

/** Overridable labels shown for each {@link LastUpdatedStatus}. */
export type LastUpdatedStatusLabels = Record<LastUpdatedStatus, string>;

/** Default labels used when `statusLabels` is not provided. */
const DEFAULT_STATUS_LABELS: LastUpdatedStatusLabels = {
  fresh: "fresh",
  stale: "stale",
  expired: "expired",
};

/** Seconds after which a `date` is considered `"stale"` if `stale` is not provided. */
const DEFAULT_STALE_SECONDS = 60;

/** Seconds after which a `date` is considered `"expired"` if `expired` is not provided. */
const DEFAULT_EXPIRED_SECONDS = 300;

/** Props accepted by {@link LastUpdated}. */
export interface LastUpdatedProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Point in time the wrapped value was last updated. */
  date: Date;
  /** Value whose freshness is being described, shown next to the status badge. */
  children: ReactNode;
  /** Seconds since `date` after which the status becomes `"stale"`. Defaults to `60`. */
  stale?: number;
  /** Seconds since `date` after which the status becomes `"expired"`. Defaults to `300`. */
  expired?: number;
  /** Overrides for the `"fresh"`/`"stale"`/`"expired"` badge labels. */
  statusLabels?: Partial<LastUpdatedStatusLabels>;
  /** Renders a border around the component. Defaults to `true`. */
  withBorder?: boolean;
  /**
   * Overrides the elapsed-minutes text shown below the value, given the
   * number of whole minutes since `date`. Defaults to `"1 minute ago"` /
   * `"N minutes ago"`.
   */
  formatMinutesAgo?: (minutes: number) => string;
}

function defaultFormatMinutesAgo(minutes: number): string {
  return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
}

function getMinutesAgo(date: Date): number {
  return Math.max(0, Math.floor((Date.now() - date.getTime()) / 60_000));
}

function getStatus(date: Date, staleSeconds: number, expiredSeconds: number): LastUpdatedStatus {
  const elapsedSeconds = (Date.now() - date.getTime()) / 1000;

  if (elapsedSeconds >= expiredSeconds) {
    return "expired";
  }
  if (elapsedSeconds >= staleSeconds) {
    return "stale";
  }
  return "fresh";
}

/**
 * Wraps a value with a status indicator (`"fresh"` | `"stale"` |
 * `"expired"`) computed from how long ago `date` occurred, compared against
 * `stale` and `expired` thresholds in seconds (defaulting to `60` and
 * `300`). The indicator is shown after the value as a thin-bordered swatch
 * — unfilled for `"fresh"`, diagonal stripes for `"stale"`, filled black
 * for `"expired"` — connected to its text label. Status labels can be
 * overridden via `statusLabels`. Below the value, shows the elapsed time
 * since `date` (e.g. `"5 minutes ago"`), auto-pluralized and overridable
 * via `formatMinutesAgo`. Has a solid `2px` black border around the whole
 * component by default, disable via `withBorder={false}`.
 *
 * @example
 * ```tsx
 * <LastUpdated date={fetchedAt}>$42.00</LastUpdated>
 * <LastUpdated date={fetchedAt} stale={30} expired={120} statusLabels={{ expired: "outdated" }}>
 *   $42.00
 * </LastUpdated>
 * ```
 */
export function LastUpdated({
  className,
  date,
  children,
  stale = DEFAULT_STALE_SECONDS,
  expired = DEFAULT_EXPIRED_SECONDS,
  statusLabels,
  withBorder = true,
  formatMinutesAgo = defaultFormatMinutesAgo,
  ...rest
}: LastUpdatedProps) {
  const status = getStatus(date, stale, expired);
  const labels = { ...DEFAULT_STATUS_LABELS, ...statusLabels };
  const patternId = useId();

  return (
    <div
      data-eink-component="last-updated"
      className={cx(
        "eink-last-updated",
        ["eink-last-updated--border", withBorder],
        [className ?? "", !!className],
      )}
      {...rest}
    >
      <div className="eink-last-updated__row">
        <span className="eink-last-updated__value">{children}</span>
        <div className={cx(`eink-last-updated__status eink-last-updated__status--${status}`)}>
          <span className="eink-last-updated__indicator" aria-hidden="true">
            {status === "stale" && (
              <svg className="eink-last-updated__pattern" aria-hidden="true">
                <pattern
                  id={patternId}
                  width="4"
                  height="4"
                  patternUnits="userSpaceOnUse"
                  patternTransform="rotate(45)"
                >
                  <line x1="0" y1="0" x2="0" y2="4" stroke="black" strokeWidth="2" />
                </pattern>
                <rect width="100%" height="100%" fill={`url(#${patternId})`} />
              </svg>
            )}
          </span>
          <span className="eink-last-updated__label">{labels[status]}</span>
        </div>
      </div>
      <span className="eink-last-updated__ago">{formatMinutesAgo(getMinutesAgo(date))}</span>
    </div>
  );
}
