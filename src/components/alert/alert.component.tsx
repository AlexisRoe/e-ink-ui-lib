import type { ReactNode } from "react";
import { cx } from "../../utils/cx.utils";
import { Icon } from "../icons/icon";
import type { IconName } from "../icons/icons";
import { PatternOverlay } from "../pattern-overlay/pattern-overlay.component";

import "./alert.component.css";

/** Variants accepted by {@link Alert}, indicated by the color/pattern of its left-hand bar. */
export type AlertVariant = "info" | "warning" | "error";

/** Props accepted by {@link Alert}. */
export interface AlertProps {
  /** Title of the alert. */
  title: string;
  /** Optional supporting content shown below the title; may contain markup such as `Highlight`. */
  description?: ReactNode;
  /** Optional action, such as a `Button`, shown at the trailing edge (wraps below the text on narrow screens). */
  action?: ReactNode;
  /** Variant indicated by the left-hand bar: `"info"` (white), `"warning"` (diagonal lines), or `"error"` (solid black). Defaults to `"info"`. */
  variant?: AlertVariant;
  /** Optional icon rendered to the left of the title, from {@link IconName}. */
  icon?: IconName;
  /** Additional class name. */
  className?: string;
}

/**
 * Full-width banner for surfacing status messages, with a `2px` solid border
 * and a left-hand bar indicating its variant: `"info"` (white), `"warning"`
 * (diagonal lines), or `"error"` (solid black). Accepts a required title, an
 * optional description, an optional icon rendered to the left of the
 * title (aligned with the description, if present), and an optional `action`
 * slot for a trailing button.
 *
 * @example
 * ```tsx
 * <Alert variant="warning" icon="alert-triangle" title="Low battery" description="Connect a charger soon." />
 * ```
 */
export function Alert({
  title,
  description,
  action,
  variant = "info",
  icon,
  className,
}: AlertProps) {
  return (
    <div
      data-eink-component="alert"
      role={variant === "error" ? "alert" : "status"}
      className={cx("eink-alert", [className ?? "", !!className])}
    >
      <div className={`eink-alert__bar eink-alert__bar--${variant}`}>
        {variant === "warning" && <PatternOverlay className="eink-alert__pattern" />}
      </div>
      <div className="eink-alert__content">
        <div className="eink-alert__title-row">
          {icon && <Icon name={icon} size={20} className="eink-alert__icon" aria-hidden="true" />}
          <div className="eink-alert__title">{title}</div>
        </div>
        {description ? (
          <div
            className={cx("eink-alert__description", [
              "eink-alert__description--with-icon",
              !!icon,
            ])}
          >
            {description}
          </div>
        ) : null}
      </div>
      {action && <div className="eink-alert__action">{action}</div>}
    </div>
  );
}
