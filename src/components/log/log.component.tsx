import type { HTMLAttributes, ReactNode } from "react";

import { cx } from "../../utils/cx.utils";
import { formatLogTimestamp } from "../../utils/log.utils";
import { PatternOverlay } from "../pattern-overlay/pattern-overlay.component";

import "./log.component.css";

/** Severity of a {@link Log.Item}. */
export type LogState = "info" | "warning" | "error" | "critical";

const badgeGlyph: Record<LogState, string> = {
  info: "i",
  warning: "!",
  error: "x",
  critical: "‼",
};

/**
 * Small marker box rendered in front of a {@link Log.Item}'s badge: no
 * border for `"info"`, black-filled for `"warning"`/`"error"`, and filled
 * with diagonal black lines for `"critical"`.
 */
function LogMarker({ state }: { state: LogState }) {
  if (state === "critical") {
    return (
      <PatternOverlay
        className="eink-log-item__marker eink-log-item__marker--critical"
        role="img"
        aria-label="critical"
        size={4}
        stroke="currentColor"
        overlay={false}
      />
    );
  }

  return (
    <span
      className={cx("eink-log-item__marker", [`eink-log-item__marker--${state}`, true])}
      role="img"
      aria-label={state}
    />
  );
}

/** Props accepted by {@link Log}. */
export interface LogProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Optional title rendered above the list of entries. */
  title?: ReactNode;
  /** Whether the log is wrapped in a 2px solid border. Defaults to `true`. */
  withBorder?: boolean;
}

/** Props accepted by {@link Log.Item}. */
export interface LogItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Severity of the entry, shown as a badge on the left. */
  state: LogState;
  /** Moment the entry occurred, rendered as `hh:mm:ss:ms`. */
  timeStamp: Date;
  /** Optional origin of the entry, rendered next to the time. */
  source?: ReactNode;
  /** Whether to render a small "ACK" box on the right side. */
  ack?: boolean;
  /** Description of the entry. */
  children: ReactNode;
}

/**
 * Single entry of a {@link Log}: a severity badge, a timestamp, an optional
 * source, a description, and an optional acknowledgement indicator.
 *
 * @example
 * ```tsx
 * <Log.Item state="error" timeStamp={new Date()} source="PRESS-7" ack>
 *   Cycle aborted
 * </Log.Item>
 * ```
 */
function LogItem({ className, state, timeStamp, source, ack, children, ...rest }: LogItemProps) {
  return (
    <div className={cx("eink-log-item", [className ?? "", !!className])} {...rest}>
      <LogMarker state={state} />
      <span className={cx("eink-log-item__badge", [`eink-log-item__badge--${state}`, true])}>
        {badgeGlyph[state]}
      </span>
      <span className="eink-log-item__time">{formatLogTimestamp(timeStamp)}</span>
      {source != null && <span className="eink-log-item__source">{source}</span>}
      <span className="eink-log-item__description">{children}</span>
      {ack && <span className="eink-log-item__ack">ACK</span>}
    </div>
  );
}

/**
 * Fullwidth log of {@link Log.Item}s, each showing a severity badge, a
 * timestamp, an optional source, a description, and an optional
 * acknowledgement indicator.
 *
 * @example
 * ```tsx
 * <Log title="Line 2">
 *   <Log.Item state="critical" timeStamp={new Date()} source="CELL-1">
 *     Safety guard opened during motion
 *   </Log.Item>
 *   <Log.Item state="error" timeStamp={new Date()} source="PRESS-7" ack>
 *     Cycle aborted
 *   </Log.Item>
 * </Log>
 * ```
 */
export function Log({ className, title, withBorder = true, children, ...rest }: LogProps) {
  return (
    <div className={cx("eink-log", [className ?? "", !!className])} {...rest}>
      {title && <div className="eink-log__title">{title}</div>}
      <div className={cx("eink-log__entries", ["eink-log__entries--bordered", withBorder])}>
        {children}
      </div>
    </div>
  );
}

Log.Item = LogItem;
