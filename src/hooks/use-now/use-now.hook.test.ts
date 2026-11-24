import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useNow } from "./use-now.hook";

describe("useNow", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(1000);
  });
  afterEach(() => vi.useRealTimers());

  it("returns the current time and refreshes it on every interval", () => {
    const { result } = renderHook(() => useNow(500));
    expect(result.current).toBe(1000);
    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(result.current).toBe(1500);
  });

  it("stops updating when the interval is null", () => {
    const { result } = renderHook(() => useNow(null));
    act(() => {
      vi.advanceTimersByTime(5000);
    });
    expect(result.current).toBe(1000);
  });
});
