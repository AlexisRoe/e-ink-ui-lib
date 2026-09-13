import type { HTMLAttributes } from "react";

import { cx } from "../../utils/cx.utils";

import "./flex.component.css";

/** Gap sizes accepted by {@link Flex} and {@link Grid}. Defaults to `"md"`. */
export type FlexGap = "sm" | "md" | "xl";

/** `justify-content` values accepted by {@link Flex}. */
export type FlexJustify =
  | "start"
  | "center"
  | "end"
  | "space-between"
  | "space-around"
  | "space-evenly";

/** `align-items` values accepted by {@link Flex}. */
export type FlexAlign = "start" | "center" | "end" | "stretch" | "baseline";

/**
 * `row`/`column` are mutually exclusive: providing both is a type error.
 * `row` is the default direction when neither is given.
 */
export type FlexDirectionProps =
  | { row?: boolean; column?: never }
  | { column?: boolean; row?: never };

/** Props accepted by {@link Flex}. */
export type FlexProps = HTMLAttributes<HTMLDivElement> &
  FlexDirectionProps & {
    /** `justify-content` of the flex container. */
    justify?: FlexJustify;
    /** `align-items` of the flex container. */
    align?: FlexAlign;
    /** Gap between children, from the `--eink-size-*` scale. Defaults to `"md"`. */
    gap?: FlexGap;
    /** Whether children wrap onto multiple lines. Defaults to `false`. */
    wrap?: boolean;
    /** Renders as `inline-flex` instead of `flex`. Defaults to `false`. */
    inline?: boolean;
  };

const JUSTIFY_MAP: Record<FlexJustify, string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  "space-between": "space-between",
  "space-around": "space-around",
  "space-evenly": "space-evenly",
};

const ALIGN_MAP: Record<FlexAlign, string> = {
  start: "flex-start",
  center: "center",
  end: "flex-end",
  stretch: "stretch",
  baseline: "baseline",
};

/**
 * `display: flex` layout container. Direction defaults to row; pass
 * `column` to switch to a column layout (`row` and `column` are mutually
 * exclusive). Accepts `justify`, `align`, a token-based `gap`
 * (`"sm"` | `"md"` | `"xl"`, defaults to `"md"`), `wrap`, and an `inline`
 * flag to render as `inline-flex` instead of `flex`.
 *
 * @example
 * ```tsx
 * <Flex justify="space-between" align="center" gap="md">
 *   <Button>Cancel</Button>
 *   <Button>Save</Button>
 * </Flex>
 * <Flex column gap="sm">
 *   <Text>First</Text>
 *   <Text>Second</Text>
 * </Flex>
 * ```
 */
export function Flex({
  className,
  style,
  column,
  justify,
  align,
  gap = "md",
  wrap = false,
  inline = false,
  ...rest
}: FlexProps) {
  return (
    <div
      className={cx(
        `eink-flex eink-flex--gap-${gap}`,
        ["eink-flex--column", !!column],
        ["eink-flex--wrap", wrap],
        ["eink-flex--inline", inline],
        [className ?? "", !!className],
      )}
      style={{
        ...(justify ? { justifyContent: JUSTIFY_MAP[justify] } : null),
        ...(align ? { alignItems: ALIGN_MAP[align] } : null),
        ...style,
      }}
      {...rest}
    />
  );
}
