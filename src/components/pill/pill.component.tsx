import type { HTMLAttributes, ReactNode } from "react";

import { cx } from "../../utils/cx.utils";
import { Icon } from "../icons/icon";
import type { IconName } from "../icons/icons";

import "./pill.component.css";

/** Sizes accepted by every {@link Pill} variant. Defaults to `"md"`. */
export type PillSize = "sm" | "md" | "xl";

/** Props shared by every {@link Pill} variant. */
export interface PillProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Text shown inside the pill. Always rendered uppercase. */
  children: ReactNode;
  /** Name of an icon rendered on the left side of the pill. */
  icon?: IconName;
  /** Size of the pill. Defaults to `"md"`. */
  size?: PillSize;
}

/** Icon pixel size per {@link PillSize}. */
const ICON_SIZES: Record<PillSize, number> = {
  sm: 12,
  md: 14,
  xl: 20,
};

function renderContent(children: ReactNode, icon: IconName | undefined, size: PillSize) {
  return (
    <>
      {icon ? (
        <Icon name={icon} size={ICON_SIZES[size]} className="eink-pill__icon" aria-hidden="true" />
      ) : null}
      <span className="eink-pill__label">{children}</span>
    </>
  );
}

/**
 * Small, uppercase status pill with a solid 2px black border, rendered in
 * the Inter font. Accepts an optional `icon` on the left side and an
 * optional `size` (`"sm"` | `"md"` | `"xl"`, defaults to `"md"`).
 *
 * Additional border treatments are available as static properties:
 * {@link Pill.Double}, {@link Pill.Filled}, {@link Pill.Dashed},
 * {@link Pill.Dotted}.
 *
 * @example
 * ```tsx
 * <Pill icon="check">OK</Pill>
 * <Pill.Double icon="alert-triangle">Warning</Pill.Double>
 * <Pill.Filled icon="circle-x">Critical</Pill.Filled>
 * <Pill.Dashed>Neutral</Pill.Dashed>
 * <Pill.Dotted icon="circle-off">Offline</Pill.Dotted>
 * ```
 */
export function Pill({ className, children, icon, size = "md", ...rest }: PillProps) {
  return (
    <span
      className={cx(`eink-pill eink-pill--solid eink-pill--${size}`, [
        className ?? "",
        !!className,
      ])}
      {...rest}
    >
      {renderContent(children, icon, size)}
    </span>
  );
}

/** {@link Pill} with a double border (thin outer outline, thick inner border). */
function Double({ className, children, icon, size = "md", ...rest }: PillProps) {
  return (
    <span
      className={cx(`eink-pill eink-pill--double eink-pill--${size}`, [
        className ?? "",
        !!className,
      ])}
      {...rest}
    >
      {renderContent(children, icon, size)}
    </span>
  );
}

/** {@link Pill} filled black with a white label and icon. */
function Filled({ className, children, icon, size = "md", ...rest }: PillProps) {
  return (
    <span
      className={cx(`eink-pill eink-pill--filled eink-pill--${size}`, [
        className ?? "",
        !!className,
      ])}
      {...rest}
    >
      {renderContent(children, icon, size)}
    </span>
  );
}

/** {@link Pill} with a dashed border. */
function Dashed({ className, children, icon, size = "md", ...rest }: PillProps) {
  return (
    <span
      className={cx(`eink-pill eink-pill--dashed eink-pill--${size}`, [
        className ?? "",
        !!className,
      ])}
      {...rest}
    >
      {renderContent(children, icon, size)}
    </span>
  );
}

/** {@link Pill} with a dotted border. */
function Dotted({ className, children, icon, size = "md", ...rest }: PillProps) {
  return (
    <span
      className={cx(`eink-pill eink-pill--dotted eink-pill--${size}`, [
        className ?? "",
        !!className,
      ])}
      {...rest}
    >
      {renderContent(children, icon, size)}
    </span>
  );
}

Pill.Double = Double;
Pill.Filled = Filled;
Pill.Dashed = Dashed;
Pill.Dotted = Dotted;
