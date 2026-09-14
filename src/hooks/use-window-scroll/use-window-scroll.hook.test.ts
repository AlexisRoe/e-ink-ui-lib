import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useWindowScroll } from "./use-window-scroll.hook";

describe("useWindowScroll", () => {
  let scrollToMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    scrollToMock = vi.fn();
    vi.stubGlobal("scrollTo", scrollToMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("reports the current scroll position on mount", () => {
    Object.defineProperty(window, "scrollX", { value: 10, configurable: true });
    Object.defineProperty(window, "scrollY", { value: 20, configurable: true });

    const { result } = renderHook(() => useWindowScroll());
    expect(result.current[0]).toEqual({ x: 10, y: 20 });
  });

  it("calls window.scrollTo with an options object", () => {
    const { result } = renderHook(() => useWindowScroll());

    act(() => {
      result.current[1]({ top: 0, behavior: "smooth" });
    });

    expect(scrollToMock).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("calls window.scrollTo with x and y coordinates", () => {
    const { result } = renderHook(() => useWindowScroll());

    act(() => {
      result.current[1](5, 15);
    });

    expect(scrollToMock).toHaveBeenCalledWith(5, 15);
  });

  it("throws when passed invalid arguments", () => {
    const { result } = renderHook(() => useWindowScroll());
    expect(() => result.current[1](5)).toThrow("Invalid arguments passed to scrollTo.");
  });

  it("updates the position on scroll events", () => {
    const { result } = renderHook(() => useWindowScroll());

    Object.defineProperty(window, "scrollX", { value: 30, configurable: true });
    Object.defineProperty(window, "scrollY", { value: 40, configurable: true });

    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    expect(result.current[0]).toEqual({ x: 30, y: 40 });
  });
});
