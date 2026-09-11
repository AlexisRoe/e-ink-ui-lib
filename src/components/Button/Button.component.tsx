import type { ButtonHTMLAttributes, CSSProperties, ReactNode } from "react";
import { useEffect, useState } from "react";
import { Icon } from "../icons/Icon";
import type { IconName } from "../icons/icons";
import "./Button.component.css";

/**
 * Icon slot props shared by the text button variants ({@link Button},
 * {@link Button.Outlined}, {@link Button.Naked}).
 *
 * Only one of `iconLeft` or `iconRight` may be supplied at a time; the type
 * enforces this so passing both is a compile-time error.
 */
export type ButtonIconSlotProps =
  | { iconLeft?: IconName; iconRight?: never }
  | { iconLeft?: never; iconRight?: IconName };

/** Sizes accepted by every button variant. Defaults to `"md"`. */
export type ButtonSize = "sm" | "md" | "xl";

/** Props shared by every button variant, text or icon-only. */
type ButtonSizeProps = {
  /** Size of the button. Defaults to `"md"`. */
  size?: ButtonSize;
};

/** Props shared by every text button variant. */
type ButtonVariantProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> &
  ButtonIconSlotProps &
  ButtonSizeProps & {
    children: ReactNode;
  };

/** Props accepted by {@link Button} and {@link Button.Outlined}. */
export type ButtonProps = ButtonVariantProps & {
  /** When true, the button stretches to fill the width of its container. */
  fullWidth?: boolean;
  /**
   * When true, shows an hourglass icon in front of the label that flips
   * 180 degrees every `flipIntervalMs`, replacing any `iconLeft`/`iconRight`.
   * The button is disabled by default while loading, unless `disabled` is
   * explicitly set.
   */
  loading?: boolean;
  /** Milliseconds between each 180 degree icon flip while `loading`. Defaults to 2000. */
  flipIntervalMs?: number;
};

/** Props shared by every icon-only button variant. */
export interface IconButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">,
    ButtonSizeProps {
  /** Name of the icon to render, from the {@link IconName} registry. */
  icon: IconName;
  /** Accessible label; required since icon-only buttons have no text content. */
  "aria-label": string;
}

/** Icon pixel size per {@link ButtonSize}. */
const ICON_SIZES: Record<ButtonSize, number> = {
  sm: 14,
  md: 16,
  xl: 24,
};

const DEFAULT_LOADING_FLIP_INTERVAL_MS = 2000;

function renderContent({
  iconLeft,
  iconRight,
  iconSize,
  iconClassName,
  iconStyle,
  children,
}: {
  iconLeft?: IconName;
  iconRight?: IconName;
  iconSize: number;
  iconClassName?: string;
  iconStyle?: CSSProperties;
  children: ReactNode;
}) {
  const iconClasses = ["eink-button__icon", iconClassName].filter(Boolean).join(" ");

  return (
    <>
      {iconLeft ? (
        <Icon
          name={iconLeft}
          size={iconSize}
          className={iconClasses}
          style={iconStyle}
          aria-hidden="true"
        />
      ) : null}
      <span className="eink-button__label">{children}</span>
      {iconRight ? (
        <Icon
          name={iconRight}
          size={iconSize}
          className={iconClasses}
          style={iconStyle}
          aria-hidden="true"
        />
      ) : null}
    </>
  );
}

function buildClassName(modifiers: string[], className: string | undefined) {
  return ["eink-button", ...modifiers.map((modifier) => `eink-button--${modifier}`), className]
    .filter(Boolean)
    .join(" ");
}

/**
 * Discrete (non-animated) 180 degree flip, toggled every `flipIntervalMs`
 * while `loading` is true. A plain style change rather than a CSS
 * animation/transition, since the theme disables those globally.
 */
function useLoadingFlipStyle(loading: boolean, flipIntervalMs: number): CSSProperties | undefined {
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (!loading) {
      setFlipped(false);
      return;
    }

    const id = setInterval(() => setFlipped((current) => !current), flipIntervalMs);
    return () => clearInterval(id);
  }, [loading, flipIntervalMs]);

  return loading ? { transform: flipped ? "rotate(180deg)" : "rotate(0deg)" } : undefined;
}

