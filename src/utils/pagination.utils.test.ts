import { describe, expect, it } from "vitest";
import { getPaginationRange } from "./pagination.utils";

describe("getPaginationRange", () => {
  it("returns an empty array for zero pages", () => {
    expect(getPaginationRange(1, 0)).toEqual([]);
  });

  it("returns every page when they all fit without ellipsis", () => {
    expect(getPaginationRange(3, 5)).toEqual([1, 2, 3, 4, 5]);
  });

  it("shows a right ellipsis when the current page is near the start", () => {
    expect(getPaginationRange(1, 20)).toEqual([1, 2, 3, 4, 5, "ellipsis", 20]);
  });

  it("shows a left ellipsis when the current page is near the end", () => {
    expect(getPaginationRange(20, 20)).toEqual([1, "ellipsis", 16, 17, 18, 19, 20]);
  });

  it("shows both ellipses when the current page is in the middle", () => {
    expect(getPaginationRange(10, 20)).toEqual([1, "ellipsis", 9, 10, 11, "ellipsis", 20]);
  });

  it("respects a custom sibling count", () => {
    expect(getPaginationRange(10, 20, 2)).toEqual([
      1,
      "ellipsis",
      8,
      9,
      10,
      11,
      12,
      "ellipsis",
      20,
    ]);
  });

  it("always includes the first and last page", () => {
    const result = getPaginationRange(50, 100);
    expect(result[0]).toBe(1);
    expect(result[result.length - 1]).toBe(100);
  });
});
