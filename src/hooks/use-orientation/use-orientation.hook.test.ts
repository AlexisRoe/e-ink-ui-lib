import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useOrientation } from "./use-orientation.hook";

describe("useOrientation", () => {
  let listeners: Record<string, EventListener>;

  beforeEach(() => {
    listeners = {};

    Object.defineProperty(window.screen, "orientation", {
      value: {
        angle: 0,
        type: "landscape-primary",
        addEventListener: (event: string, cb: EventListener) => {
          listeners[event] = cb;
        },
        removeEventListener: vi.fn(),
      },
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns the current orientation from screen.orientation", () => {
    const { result } = renderHook(() => useOrientation());
    expect(result.current).toEqual({ angle: 0, type: "landscape-primary" });
  });

  it("updates when the orientation change event fires", () => {
    const { result } = renderHook(() => useOrientation());

    act(() => {
      Object.defineProperty(window.screen, "orientation", {
        value: { ...window.screen.orientation, angle: 90, type: "portrait-primary" },
        configurable: true,
      });
      listeners.change(new Event("change"));
    });

    expect(result.current).toEqual({ angle: 90, type: "portrait-primary" });
  });
});
