import type { CSSProperties } from "react";

import { PatternOverlay } from "../pattern-overlay/pattern-overlay.component";

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
  return (
    <div
      className="eink-notification"
      role="status"
      style={{ "--eink-notification-offset": offset } as CSSProperties}
    >
      <div className={`eink-notification__bar eink-notification__bar--${variant}`}>
        {variant === "warning" && <PatternOverlay />}
      </div>
      <div className="eink-notification__content">
        <div className="eink-notification__title">{title}</div>
        {description && <div className="eink-notification__description">{description}</div>}
      </div>
    </div>
  );
}
