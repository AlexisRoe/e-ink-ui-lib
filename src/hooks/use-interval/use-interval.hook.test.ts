import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useInterval } from "./use-interval.hook";

describe("useInterval", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("invokes the callback repeatedly at the given delay", () => {
    const callback = vi.fn();
    renderHook(() => useInterval(callback, 1000));

    vi.advanceTimersByTime(3000);

    expect(callback).toHaveBeenCalledTimes(3);
  });

  it("does not schedule anything when delay is null", () => {
    const callback = vi.fn();
    renderHook(() => useInterval(callback, null));

    vi.advanceTimersByTime(5000);

    expect(callback).not.toHaveBeenCalled();
  });

  it("always calls the latest callback", () => {
    const firstCallback = vi.fn();
    const secondCallback = vi.fn();

    const { rerender } = renderHook(({ callback }) => useInterval(callback, 1000), {
      initialProps: { callback: firstCallback },
    });

    rerender({ callback: secondCallback });

    vi.advanceTimersByTime(1000);

    expect(firstCallback).not.toHaveBeenCalled();
    expect(secondCallback).toHaveBeenCalledTimes(1);
  });

  it("clears the interval on unmount", () => {
    const callback = vi.fn();
    const { unmount } = renderHook(() => useInterval(callback, 1000));

    unmount();
    vi.advanceTimersByTime(3000);

    expect(callback).not.toHaveBeenCalled();
  });
});
