import type { HTMLAttributes } from "react";
import { cx } from "../../utils/cx.utils";

import "./highlight.component.css";

/** Props accepted by {@link Highlight}. */
export interface HighlightProps extends HTMLAttributes<HTMLElement> {
  /**
   * When true, renders the highlight as a wave underline instead of a
   * light grey background, for use in monochrome/mono contexts. Defaults
   * to false.
   */
  mono?: boolean;
}

/**
 * Marks a run of text as highlighted, using the semantic `<mark>` element.
 * By default the highlighted text gets a light grey background; when `mono`
 * is true it instead gets a wave underline, so the highlight stays visible
 * without relying on background contrast.
 *
 * @example
 * ```tsx
 * <Highlight>important text</Highlight>
 * <Highlight mono>important text</Highlight>
 * ```
 */
export function Highlight({ className, children, mono = false, ...rest }: HighlightProps) {
  return (
    <mark
      className={cx(
        "eink-highlight",
        ["eink-highlight--mono", mono],
        ["eink-highlight--background", !mono],
        [className ?? "", !!className],
      )}
      {...rest}
    >
      {children}
    </mark>
  );
}
