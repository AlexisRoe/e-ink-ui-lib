import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { useVisibilityChange } from "./use-visibility-change.hook";

describe("useVisibilityChange", () => {
  afterEach(() => {
    Object.defineProperty(document, "visibilityState", { value: "visible", configurable: true });
  });

  it("returns true when the document is visible", () => {
    Object.defineProperty(document, "visibilityState", { value: "visible", configurable: true });
    const { result } = renderHook(() => useVisibilityChange());
    expect(result.current).toBe(true);
  });

  it("returns false when the document is hidden", () => {
    Object.defineProperty(document, "visibilityState", { value: "visible", configurable: true });
    const { result } = renderHook(() => useVisibilityChange());

    act(() => {
      Object.defineProperty(document, "visibilityState", { value: "hidden", configurable: true });
      document.dispatchEvent(new Event("visibilitychange"));
    });

    expect(result.current).toBe(false);
  });
});
