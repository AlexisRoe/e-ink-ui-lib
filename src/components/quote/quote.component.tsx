import type { BlockquoteHTMLAttributes } from "react";
import { cx } from "../../utils/cx.utils";

import "./quote.component.css";

/** Props accepted by {@link Quote}. */
export interface QuoteProps extends BlockquoteHTMLAttributes<HTMLElement> {
  /** Source of the quote, e.g. an author or work. Rendered as a citation below the quote. */
  cite?: string;
  /** When true, renders in plain black and white instead of a light grey background. Defaults to false. */
  mono?: boolean;
}

/**
 * Block quotation rendered with the semantic `<blockquote>` element, with an
 * optional `cite` prop rendered as a `<cite>` element styled as a small,
 * muted label beneath the quoted text. When `mono` is true, renders in plain
 * black and white instead of a light grey background.
 *
 * @example
 * ```tsx
 * <Quote cite="Forrest Gump">
 *   Life is like an npm install — you never know what you are going to get.
 * </Quote>
 * ```
 */
export function Quote({ className, children, cite, mono = false, ...rest }: QuoteProps) {
  return (
    <blockquote
      className={cx("eink-quote", ["eink-quote--mono", mono], [className ?? "", !!className])}
      {...rest}
    >
      <p className="eink-quote__text">{children}</p>
      {cite ? <cite className="eink-quote__cite">— {cite}</cite> : null}
    </blockquote>
  );
}
