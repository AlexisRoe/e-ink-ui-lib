import type { HTMLAttributes, ReactNode } from "react";
import { useEffect, useMemo, useRef } from "react";
import { cx } from "../../utils/cx.utils";
import { assignLanes } from "../../utils/time-grid.utils";
import "./time-grid.component.css";

const MINUTES_PER_HOUR = 60;
const PERCENT = 100;

/** Block placed on a {@link TimeGrid}. */
export interface TimeGridItem {
  /** Unique identifier. */
  id: string;
  /** Start in minutes since midnight. */
  startMin: number;
  /** Length in minutes. */
  durationMin: number;
  /** Content rendered inside the block. */
  content: ReactNode;
  /** Accessible name of the block button. */
  label: string;
  /** Renders the block greyed out with a strike-through (completed). */
  done?: boolean;
  /** Renders the block inverted to stress it. */
  emphasis?: boolean;
  /** Called when the block is pressed. */
  onSelect?: () => void;
}

/** Props accepted by {@link TimeGrid}. */
export interface TimeGridProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** First hour shown (inclusive). */
  startHour: number;
  /** Last hour shown (exclusive). */
  endHour: number;
  /** Pixel height of one hour. */
  hourHeight: number;
  /** Minimum pixel height of a block so short entries stay tappable. */
  minBlockHeight: number;
  /** Blocks to place on the grid. */
  items: readonly TimeGridItem[];
  /** Current time in minutes since midnight; renders a now-marker when set. */
  nowMinutes?: number;
  /** Time (minutes since midnight) to scroll to whenever `scrollKey` changes. */
  scrollToMinutes?: number;
  /** Changing this value re-applies `scrollToMinutes`. */
  scrollKey?: string | number;
  /** Formats the label of an hour row. Defaults to `HH:00`. */
  formatHour?: (hour: number) => string;
}

const defaultFormatHour = (hour: number): string => `${String(hour).padStart(2, "0")}:00`;

/**
 * Vertical hour grid that positions blocks by start time and duration, with an optional
 * now-marker and programmatic scrolling. Overlapping blocks are placed side by side.
 *
 * @example
 * ```tsx
 * <TimeGrid startHour={0} endHour={24} hourHeight={88} minBlockHeight={28} items={items} nowMinutes={600} />
 * ```
 */
export function TimeGrid({
  className,
  startHour,
  endHour,
  hourHeight,
  minBlockHeight,
  items,
  nowMinutes,
  scrollToMinutes,
  scrollKey,
  formatHour = defaultFormatHour,
  ...rest
}: TimeGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const hours = useMemo(
    () => Array.from({ length: endHour - startHour }, (_, index) => startHour + index),
    [startHour, endHour],
  );
  const lanes = useMemo(() => assignLanes(items), [items]);
  const pxPerMinute = hourHeight / MINUTES_PER_HOUR;
  const originMin = startHour * MINUTES_PER_HOUR;
  const totalHeight = hours.length * hourHeight;

  // biome-ignore lint/correctness/useExhaustiveDependencies: scrolls only when the key changes
  useEffect(() => {
    if (scrollToMinutes === undefined || !scrollRef.current) return;
    scrollRef.current.scrollTop = Math.max(0, (scrollToMinutes - originMin) * pxPerMinute);
  }, [scrollKey]);

  const showNow =
    nowMinutes !== undefined && nowMinutes >= originMin && nowMinutes <= endHour * MINUTES_PER_HOUR;

  return (
    <div ref={scrollRef} className={cx("eink-time-grid", [className ?? "", !!className])} {...rest}>
      <div className="eink-time-grid__body" style={{ height: totalHeight }}>
        {hours.map((hour) => (
          <div
            key={hour}
            className="eink-time-grid__hour"
            style={{ top: (hour - startHour) * hourHeight, height: hourHeight }}
          >
            <span className="eink-time-grid__hour-label">{formatHour(hour)}</span>
          </div>
        ))}
        <div className="eink-time-grid__track">
          {items.map((item) => {
            const slot = lanes.get(item.id) ?? { lane: 0, lanes: 1 };
            return (
              <button
                key={item.id}
                type="button"
                aria-label={item.label}
                className={cx(
                  "eink-time-grid__block",
                  ["eink-time-grid__block--done", item.done === true],
                  ["eink-time-grid__block--emphasis", item.emphasis === true && item.done !== true],
                )}
                style={{
                  top: (item.startMin - originMin) * pxPerMinute,
                  height: Math.max(item.durationMin * pxPerMinute, minBlockHeight),
                  left: `${(slot.lane / slot.lanes) * PERCENT}%`,
                  width: `${PERCENT / slot.lanes}%`,
                }}
                onClick={item.onSelect}
              >
                {item.content}
              </button>
            );
          })}
          {showNow ? (
            <div
              className="eink-time-grid__now"
              role="presentation"
              data-testid="time-grid-now"
              style={{ top: (nowMinutes - originMin) * pxPerMinute }}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
}
