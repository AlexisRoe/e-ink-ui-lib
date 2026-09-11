import type { ButtonHTMLAttributes, ReactNode } from "react";
import { Icon } from "../icons/Icon";
import type { IconName } from "../icons/icons";
import "./Button.css";

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

/** Props shared by every text button variant. */
type ButtonVariantProps = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> &
  ButtonIconSlotProps & {
    children: ReactNode;
  };

/** Props accepted by {@link Button}. */
export type ButtonProps = ButtonVariantProps;

/** Props shared by every icon-only button variant. */
export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  /** Name of the icon to render, from the {@link IconName} registry. */
  icon: IconName;
  /** Accessible label; required since icon-only buttons have no text content. */
  "aria-label": string;
}

const ICON_SIZE = 16;

function renderContent({
  iconLeft,
  iconRight,
  children,
}: {
  iconLeft?: IconName;
  iconRight?: IconName;
  children: ReactNode;
}) {
  return (
    <>
      {iconLeft ? (
        <Icon name={iconLeft} size={ICON_SIZE} className="eink-button__icon" aria-hidden="true" />
      ) : null}
      <span className="eink-button__label">{children}</span>
      {iconRight ? (
        <Icon name={iconRight} size={ICON_SIZE} className="eink-button__icon" aria-hidden="true" />
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
 * Filled button: black background, white label. Inverts to a white
 * background with a 2px black border while pressed.
 *
 * Accepts an optional icon on the left or right via `iconLeft` /
 * `iconRight` (only one at a time — see {@link ButtonIconSlotProps}).
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
 * ```
 */
export function Button({ className, children, iconLeft, iconRight, ...rest }: ButtonProps) {
  return (
    <button type="button" className={buildClassName(["filled"], className)} {...rest}>
      {renderContent({ iconLeft, iconRight, children })}
    </button>
  );
}

/**
 * Outlined button: transparent background with a 2px black border.
 * Inverts to a black background with a white label while pressed.
 */
function Outlined({ className, children, iconLeft, iconRight, ...rest }: ButtonProps) {
  return (
    <button type="button" className={buildClassName(["outlined"], className)} {...rest}>
      {renderContent({ iconLeft, iconRight, children })}
    </button>
  );
}

/**
 * Naked button: no background or border, just the label. Inverts to a
 * black background with a white label while pressed.
 */
function Naked({ className, children, iconLeft, iconRight, ...rest }: ButtonProps) {
  return (
    <button type="button" className={buildClassName(["naked"], className)} {...rest}>
      {renderContent({ iconLeft, iconRight, children })}
    </button>
  );
}

/** Icon-only filled button. Requires an accessible `aria-label`. */
function IconButton({ className, icon, ...rest }: IconButtonProps) {
  return (
    <button type="button" className={buildClassName(["filled", "icon"], className)} {...rest}>
      <Icon name={icon} size={ICON_SIZE} className="eink-button__icon" aria-hidden="true" />
    </button>
  );
}

/** Icon-only outlined button. Requires an accessible `aria-label`. */
function IconOutlined({ className, icon, ...rest }: IconButtonProps) {
  return (
    <button type="button" className={buildClassName(["outlined", "icon"], className)} {...rest}>
      <Icon name={icon} size={ICON_SIZE} className="eink-button__icon" aria-hidden="true" />
    </button>
  );
}

/** Icon-only naked button. Requires an accessible `aria-label`. */
function IconNaked({ className, icon, ...rest }: IconButtonProps) {
  return (
    <button type="button" className={buildClassName(["naked", "icon"], className)} {...rest}>
      <Icon name={icon} size={ICON_SIZE} className="eink-button__icon" aria-hidden="true" />
    </button>
  );
}

Button.Outlined = Outlined;
Button.Naked = Naked;
Button.Icon = IconButton;
Button.IconOutlined = IconOutlined;
Button.IconNaked = IconNaked;
