import type { HTMLAttributes } from "react";
import { cx } from "../../utils/cx.utils";

import "./code.component.css";

/** Props accepted by {@link Code}. */
export interface CodeProps extends HTMLAttributes<HTMLElement> {
  /**
   * When true, renders with a black background and white text instead of
   * a light grey background. Defaults to false.
   */
  mono?: boolean;
}

/** Props accepted by {@link Code.Block}. */
export interface CodeBlockProps extends HTMLAttributes<HTMLPreElement> {
  /**
   * When true, renders with a black background and white text instead of
   * a light grey background. Defaults to false.
   */
  mono?: boolean;
}

/**
 * Multi-line, preformatted code sample rendered with `<pre><code>` so
 * whitespace and indentation are preserved exactly as authored. There is no
 * syntax color coding, since e-ink displays render in greyscale.
 *
 * @example
 * ```tsx
 * <Code.Block mono>{`function greet(name) {\n  return \`Hello, \${name}\`;\n}`}</Code.Block>
 * ```
 */
function Block({ className, children, mono = false, ...rest }: CodeBlockProps) {
  return (
    <pre
      className={cx(
        "eink-code__block",
        ["eink-code__block--mono", mono],
        [className ?? "", !!className],
      )}
      {...rest}
    >
      <code>{children}</code>
    </pre>
  );
}

/**
 * Inline code snippet rendered with the semantic `<code>` element. By
 * default it gets a light grey background; when `mono` is true it gets a
 * black background with white text instead. For multi-line samples with
 * preserved indentation, use {@link Code.Block}.
 *
 * @example
 * ```tsx
 * <Code>npm install</Code>
 * <Code mono>npm install</Code>
 * ```
 */
export function Code({ className, children, mono = false, ...rest }: CodeProps) {
  return (
    <code
      className={cx("eink-code", ["eink-code--mono", mono], [className ?? "", !!className])}
      {...rest}
    >
      {children}
    </code>
  );
}

Code.Block = Block;
