import type { SVGAttributes, SVGProps } from "react";
import { useId } from "react";

import { cx } from "../../utils/cx.utils";

/** Props accepted by {@link PatternOverlay}. */
export interface PatternOverlayProps extends SVGAttributes<SVGSVGElement> {
  /** Size, in px, of one repeating tile of the diagonal-stripe pattern. Defaults to `8`. */
  size?: number;
  /** Stroke color of the stripes. Defaults to `"black"`. */
  stroke?: string;
  /** Stroke width of the stripes. Defaults to `2`. */
  strokeWidth?: number;
  /** Overrides for the `<rect>` the pattern is painted onto (e.g. to inset it and add its own border). */
  rectProps?: SVGProps<SVGRectElement>;
  /**
   * Whether to apply the shared `eink-pattern-overlay` class, which
   * absolutely positions the svg to fill its nearest positioned ancestor.
   * Set to `false` when the svg is sized/positioned entirely by its own
   * `className` instead (e.g. a fixed-size marker). Defaults to `true`.
   */
  overlay?: boolean;
}

/**
 * Diagonal black-stripe pattern used across the library to indicate a
 * "pending"/"warning"/disabled-style state on an e-ink-safe (non-color)
 * surface. Renders a `<svg>` filling its container by default (via the
 * shared `eink-pattern-overlay` class) with a repeating 45°-rotated stripe
 * pattern; not part of the public API.
 *
 * @example
 * ```tsx
 * <PatternOverlay className="eink-alert__pattern" />
 * <PatternOverlay size={4} stroke="currentColor" rectProps={{ x: 1, y: 1, width: 14, height: 14, stroke: "currentColor", strokeWidth: 2 }} />
 * ```
 */
export function PatternOverlay({
  size = 8,
  stroke = "black",
  strokeWidth = 2,
  className,
  rectProps,
  overlay = true,
  ...rest
}: PatternOverlayProps) {
  const patternId = useId();
  const ariaHidden = rest.role || rest["aria-label"] ? undefined : true;

  return (
    // biome-ignore lint/a11y/noSvgWithoutTitle: aria-hidden is set (or role/aria-label is passed via rest)
    <svg
      className={cx(overlay ? "eink-pattern-overlay" : "", [className ?? "", !!className])}
      aria-hidden={ariaHidden}
      {...rest}
    >
      <defs>
        <pattern
          id={patternId}
          width={size}
          height={size}
          patternUnits="userSpaceOnUse"
          patternTransform="rotate(45)"
        >
          <line x1="0" y1="0" x2="0" y2={size} stroke={stroke} strokeWidth={strokeWidth} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} {...rectProps} />
    </svg>
  );
}
