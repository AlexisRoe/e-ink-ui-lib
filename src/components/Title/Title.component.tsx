import type { HTMLAttributes } from "react";
import { cx } from "../theme/theme.provider";
import "./Title.component.css";

/** Heading level accepted by {@link Title}, mapping 1:1 to `<h1>`–`<h6>`. */
export type TitleSize = 1 | 2 | 3 | 4 | 5 | 6;

/** Props accepted by {@link Title}. */
export interface TitleProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Heading level, `1`–`6`. Determines both the rendered tag and the font size. Defaults to `1`. */
  size?: TitleSize;
}

const TAGS = ["h1", "h2", "h3", "h4", "h5", "h6"] as const;

/**
 * Heading component covering `<h1>`–`<h6>`, selected via the `size` prop.
 *
 * @example
 * ```tsx
 * <Title size={1}>Page title</Title>
 * <Title size={3}>Section title</Title>
 * ```
 */
export function Title({ size = 1, className, children, ...rest }: TitleProps) {
  const Tag = TAGS[size - 1];

  return (
    <Tag className={cx(`eink-title eink-title--${size}`, [className ?? "", !!className])} {...rest}>
      {children}
    </Tag>
  );
}
