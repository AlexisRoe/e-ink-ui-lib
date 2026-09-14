import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useThrottle } from "./use-throttle.hook";

describe("useThrottle", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns the initial value immediately", () => {
    const { result } = renderHook(() => useThrottle("a", 200));
    expect(result.current).toBe("a");
  });

  it("does not update before the interval has elapsed", () => {
    const { result, rerender } = renderHook(({ value }) => useThrottle(value, 200), {
      initialProps: { value: "a" },
    });

    rerender({ value: "b" });
    act(() => vi.advanceTimersByTime(100));
    expect(result.current).toBe("a");
  });

  it("updates once the interval has elapsed", () => {
    const { result, rerender } = renderHook(({ value }) => useThrottle(value, 200), {
      initialProps: { value: "a" },
    });

    rerender({ value: "b" });
    act(() => vi.advanceTimersByTime(200));
    expect(result.current).toBe("b");
  });

  it("throttles rapid successive updates", () => {
    const { result, rerender } = renderHook(({ value }) => useThrottle(value, 200), {
      initialProps: { value: "a" },
    });

    rerender({ value: "b" });
    act(() => vi.advanceTimersByTime(200));
    expect(result.current).toBe("b");

    rerender({ value: "c" });
    act(() => vi.advanceTimersByTime(50));
    rerender({ value: "d" });
    expect(result.current).toBe("b");

    act(() => vi.advanceTimersByTime(200));
    expect(result.current).toBe("d");
  });
});
