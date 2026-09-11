import type { HTMLAttributes } from "react";
import { cx } from "../theme/theme.provider";
import "./Avatar.component.css";

/** Sizes accepted by {@link Avatar}. Defaults to `"md"`. */
export type AvatarSize = "sm" | "md" | "xl";

/** Props accepted by {@link Avatar}. */
export interface AvatarProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /**
   * Name used to derive the initials shown when `src` is not provided. The
   * first letter of up to the first two words is rendered, uppercased.
   */
  userName: string;
  /** Image URL. When provided, renders the image instead of initials. */
  src?: string;
  /** Size of the avatar. Defaults to `"md"`. */
  size?: AvatarSize;
  /** When true, shows a small notification badge on the top-right corner. */
  notification?: boolean;
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
 * Square avatar, either initials on a black background or a bordered image.
 *
 * Derives up to two uppercase initials from `userName` when no `src` is
 * given; when `src` is given, renders the image centered inside a square box
 * with a 2px black border. Accepts an optional `size` (`"sm"` | `"md"` |
 * `"xl"`, defaults to `"md"`) and an optional `notification` badge shown on
 * the top-right corner.
 *
 * @example
 * ```tsx
 * <Avatar userName="Ada Lovelace" />
 * <Avatar userName="Ada Lovelace" src="https://example.com/ada.jpg" />
 * <Avatar userName="Ada Lovelace" size="xl" notification />
 * ```
 */
export function Avatar({
  className,
  userName,
  src,
  size = "md",
  notification,
  ...rest
}: AvatarProps) {
  return (
    <div
      className={cx(`eink-avatar eink-avatar--${size} eink-avatar--${src ? "image" : "initials"}`, [
        className ?? "",
        !!className,
      ])}
      {...rest}
    >
      {src ? (
        <img className="eink-avatar__image" src={src} alt={userName} />
      ) : (
        <span className="eink-avatar__initials">{getInitials(userName)}</span>
      )}
      {notification ? <span className="eink-avatar__notification" aria-hidden="true" /> : null}
    </div>
  );
}
