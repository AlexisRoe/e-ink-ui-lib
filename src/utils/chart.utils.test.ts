import { describe, expect, it } from "vitest";
import { calculateAverage, calculateMedian, calculateReferenceValue } from "./chart.utils";

describe("calculateAverage", () => {
  it("returns the arithmetic mean", () => {
    expect(calculateAverage([1, 2, 3, 4])).toBe(2.5);
  });

  it("returns 0 for an empty array", () => {
    expect(calculateAverage([])).toBe(0);
  });
});

describe("calculateMedian", () => {
  it("returns the middle value for an odd-length array", () => {
    expect(calculateMedian([3, 1, 2])).toBe(2);
  });

  it("averages the two middle values for an even-length array", () => {
    expect(calculateMedian([1, 2, 3, 4])).toBe(2.5);
  });

  it("does not mutate the input array", () => {
    const values = [3, 1, 2];
    calculateMedian(values);
    expect(values).toEqual([3, 1, 2]);
  });

  it("returns 0 for an empty array", () => {
    expect(calculateMedian([])).toBe(0);
  });
});

describe("calculateReferenceValue", () => {
  const datasets = [
    { label: "A", data: [1, 2, 3] },
    { label: "B", data: [4, 5, 6] },
  ];

  it("computes the average across all datasets", () => {
    expect(calculateReferenceValue(datasets, "average")).toBe(3.5);
  });

  it("computes the median across all datasets", () => {
    expect(calculateReferenceValue(datasets, "median")).toBe(3.5);
  });
});
