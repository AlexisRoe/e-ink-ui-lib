import { useId } from "react";
import type { ChartDataset, ChartReferenceLine } from "../../utils/chart.utils";
import { calculateReferenceValue } from "../../utils/chart.utils";
import { cx } from "../../utils/cx.utils";

import "./column-chart.component.css";

const FILL_STYLES = ["solid", "striped", "empty"] as const;
type FillStyle = (typeof FILL_STYLES)[number];

/** Props accepted by {@link ColumnChart}. */
export interface ColumnChartProps {
  /**
   * Up to three series to plot as grouped vertical columns. Series are
   * filled in order as solid black, diagonal black stripes, then empty
   * (outline only); datasets beyond the third are ignored.
   */
  datasets: ChartDataset[];
  /** Labels shown beneath each group of columns. */
  categories?: string[];
  /** Heading rendered above the chart, combined with {@link ColumnChartProps.unit} as `title - unit`. */
  title?: string;
  /** Unit appended to {@link ColumnChartProps.title} (e.g. `"kg"`). Has no effect without a title. */
  unit?: string;
  /** Whether the series/reference-line legend is rendered. Defaults to `false`. */
  withLegend?: boolean;
  /** Whether the x-axis baseline is rendered. Defaults to `true`. */
  withAxis?: boolean;
  /** Whether category labels are rendered along the x-axis. Defaults to `false`. */
  withLabel?: boolean;
  /**
   * Draws a flat reference line at the median or average of all datasets'
   * combined values. Omitted by default.
   */
  referenceLine?: ChartReferenceLine;
  /** SVG viewport width in pixels. Defaults to `480`. */
  width?: number;
  /** SVG viewport height in pixels. Defaults to `160`. */
  height?: number;
  className?: string;
}

const GROUP_GAP = 12;
const BAR_GAP = 2;

/**
 * Column chart plotting up to three datasets as grouped vertical columns,
 * each series distinguished by fill (solid, diagonal stripes, empty
 * outline) rather than color so series stay readable on e-ink displays.
 *
 * @example
 * ```tsx
 * <ColumnChart
 *   title="Rainfall"
 *   unit="mm"
 *   categories={["Jan", "Feb", "Mar"]}
 *   datasets={[{ label: "2026", data: [40, 52, 61] }]}
 * />
 * ```
 */
export function ColumnChart({
  datasets,
  categories,
  title,
  unit,
  withLegend = false,
  withAxis = true,
  withLabel = false,
  referenceLine,
  width = 480,
  height = 160,
  className,
}: ColumnChartProps) {
  const patternId = useId();
  const usedDatasets = datasets.slice(0, 3);
  const allValues = usedDatasets.flatMap((dataset) => dataset.data);
  const maxValue = allValues.length > 0 ? Math.max(...allValues, 0) : 0;
  const groupCount = Math.max(1, ...usedDatasets.map((dataset) => dataset.data.length));

  const bottomPadding = withAxis && withLabel && categories ? 32 : 16;
  const padding = { top: 16, right: 16, bottom: bottomPadding, left: 16 };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  const groupWidth = (innerWidth - GROUP_GAP * (groupCount - 1)) / groupCount;
  const barWidth =
    (groupWidth - BAR_GAP * (usedDatasets.length - 1)) / Math.max(1, usedDatasets.length);

  const yFor = (value: number) => (maxValue === 0 ? 0 : (value / maxValue) * innerHeight);
  const baselineY = height - padding.bottom;

  const referenceValue = referenceLine
    ? calculateReferenceValue(usedDatasets, referenceLine)
    : undefined;

  return (
    <div className={cx("eink-column-chart", [className ?? "", !!className])}>
      {title && (
        <p className="eink-column-chart__title">
          {title}
          {unit ? ` - ${unit}` : ""}
        </p>
      )}
      <svg
        className="eink-column-chart__svg"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={title ?? "Column chart"}
      >
        <defs>
          <pattern
            id={patternId}
            width="4"
            height="4"
            patternTransform="rotate(45)"
            patternUnits="userSpaceOnUse"
          >
            <line x1="0" y1="0" x2="0" y2="4" stroke="currentColor" strokeWidth="2" />
          </pattern>
        </defs>
        {withAxis && (
          <line
            className="eink-column-chart__axis"
            x1={padding.left}
            y1={baselineY}
            x2={width - padding.right}
            y2={baselineY}
          />
        )}
        {referenceValue !== undefined && (
          <line
            className="eink-column-chart__reference"
            x1={padding.left}
            x2={width - padding.right}
            y1={baselineY - yFor(referenceValue)}
            y2={baselineY - yFor(referenceValue)}
          />
        )}
        {Array.from({ length: groupCount }).map((_, groupIndex) => {
          const groupX = padding.left + groupIndex * (groupWidth + GROUP_GAP);
          return (
            <g key={categories?.[groupIndex] ?? groupIndex}>
              {usedDatasets.map((dataset, datasetIndex) => {
                const value = dataset.data[groupIndex] ?? 0;
                const barX = groupX + datasetIndex * (barWidth + BAR_GAP);
                const barHeight = Math.max(yFor(value), 0);
                const style: FillStyle = FILL_STYLES[datasetIndex];
                return (
                  <rect
                    key={dataset.label}
                    className={`eink-column-chart__bar eink-column-chart__bar--${style}`}
                    x={barX}
                    y={baselineY - barHeight}
                    width={Math.max(barWidth, 0)}
                    height={barHeight}
                    fill={style === "striped" ? `url(#${patternId})` : undefined}
                  />
                );
              })}
              {withAxis && withLabel && categories?.[groupIndex] && (
                <text
                  className="eink-column-chart__category-label"
                  x={groupX + groupWidth / 2}
                  y={baselineY + 16}
                  textAnchor="middle"
                >
                  {categories[groupIndex]}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {withLegend && (usedDatasets.length > 0 || referenceValue !== undefined) && (
        <ul className="eink-column-chart__legend">
          {usedDatasets.map((dataset, index) => (
            <li className="eink-column-chart__legend-item" key={dataset.label}>
              <span
                className={`eink-column-chart__legend-swatch eink-column-chart__legend-swatch--${FILL_STYLES[index]}`}
              />
              {dataset.label}
            </li>
          ))}
          {referenceValue !== undefined && (
            <li className="eink-column-chart__legend-item">
              <span className="eink-column-chart__legend-swatch eink-column-chart__legend-swatch--reference" />
              {referenceLine === "median" ? "Median" : "Average"}
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
