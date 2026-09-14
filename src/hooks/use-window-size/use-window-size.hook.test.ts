import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useWindowSize } from "./use-window-size.hook";

describe("useWindowSize", () => {
  it("reports the current window dimensions on mount", () => {
    Object.defineProperty(window, "innerWidth", { value: 800, configurable: true });
    Object.defineProperty(window, "innerHeight", { value: 600, configurable: true });

    const { result } = renderHook(() => useWindowSize());
    expect(result.current).toEqual({ width: 800, height: 600 });
  });

  it("updates the dimensions on resize events", () => {
    const { result } = renderHook(() => useWindowSize());

    Object.defineProperty(window, "innerWidth", { value: 1024, configurable: true });
    Object.defineProperty(window, "innerHeight", { value: 768, configurable: true });

    act(() => {
      window.dispatchEvent(new Event("resize"));
    });

    expect(result.current).toEqual({ width: 1024, height: 768 });
  });
});
