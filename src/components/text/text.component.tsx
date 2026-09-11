import type { HTMLAttributes } from "react";

import { cx } from "../../utils/cx.utils";

import "./text.component.css";

/** HTML element rendered by {@link Text}. Defaults to `"p"`. */
export type TextAs = "p" | "span";

/** Props accepted by {@link Text}. */
export interface TextProps extends HTMLAttributes<HTMLParagraphElement | HTMLSpanElement> {
  /** Element to render, `"p"` or `"span"`. Defaults to `"p"`. */
  as?: TextAs;
}

/**
 * Body text component, rendered as a `<p>` by default or a `<span>` via `as`.
 *
 * @example
 * ```tsx
 * <Text>Paragraph copy.</Text>
 * <Text as="span">Inline copy.</Text>
 * ```
 */
export function Text({ as = "p", className, children, ...rest }: TextProps) {
  const Tag = as;

  return (
    <Tag className={cx("eink-text", [className ?? "", !!className])} {...rest}>
      {children}
    </Tag>
  );
}
