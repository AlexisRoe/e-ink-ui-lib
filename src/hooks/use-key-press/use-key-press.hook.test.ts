import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useKeyPress } from "./use-key-press.hook";

describe("useKeyPress", () => {
  it("returns false initially", () => {
    const { result } = renderHook(() => useKeyPress("Escape"));
    expect(result.current).toBe(false);
  });

  it("returns true while the target key is held down", () => {
    const { result } = renderHook(() => useKeyPress("Escape"));

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });

    expect(result.current).toBe(true);
  });

  it("returns false again once the target key is released", () => {
    const { result } = renderHook(() => useKeyPress("Escape"));

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });
    act(() => {
      window.dispatchEvent(new KeyboardEvent("keyup", { key: "Escape" }));
    });

    expect(result.current).toBe(false);
  });

  it("ignores events for other keys", () => {
    const { result } = renderHook(() => useKeyPress("Escape"));

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter" }));
    });

    expect(result.current).toBe(false);
  });

  it("removes its listeners on unmount", () => {
    const { result, unmount } = renderHook(() => useKeyPress("Escape"));

    unmount();

    act(() => {
      window.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    });

    expect(result.current).toBe(false);
  });
});
