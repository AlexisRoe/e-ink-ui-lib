import type { HTMLAttributes, ReactNode } from "react";

import { cx } from "../../utils/cx.utils";
import { PatternOverlay } from "../pattern-overlay/pattern-overlay.component";

import "./timeline.component.css";

/** Progress state of a {@link Timeline.Item}. */
export type TimelineState = "done" | "pending" | "todo";

/** Props accepted by {@link Timeline}. */
export type TimelineProps = HTMLAttributes<HTMLDivElement>;

/** Props accepted by {@link Timeline.Item}. */
export interface TimelineItemProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  /** Time shown to the left of the marker, e.g. `"08:30"`. */
  time: ReactNode;
  /** Bold title shown next to the marker. */
  title: ReactNode;
  /**
   * Progress state of the item: `"done"` (filled square), `"pending"`
   * (diagonally hatched square), or `"todo"` (empty square).
   */
  state: TimelineState;
  /** Description shown below the title. */
  children?: ReactNode;
}

function TimelineMarker({ state }: { state: TimelineState }) {
  if (state === "pending") {
    return (
      <PatternOverlay
        className="eink-timeline-item__box eink-timeline-item__box--pending"
        viewBox="0 0 16 16"
        role="img"
        aria-label="pending"
        size={4}
        stroke="currentColor"
        rectProps={{ x: 1, y: 1, width: 14, height: 14, stroke: "currentColor", strokeWidth: 2 }}
        overlay={false}
      />
    );
  }

  return (
    <span
      className={cx("eink-timeline-item__box", ["eink-timeline-item__box--done", state === "done"])}
      role="img"
      aria-label={state}
    />
  );
}

/**
 * Single entry of a {@link Timeline}: a time, a state marker connected to
 * its neighbors by an unbroken vertical line, a title, and a description.
 *
 * @example
 * ```tsx
 * <Timeline.Item time="08:30" title="Stand-up" state="done">Daily sync.</Timeline.Item>
 * ```
 */
function TimelineItem({ className, time, title, state, children, ...rest }: TimelineItemProps) {
  return (
    <div className={cx("eink-timeline-item", [className ?? "", !!className])} {...rest}>
      <div className="eink-timeline-item__time">{time}</div>
      <div className="eink-timeline-item__marker">
        <TimelineMarker state={state} />
        <div className="eink-timeline-item__line" />
      </div>
      <div className="eink-timeline-item__content">
        <div className="eink-timeline-item__title">{title}</div>
        {children != null && <div className="eink-timeline-item__description">{children}</div>}
      </div>
    </div>
  );
}

/**
 * Vertical timeline of {@link Timeline.Item}s, each showing a time, a state
 * marker, a title, and a description, connected by a continuous line.
 *
 * @example
 * ```tsx
 * <Timeline>
 *   <Timeline.Item time="08:30" title="Stand-up" state="done">Daily sync.</Timeline.Item>
 *   <Timeline.Item time="17:30" title="Postmortem" state="todo">Pending writeup.</Timeline.Item>
 * </Timeline>
 * ```
 */
export function Timeline({ className, children, ...rest }: TimelineProps) {
  return (
    <div className={cx("eink-timeline", [className ?? "", !!className])} {...rest}>
      {children}
    </div>
  );
}

Timeline.Item = TimelineItem;
