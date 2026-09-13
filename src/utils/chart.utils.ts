/** Single named series of numeric values plotted by a chart. */
export interface ChartDataset {
  /** Name shown in the chart legend. */
  label: string;
  /** Numeric values, one per category/point. */
  data: number[];
}

/** Which aggregate a chart's optional reference line represents. */
export type ChartReferenceLine = "median" | "average";

/** Arithmetic mean of `values`, or `0` for an empty array. */
export function calculateAverage(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

/** Statistical median of `values`, or `0` for an empty array. */
export function calculateMedian(values: number[]): number {
  if (values.length === 0) {
    return 0;
  }
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[middle - 1] + sorted[middle]) / 2 : sorted[middle];
}

/**
 * Resolves a {@link ChartReferenceLine} kind to its value across every
 * dataset's combined data.
 */
export function calculateReferenceValue(
  datasets: ChartDataset[],
  type: ChartReferenceLine,
): number {
  const values = datasets.flatMap((dataset) => dataset.data);
  return type === "median" ? calculateMedian(values) : calculateAverage(values);
}
