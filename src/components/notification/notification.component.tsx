import type { CSSProperties } from "react";
import { useId } from "react";

import "./notification.component.css";

/** Variants accepted by {@link NotificationItem}, indicated by the color/pattern of its left-hand bar. */
export type NotificationVariant = "info" | "warning" | "error";

/** Props accepted by {@link NotificationItem}. */
export interface NotificationItemProps {
  /** Title of the notification. */
  title: string;
  /** Optional supporting text shown below the title. */
  description?: string;
  /** Variant indicated by the left-hand bar: `"info"` (white), `"warning"` (diagonal lines), or `"error"` (solid black). Defaults to `"info"`. */
  variant?: NotificationVariant;
  /** Stacking position: `0` is the oldest visible notification, higher offsets render lower and on top for more recently fired notifications. */
  offset: number;
}

/**
 * Single notification card rendered by {@link NotificationProvider}. Not
 * part of the public API — fire notifications via {@link useNotifications}.
 */
export function NotificationItem({
  title,
  description,
  variant = "info",
  offset,
}: NotificationItemProps) {
  const patternId = useId();

  return (
    <div
      className="eink-notification"
      role="status"
      style={{ "--eink-notification-offset": offset } as CSSProperties}
    >
      <div className={`eink-notification__bar eink-notification__bar--${variant}`}>
        {variant === "warning" && (
          <svg className="eink-notification__pattern" aria-hidden="true">
            <pattern
              id={patternId}
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <line x1="0" y1="0" x2="0" y2="8" stroke="black" strokeWidth="2" />
            </pattern>
            <rect width="100%" height="100%" fill={`url(#${patternId})`} />
          </svg>
        )}
      </div>
      <div className="eink-notification__content">
        <div className="eink-notification__title">{title}</div>
        {description && <div className="eink-notification__description">{description}</div>}
      </div>
    </div>
  );
}
