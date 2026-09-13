import { Children, type HTMLAttributes, type ReactNode } from "react";

import { cx } from "../../utils/cx.utils";
import type { FlexGap } from "../flex/flex.component";

import "./grid.component.css";

/**
 * `columns` and `minColumnWidth` are mutually exclusive: providing both is
 * a type error. Use `columns` for a fixed count, or `minColumnWidth` to
 * automatically fit as many columns of at least that width as the
 * container allows, reflowing as it's resized.
 */
export type GridColumnsProps =
  | { columns?: number; minColumnWidth?: never }
  | { minColumnWidth?: number; columns?: never };

/** Props accepted by {@link Grid}. */
export type GridProps = HTMLAttributes<HTMLDivElement> &
  GridColumnsProps & {
    /** Gap between cells, from the `--eink-size-*` scale. Defaults to `"md"`. */
    gap?: FlexGap;
  };

/** Props accepted by {@link Grid.Item}. */
export interface GridItemProps extends HTMLAttributes<HTMLDivElement> {
  /** Number of columns this item spans. Defaults to `1`. */
  colSpan?: number;
  /** Number of rows this item spans. Defaults to `1`. */
  rowSpan?: number;
}

/** Props accepted by {@link Grid.Masonry}. */
export interface GridMasonryProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Minimum width, in pixels, of each column before another one is added. Defaults to `240`. */
  minItemWidth?: number;
  /** Gap between items, from the `--eink-size-*` scale. Defaults to `"md"`. */
  gap?: FlexGap;
  /** Items to lay out; each is measured and placed into the shortest column automatically. */
  children?: ReactNode;
}

/**
 * `display: grid` cell. Optionally spans multiple columns/rows via
 * `colSpan`/`rowSpan`. Can only be used inside {@link Grid} or
 * {@link Grid.Masonry}.
 *
 * @example
 * ```tsx
 * <Grid.Item colSpan={2}>Wide cell</Grid.Item>
 * ```
 */
function GridItem({ className, colSpan = 1, rowSpan = 1, style, ...rest }: GridItemProps) {
  return (
    <div
      className={cx("eink-grid__item", [className ?? "", !!className])}
      style={{ gridColumn: `span ${colSpan}`, gridRow: `span ${rowSpan}`, ...style }}
      {...rest}
    />
  );
}

/**
 * Equal-width column {@link Grid.Masonry} alternative: children are stacked
 * into evenly sized columns (via CSS multi-column layout) that
 * automatically reflow as the container is resized, without needing to
 * know each child's size up front.
 *
 * @example
 * ```tsx
 * <Grid.Masonry minItemWidth={200} gap="md">
 *   <Card>Short card</Card>
 *   <Card>A card with much more content, wrapping onto several lines</Card>
 *   <Card>Another card</Card>
 * </Grid.Masonry>
 * ```
 */
function GridMasonry({
  className,
  style,
  minItemWidth = 240,
  gap = "md",
  children,
  ...rest
}: GridMasonryProps) {
  return (
    <div
      className={cx(`eink-grid-masonry eink-grid-masonry--gap-${gap}`, [
        className ?? "",
        !!className,
      ])}
      style={{ ["--eink-grid-masonry-min-item-width" as string]: `${minItemWidth}px`, ...style }}
      {...rest}
    >
      {Children.map(children, (child) => (
        <div className="eink-grid-masonry__item">{child}</div>
      ))}
    </div>
  );
}

/**
 * `display: grid` layout container. Accepts either a fixed, equal-width
 * `columns` count (defaults to `2`) or a `minColumnWidth` (in pixels) to
 * automatically fit as many columns of at least that width as the
 * container allows, reflowing them as it's resized — the two are mutually
 * exclusive. Also accepts a token-based `gap` (`"sm"` | `"md"` | `"xl"`,
 * defaults to `"md"`). Cells are {@link Grid.Item}, which can span
 * multiple columns/rows.
 *
 * A {@link Grid.Masonry} variant is available for content whose height
 * varies per item and that should reflow automatically as the container is
 * resized.
 *
 * @example
 * ```tsx
 * <Grid columns={3} gap="md">
 *   <Grid.Item>A</Grid.Item>
 *   <Grid.Item colSpan={2}>B</Grid.Item>
 * </Grid>
 * <Grid minColumnWidth={200} gap="md">
 *   <Grid.Item>A</Grid.Item>
 *   <Grid.Item>B</Grid.Item>
 * </Grid>
 * ```
 */
export function Grid({
  className,
  style,
  columns,
  minColumnWidth,
  gap = "md",
  ...rest
}: GridProps) {
  const gridTemplateColumns = minColumnWidth
    ? `repeat(auto-fit, minmax(${minColumnWidth}px, 1fr))`
    : `repeat(${columns ?? 2}, 1fr)`;

  return (
    <div
      className={cx(`eink-grid eink-grid--gap-${gap}`, [className ?? "", !!className])}
      style={{ gridTemplateColumns, ...style }}
      {...rest}
    />
  );
}

Grid.Item = GridItem;
Grid.Masonry = GridMasonry;
