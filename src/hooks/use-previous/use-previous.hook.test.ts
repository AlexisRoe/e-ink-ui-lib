import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { usePrevious } from "./use-previous.hook";

describe("usePrevious", () => {
  it("returns null before the value has changed", () => {
    const { result } = renderHook(() => usePrevious(1));
    expect(result.current).toBeNull();
  });

  it("returns the previous value after an update", () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 1 },
    });

    rerender({ value: 2 });
    expect(result.current).toBe(1);

    rerender({ value: 3 });
    expect(result.current).toBe(2);
  });

  it("does not update when the value stays the same", () => {
    const { result, rerender } = renderHook(({ value }) => usePrevious(value), {
      initialProps: { value: 1 },
    });

    rerender({ value: 2 });
    rerender({ value: 2 });
    expect(result.current).toBe(1);
  });
});
