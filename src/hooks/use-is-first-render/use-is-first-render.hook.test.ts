import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useIsFirstRender } from "./use-is-first-render.hook";

describe("useIsFirstRender", () => {
  it("returns true on the first render", () => {
    const { result } = renderHook(() => useIsFirstRender());
    expect(result.current).toBe(true);
  });

  it("returns false on subsequent renders", () => {
    const { result, rerender } = renderHook(() => useIsFirstRender());
    rerender();
    expect(result.current).toBe(false);
    rerender();
    expect(result.current).toBe(false);
  });
});
