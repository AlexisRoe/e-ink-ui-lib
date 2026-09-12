import type { HTMLAttributes } from "react";

import { cx } from "../../utils/cx.utils";
import { Icon } from "../icons/icon";

import "./avatar.component.css";

/** Sizes accepted by {@link Avatar} and {@link AvatarProfile}. Defaults to `"md"`. */
export type AvatarSize = "sm" | "md" | "xl";

/** Props accepted by {@link Avatar}. */
export interface AvatarProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /**
   * Name used to derive the initials shown as credentials. The first letter
   * of up to the first two words is rendered, uppercased.
   */
  userName: string;
  /** Size of the avatar. Defaults to `"md"`. */
  size?: AvatarSize;
  /** When true, shows a small notification badge on the top-right corner. */
  notification?: boolean;
}

/** Props accepted by {@link AvatarProfile}. */
export interface AvatarProfileProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Name used for the image's `alt` text and as the fallback icon's accessible label. */
  userName: string;
  /** Image URL. When omitted, renders a user icon on a black background instead. */
  src?: string;
  /** Size of the avatar. Defaults to `"md"`. */
  size?: AvatarSize;
  /** When true, shows a small notification badge on the top-right corner. */
  notification?: boolean;
  /**
   * When true, renders the image in black and white only (grayscale,
   * e-ink-friendly rendering) instead of full color.
   */
  mono?: boolean;
}

function getInitials(userName: string): string {
  return userName
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

/**
 * Square avatar showing a user's credentials (initials) on a black
 * background. Accepts an optional `size` (`"sm"` | `"md"` | `"xl"`, defaults
 * to `"md"`) and an optional `notification` badge shown on the top-right
 * corner.
 *
 * Use {@link AvatarProfile} (`Avatar.Profile`) instead when you need to show
 * a user's photo.
 *
 * @example
 * ```tsx
 * <Avatar userName="Ada Lovelace" />
 * <Avatar userName="Ada Lovelace" size="xl" notification />
 * ```
 */
export function Avatar({ className, userName, size = "md", notification, ...rest }: AvatarProps) {
  return (
    <div
      className={cx(`eink-avatar eink-avatar--${size} eink-avatar--initials`, [
        className ?? "",
        !!className,
      ])}
      {...rest}
    >
      <span className="eink-avatar__initials">{getInitials(userName)}</span>
      {notification ? <span className="eink-avatar__notification" aria-hidden="true" /> : null}
    </div>
  );
}

/**
 * Square avatar for displaying a user's photo. Renders the image bordered
 * inside a square box when `src` is provided; otherwise falls back to a user
 * icon on a black background. Accepts an optional `size`, `notification`
 * badge, and `mono` flag to render the photo in black and white only.
 *
 * @example
 * ```tsx
 * <Avatar.Profile userName="Ada Lovelace" src="https://example.com/ada.jpg" />
 * <Avatar.Profile userName="Ada Lovelace" src="https://example.com/ada.jpg" mono />
 * <Avatar.Profile userName="Ada Lovelace" size="xl" notification />
 * ```
 */
export function AvatarProfile({
  className,
  userName,
  src,
  size = "md",
  notification,
  mono,
  ...rest
}: AvatarProfileProps) {
  return (
    <div
      className={cx(`eink-avatar eink-avatar--${size} eink-avatar--${src ? "image" : "fallback"}`, [
        className ?? "",
        !!className,
      ])}
      {...rest}
    >
      {src ? (
        <img
          className={cx("eink-avatar__image", ["eink-avatar__image--mono", !!mono])}
          src={src}
          alt={userName}
        />
      ) : (
        <Icon className="eink-avatar__fallback-icon" name="user" aria-label={userName} />
      )}
      {notification ? <span className="eink-avatar__notification" aria-hidden="true" /> : null}
    </div>
  );
}

Avatar.Profile = AvatarProfile;
