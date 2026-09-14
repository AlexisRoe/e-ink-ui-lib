import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useNetworkState } from "./use-network-state.hook";

describe("useNetworkState", () => {
  beforeEach(() => {
    Object.defineProperty(navigator, "onLine", { value: true, configurable: true, writable: true });
    Object.defineProperty(navigator, "connection", {
      value: {
        downlink: 10,
        downlinkMax: 20,
        effectiveType: "4g",
        rtt: 50,
        saveData: false,
        type: "wifi",
        addEventListener: () => {},
        removeEventListener: () => {},
      },
      configurable: true,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns the current online status and connection details", () => {
    const { result } = renderHook(() => useNetworkState());
    expect(result.current.online).toBe(true);
    expect(result.current.downlink).toBe(10);
    expect(result.current.effectiveType).toBe("4g");
    expect(result.current.type).toBe("wifi");
  });

  it("updates when the browser goes offline", () => {
    const { result } = renderHook(() => useNetworkState());

    act(() => {
      Object.defineProperty(navigator, "onLine", { value: false, configurable: true });
      window.dispatchEvent(new Event("offline"));
    });

    expect(result.current.online).toBe(false);
  });

  it("falls back to null fields when there is no connection API", () => {
    Object.defineProperty(navigator, "connection", { value: undefined, configurable: true });

    const { result } = renderHook(() => useNetworkState());

    expect(result.current.downlink).toBeNull();
    expect(result.current.effectiveType).toBeNull();
  });
});
