import type { ChartDataset, ChartReferenceLine } from "../../utils/chart.utils";
import { calculateReferenceValue } from "../../utils/chart.utils";
import { cx } from "../../utils/cx.utils";

import "./line-chart.component.css";

const LINE_STYLES = ["solid", "dashed", "dotted"] as const;
type LineStyle = (typeof LINE_STYLES)[number];

const LINE_DASH_ARRAYS: Record<LineStyle, string | undefined> = {
  solid: undefined,
  dashed: "10 6",
  dotted: "0.1 8",
};

/** Props accepted by {@link LineChart}. */
export interface LineChartProps {
  /**
   * Up to three series to plot. Series are drawn in order as a solid,
   * dashed, then dotted 2px black line; datasets beyond the third are
   * ignored.
   */
  datasets: ChartDataset[];
  /** Labels shown beneath each data point on the x-axis. */
  categories?: string[];
  /** Heading rendered above the chart, combined with {@link LineChartProps.unit} as `title - unit`. */
  title?: string;
  /** Unit appended to {@link LineChartProps.title} (e.g. `"°C"`). Has no effect without a title. */
  unit?: string;
  /** Whether the series/reference-line legend is rendered. Defaults to `true`. */
  withLegend?: boolean;
  /** Whether the x-axis baseline is rendered. Defaults to `true`. */
  withAxis?: boolean;
  /** Whether category labels are rendered along the x-axis. Defaults to `true`. */
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

const PADDING = { top: 16, right: 16, bottom: 28, left: 16 };

/**
 * Line chart plotting up to three datasets as 2px black lines, distinguished
 * by stroke style (solid, dashed, dotted) rather than color so series stay
 * readable on e-ink displays.
 *
 * @example
 * ```tsx
 * <LineChart
 *   title="Battery"
 *   unit="%"
 *   referenceLine="average"
 *   categories={["Mon", "Tue", "Wed"]}
 *   datasets={[{ label: "Device A", data: [82, 76, 70] }]}
 * />
 * ```
 */
export function LineChart({
  datasets,
  categories,
  title,
  unit,
  withLegend = true,
  withAxis = true,
  withLabel = true,
  referenceLine,
  width = 480,
  height = 160,
  className,
}: LineChartProps) {
  const usedDatasets = datasets.slice(0, 3);
  const allValues = usedDatasets.flatMap((dataset) => dataset.data);
  const maxValue = allValues.length > 0 ? Math.max(...allValues) : 0;
  const minValue = allValues.length > 0 ? Math.min(...allValues) : 0;
  const range = maxValue - minValue || 1;

  const pointCount = Math.max(1, ...usedDatasets.map((dataset) => dataset.data.length));
  const innerWidth = width - PADDING.left - PADDING.right;
  const innerHeight = height - PADDING.top - PADDING.bottom;

  const xFor = (index: number) =>
    PADDING.left + (pointCount === 1 ? innerWidth / 2 : (index / (pointCount - 1)) * innerWidth);
  const yFor = (value: number) =>
    PADDING.top + innerHeight - ((value - minValue) / range) * innerHeight;

  const referenceValue = referenceLine
    ? calculateReferenceValue(usedDatasets, referenceLine)
    : undefined;

  return (
    <div className={cx("eink-line-chart", [className ?? "", !!className])}>
      {title && (
        <p className="eink-line-chart__title">
          {title}
          {unit ? ` - ${unit}` : ""}
        </p>
      )}
      <svg
        className="eink-line-chart__svg"
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label={title ?? "Line chart"}
      >
        {withAxis && (
          <line
            className="eink-line-chart__axis"
            x1={PADDING.left}
            y1={PADDING.top + innerHeight}
            x2={width - PADDING.right}
            y2={PADDING.top + innerHeight}
          />
        )}
        {referenceValue !== undefined && (
          <line
            className="eink-line-chart__reference"
            x1={PADDING.left}
            x2={width - PADDING.right}
            y1={yFor(referenceValue)}
            y2={yFor(referenceValue)}
          />
        )}
        {usedDatasets.map((dataset, datasetIndex) => {
          const style = LINE_STYLES[datasetIndex];
          const points = dataset.data
            .map((value, index) => `${xFor(index)},${yFor(value)}`)
            .join(" ");
          return (
            <polyline
              key={dataset.label}
              className={`eink-line-chart__line eink-line-chart__line--${style}`}
              points={points}
              strokeDasharray={LINE_DASH_ARRAYS[style]}
            />
          );
        })}
        {withAxis && withLabel && categories && (
          <g className="eink-line-chart__categories">
            {categories.map((category, index) => (
              <text
                key={category}
                x={xFor(index)}
                y={height - 8}
                className="eink-line-chart__category-label"
                textAnchor="middle"
              >
                {category}
              </text>
            ))}
          </g>
        )}
      </svg>
      {withLegend && (usedDatasets.length > 0 || referenceValue !== undefined) && (
        <ul className="eink-line-chart__legend">
          {usedDatasets.map((dataset, index) => (
            <li className="eink-line-chart__legend-item" key={dataset.label}>
              <span
                className={`eink-line-chart__legend-swatch eink-line-chart__legend-swatch--${LINE_STYLES[index]}`}
              />
              {dataset.label}
            </li>
          ))}
          {referenceValue !== undefined && (
            <li className="eink-line-chart__legend-item">
              <span className="eink-line-chart__legend-swatch eink-line-chart__legend-swatch--reference" />
              {referenceLine === "median" ? "Median" : "Average"}
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
