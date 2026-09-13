import { useId } from "react";
import type { ChartDataset, ChartReferenceLine } from "../../utils/chart.utils";
import { calculateReferenceValue } from "../../utils/chart.utils";
import { cx } from "../../utils/cx.utils";

import "./bar-chart.component.css";

const FILL_STYLES = ["solid", "striped", "empty"] as const;
type FillStyle = (typeof FILL_STYLES)[number];

/** Props accepted by {@link BarChart}. */
export interface BarChartProps {
  /**
   * Up to three series to plot as grouped horizontal bars. Series are
   * filled in order as solid black, diagonal black stripes, then empty
   * (outline only); datasets beyond the third are ignored.
   */
  datasets: ChartDataset[];
  /** Labels shown beside each group of bars. */
  categories?: string[];
  /** Heading rendered above the chart, combined with {@link BarChartProps.unit} as `title - unit`. */
  title?: string;
  /** Unit appended to {@link BarChartProps.title} (e.g. `"kg"`). Has no effect without a title. */
  unit?: string;
  /** Whether the series/reference-line legend is rendered. Defaults to `false`. */
  withLegend?: boolean;
  /** Whether the y-axis baseline is rendered. Defaults to `true`. */
  withAxis?: boolean;
  /** Whether category labels are rendered beside the y-axis. Defaults to `false`. */
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
 * Bar chart plotting up to three datasets as grouped horizontal bars, each
 * series distinguished by fill (solid, diagonal stripes, empty outline)
 * rather than color so series stay readable on e-ink displays.
 *
 * @example
 * ```tsx
 * <BarChart
 *   title="Throughput"
 *   unit="units/h"
 *   categories={["Line 1", "Line 2"]}
 *   datasets={[{ label: "Shift A", data: [120, 98] }]}
 * />
 * ```
 */
export function BarChart({
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
}: BarChartProps) {
  const patternId = useId();
  const usedDatasets = datasets.slice(0, 3);
  const allValues = usedDatasets.flatMap((dataset) => dataset.data);
  const maxValue = allValues.length > 0 ? Math.max(...allValues, 0) : 0;
  const groupCount = Math.max(1, ...usedDatasets.map((dataset) => dataset.data.length));

  const leftPadding = withAxis && withLabel && categories ? 72 : 16;
  const padding = { top: 16, right: 16, bottom: 16, left: leftPadding };
  const innerWidth = width - padding.left - padding.right;
  const innerHeight = height - padding.top - padding.bottom;
  const groupHeight = (innerHeight - GROUP_GAP * (groupCount - 1)) / groupCount;
  const barHeight =
    (groupHeight - BAR_GAP * (usedDatasets.length - 1)) / Math.max(1, usedDatasets.length);

  const xFor = (value: number) => (maxValue === 0 ? 0 : (value / maxValue) * innerWidth);

  const referenceValue = referenceLine
    ? calculateReferenceValue(usedDatasets, referenceLine)
    : undefined;

  return (
    <div className={cx("eink-bar-chart", [className ?? "", !!className])}>
      {title && (
        <p className="eink-bar-chart__title">
          {title}
          {unit ? ` - ${unit}` : ""}
        </p>
      )}
      <svg
        className="eink-bar-chart__svg"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={title ?? "Bar chart"}
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
            className="eink-bar-chart__axis"
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={height - padding.bottom}
          />
        )}
        {referenceValue !== undefined && (
          <line
            className="eink-bar-chart__reference"
            x1={padding.left + xFor(referenceValue)}
            x2={padding.left + xFor(referenceValue)}
            y1={padding.top}
            y2={height - padding.bottom}
          />
        )}
        {Array.from({ length: groupCount }).map((_, groupIndex) => {
          const groupY = padding.top + groupIndex * (groupHeight + GROUP_GAP);
          return (
            <g key={categories?.[groupIndex] ?? groupIndex}>
              {usedDatasets.map((dataset, datasetIndex) => {
                const value = dataset.data[groupIndex] ?? 0;
                const barY = groupY + datasetIndex * (barHeight + BAR_GAP);
                const style: FillStyle = FILL_STYLES[datasetIndex];
                return (
                  <rect
                    key={dataset.label}
                    className={`eink-bar-chart__bar eink-bar-chart__bar--${style}`}
                    x={padding.left}
                    y={barY}
                    width={Math.max(xFor(value), 0)}
                    height={Math.max(barHeight, 0)}
                    fill={style === "striped" ? `url(#${patternId})` : undefined}
                  />
                );
              })}
              {withAxis && withLabel && categories?.[groupIndex] && (
                <text
                  className="eink-bar-chart__category-label"
                  x={padding.left - 8}
                  y={groupY + groupHeight / 2}
                  textAnchor="end"
                  dominantBaseline="middle"
                >
                  {categories[groupIndex]}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      {withLegend && (usedDatasets.length > 0 || referenceValue !== undefined) && (
        <ul className="eink-bar-chart__legend">
          {usedDatasets.map((dataset, index) => (
            <li className="eink-bar-chart__legend-item" key={dataset.label}>
              <span
                className={`eink-bar-chart__legend-swatch eink-bar-chart__legend-swatch--${FILL_STYLES[index]}`}
              />
              {dataset.label}
            </li>
          ))}
          {referenceValue !== undefined && (
            <li className="eink-bar-chart__legend-item">
              <span className="eink-bar-chart__legend-swatch eink-bar-chart__legend-swatch--reference" />
              {referenceLine === "median" ? "Median" : "Average"}
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