/**
 * Filled button: black background, white label. Inverts to a white
 * background with a 2px black border while pressed.
 *
 * Accepts an optional icon on the left or right via `iconLeft` /
 * `iconRight` (only one at a time — see {@link ButtonIconSlotProps}), an
 * optional `size` (`"sm"` | `"md"` | `"xl"`, defaults to `"md"`), an
 * optional `fullWidth` to stretch the button to fill its container, and an
 * optional `loading` state that shows a flipping hourglass icon in front of
 * the label.
 *
 * Additional variants are available as static properties:
 * {@link Button.Outlined}, {@link Button.Naked}, {@link Button.Icon},
 * {@link Button.IconOutlined}, {@link Button.IconNaked}.
 *
 * @example
 * ```tsx
 * <Button>Save</Button>
 * <Button iconLeft="check">Confirm</Button>
 * <Button.Outlined iconRight="arrow-right">Next</Button.Outlined>
 * <Button.Icon icon="trash" aria-label="Delete" />
 * <Button loading>Saving</Button>
 * <Button size="xl">Save</Button>
 * ```
 */
export function Button({
  className,
  children,
  iconLeft,
  iconRight,
  size = "md",
  fullWidth,
  loading = false,
  flipIntervalMs = DEFAULT_LOADING_FLIP_INTERVAL_MS,
  disabled,
  ...rest
}: ButtonProps) {
  const iconStyle = useLoadingFlipStyle(loading, flipIntervalMs);

  return (
    <button
      type="button"
      className={buildClassName(
        ["filled", size, ...(fullWidth ? ["full-width"] : []), ...(loading ? ["loading"] : [])],
        className,
      )}
      disabled={disabled ?? loading}
      {...rest}
    >
      {renderContent({
        iconLeft: loading ? "hourglass-high" : iconLeft,
        iconRight: loading ? undefined : iconRight,
        iconSize: ICON_SIZES[size],
        iconStyle,
        children,
      })}
    </button>
  );
}

/**
 * Outlined button: transparent background with a 2px black border.
 * Inverts to a black background with a white label while pressed.
 *
 * Accepts an optional `size`, `fullWidth`, and `loading` state — see
 * {@link Button}.
 */
function Outlined({
  className,
  children,
  iconLeft,
  iconRight,
  size = "md",
  fullWidth,
  loading = false,
  flipIntervalMs = DEFAULT_LOADING_FLIP_INTERVAL_MS,
  disabled,
  ...rest
}: ButtonProps) {
  const iconStyle = useLoadingFlipStyle(loading, flipIntervalMs);

  return (
    <button
      type="button"
      className={buildClassName(
        ["outlined", size, ...(fullWidth ? ["full-width"] : []), ...(loading ? ["loading"] : [])],
        className,
      )}
      disabled={disabled ?? loading}
      {...rest}
    >
      {renderContent({
        iconLeft: loading ? "hourglass-high" : iconLeft,
        iconRight: loading ? undefined : iconRight,
        iconSize: ICON_SIZES[size],
        iconStyle,
        children,
      })}
    </button>
  );
}

/**
 * Naked button: no background or border, just the label. Inverts to a
 * black background with a white label while pressed.
 *
 * Accepts an optional `size` — see {@link Button}.
 */
function Naked({
  className,
  children,
  iconLeft,
  iconRight,
  size = "md",
  ...rest
}: ButtonVariantProps) {
  return (
    <button type="button" className={buildClassName(["naked", size], className)} {...rest}>
      {renderContent({ iconLeft, iconRight, iconSize: ICON_SIZES[size], children })}
    </button>
  );
}

/** Icon-only filled button. Requires an accessible `aria-label`. Accepts an optional `size`. */
function IconButton({ className, icon, size = "md", ...rest }: IconButtonProps) {
  return (
    <button type="button" className={buildClassName(["filled", "icon", size], className)} {...rest}>
      <Icon name={icon} size={ICON_SIZES[size]} className="eink-button__icon" aria-hidden="true" />
    </button>
  );
}

/** Icon-only outlined button. Requires an accessible `aria-label`. Accepts an optional `size`. */
function IconOutlined({ className, icon, size = "md", ...rest }: IconButtonProps) {
  return (
    <button
      type="button"
      className={buildClassName(["outlined", "icon", size], className)}
      {...rest}
    >
      <Icon name={icon} size={ICON_SIZES[size]} className="eink-button__icon" aria-hidden="true" />
    </button>
  );
}

/** Icon-only naked button. Requires an accessible `aria-label`. Accepts an optional `size`. */
function IconNaked({ className, icon, size = "md", ...rest }: IconButtonProps) {
  return (
    <button type="button" className={buildClassName(["naked", "icon", size], className)} {...rest}>
      <Icon name={icon} size={ICON_SIZES[size]} className="eink-button__icon" aria-hidden="true" />
    </button>
  );
}

Button.Outlined = Outlined;
Button.Naked = Naked;
Button.Icon = IconButton;
Button.IconOutlined = IconOutlined;
Button.IconNaked = IconNaked;
