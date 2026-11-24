import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { navigate, useHashRoute } from "./use-hash-route.hook";

describe("useHashRoute / navigate", () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
  });

  afterEach(() => {
    window.location.hash = "";
  });

  it("returns the hash without the leading #", () => {
    window.location.hash = "#/lessons/3";
    const { result } = renderHook(() => useHashRoute());
    expect(result.current).toBe("/lessons/3");
  });

  it("applies a custom parser", () => {
    window.location.hash = "#/lessons/3";
    const { result } = renderHook(() => useHashRoute((hash) => hash.split("/").length));
    expect(result.current).toBe(3);
  });

  it("re-renders on navigate, adding the # when missing", () => {
    const { result } = renderHook(() => useHashRoute());
    act(() => {
      navigate("/exam");
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    });
    expect(window.location.hash).toBe("#/exam");
    expect(result.current).toBe("/exam");
  });

  it("scrolls the scrolled ancestors of main to the top unless disabled", () => {
    const wrapper = document.createElement("div");
    const main = document.createElement("main");
    wrapper.append(main);
    document.body.append(wrapper);
    wrapper.scrollTop = 120;
    navigate("/a", { scrollToTop: false });
    expect(wrapper.scrollTop).toBe(120);
    navigate("/b");
    expect(wrapper.scrollTop).toBe(0);
    wrapper.remove();
  });
});
