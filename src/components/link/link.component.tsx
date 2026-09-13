import type { AnchorHTMLAttributes } from "react";
import { cx } from "../../utils/cx.utils";
import { Icon } from "../icons/icon";

import "./link.component.css";

/** Props accepted by {@link Link}. */
export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "target" | "rel"> {
  /**
   * When true, the link opens in a new tab with `rel="noopener noreferrer"`
   * and shows an external-link icon in front of the text. Defaults to false.
   */
  external?: boolean;
  /**
   * When true, renders the link in a dark grey to indicate it has already
   * been visited/clicked. Defaults to false.
   */
  alreadyClicked?: boolean;
  /**
   * When true, renders an already-visited link (`alreadyClicked`) in black
   * instead of grey, with a dashed underline instead of a solid one. Has no
   * effect unless `alreadyClicked` is also true. Defaults to false.
   */
  mono?: boolean;
  /**
   * When true, renders the link struck through and makes it non-interactive
   * (no `href`, not focusable, clicks are prevented). Defaults to false.
   */
  disabled?: boolean;
}

/**
 * Anchor styled to match the e-ink theme. When `external` is true, opens in
 * a new tab with `rel="noopener noreferrer"` and shows an external-link icon
 * in front of the text. When `alreadyClicked` is true, renders in a dark
 * grey instead of black — or, combined with `mono`, in black with a dashed
 * underline. When `disabled` is true, the link is struck through and
 * non-interactive.
 *
 * @example
 * ```tsx
 * <Link href="/about">About</Link>
 * <Link href="https://example.com" external>Example</Link>
 * <Link href="/about" alreadyClicked>About</Link>
 * <Link href="/about" alreadyClicked mono>About</Link>
 * <Link href="/about" disabled>About</Link>
 * ```
 */
export function Link({
  className,
  children,
  external = false,
  alreadyClicked = false,
  mono = false,
  disabled = false,
  href,
  onClick,
  ...rest
}: LinkProps) {
  return (
    <a
      className={cx(
        "eink-link",
        ["eink-link--clicked", alreadyClicked],
        ["eink-link--mono", mono],
        ["eink-link--disabled", disabled],
        [className ?? "", !!className],
      )}
      href={disabled ? undefined : href}
      aria-disabled={disabled || undefined}
      tabIndex={disabled ? -1 : undefined}
      onClick={disabled ? (event) => event.preventDefault() : onClick}
      target={external && !disabled ? "_blank" : undefined}
      rel={external && !disabled ? "noopener noreferrer" : undefined}
      {...rest}
    >
      {external ? (
        <Icon name="external-link" size={18} className="eink-link__icon" aria-hidden="true" />
      ) : null}
      {children}
    </a>
  );
}
