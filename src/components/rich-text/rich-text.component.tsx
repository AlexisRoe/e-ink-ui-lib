import type { HTMLAttributes } from "react";
import { Fragment } from "react";
import { Highlight } from "../highlight/highlight.component";

/** One run of text produced by {@link parseRichText}. */
export interface RichTextSegment {
  /** The text without its `**` markers. */
  text: string;
  /** Whether the text was wrapped in `**…**`. */
  strong: boolean;
}

/**
 * Splits `**bold**` markup into plain and emphasised segments. Unclosed or
 * empty markers (`**`, `****`) stay plain text.
 *
 * @example
 * ```ts
 * parseRichText("Use **strong** passwords");
 * // [{ text: "Use ", strong: false }, { text: "strong", strong: true }, { text: " passwords", strong: false }]
 * ```
 */
export function parseRichText(text: string): RichTextSegment[] {
  return text
    .split(/(\*\*[^*]+\*\*)/g)
    .filter((part) => part.length > 0)
    .map((part) =>
      part.startsWith("**") && part.endsWith("**") && part.length > 4
        ? { text: part.slice(2, -2), strong: true }
        : { text: part, strong: false },
    );
}

/** Props accepted by {@link RichText}. */
export interface RichTextProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
  /** Text that may contain `**bold**` emphasis. */
  text: string;
  /** Renders emphasis as a wave underline instead of a grey background. See {@link Highlight}. */
  mono?: boolean;
}

/**
 * Renders text with `**bold**` emphasis as {@link Highlight} marks, never as
 * HTML, so it is safe under a strict CSP and for untrusted strings. The
 * single wrapping `<span>` keeps the text in one inline flow inside flex
 * containers such as list items or alerts.
 *
 * @example
 * ```tsx
 * <RichText text="Prüfe die **Schutzbedarfsfeststellung** zuerst." />
 * ```
 */
export function RichText({ text, mono, ...rest }: RichTextProps) {
  return (
    <span {...rest}>
      {parseRichText(text).map((segment, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: segments are static and positional
        <Fragment key={index}>
          {segment.strong ? <Highlight mono={mono}>{segment.text}</Highlight> : segment.text}
        </Fragment>
      ))}
    </span>
  );
}
