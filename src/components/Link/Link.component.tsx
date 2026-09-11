import type { AnchorHTMLAttributes } from "react";
import { Icon } from "../icons/Icon";
import "./Link.component.css";

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
}

/**
 * Anchor styled to match the e-ink theme. When `external` is true, opens in
 * a new tab with `rel="noopener noreferrer"` and shows an external-link icon
 * in front of the text. When `alreadyClicked` is true, renders in a dark
 * grey instead of black.
 *
 * @example
 * ```tsx
 * <Link href="/about">About</Link>
 * <Link href="https://example.com" external>Example</Link>
 * <Link href="/about" alreadyClicked>About</Link>
 * ```
 */
export function Link({
  className,
  children,
  external = false,
  alreadyClicked = false,
  ...rest
}: LinkProps) {
  return (
    <a
      className={["eink-link", alreadyClicked ? "eink-link--clicked" : null, className]
        .filter(Boolean)
        .join(" ")}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      {...rest}
    >
      {external ? (
        <Icon name="external-link" size={18} className="eink-link__icon" aria-hidden="true" />
      ) : null}
      {children}
    </a>
  );
}
