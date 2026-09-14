import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useHistoryState } from "./use-history-state.hook";

describe("useHistoryState", () => {
  it("starts with the initial present value", () => {
    const { result } = renderHook(() => useHistoryState("a"));
    expect(result.current.state).toBe("a");
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  it("sets a new present value", () => {
    const { result } = renderHook(() => useHistoryState("a"));
    act(() => result.current.set("b"));
    expect(result.current.state).toBe("b");
    expect(result.current.canUndo).toBe(true);
  });

  it("undoes to the previous value", () => {
    const { result } = renderHook(() => useHistoryState("a"));
    act(() => result.current.set("b"));
    act(() => result.current.undo());
    expect(result.current.state).toBe("a");
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(true);
  });

  it("redoes after an undo", () => {
    const { result } = renderHook(() => useHistoryState("a"));
    act(() => result.current.set("b"));
    act(() => result.current.undo());
    act(() => result.current.redo());
    expect(result.current.state).toBe("b");
    expect(result.current.canRedo).toBe(false);
  });

  it("clears history back to the initial present", () => {
    const { result } = renderHook(() => useHistoryState("a"));
    act(() => result.current.set("b"));
    act(() => result.current.set("c"));
    act(() => result.current.clear());
    expect(result.current.state).toBe("a");
    expect(result.current.canUndo).toBe(false);
    expect(result.current.canRedo).toBe(false);
  });

  it("does not push history when setting the same value", () => {
    const { result } = renderHook(() => useHistoryState("a"));
    act(() => result.current.set("a"));
    expect(result.current.canUndo).toBe(false);
  });

  it("does nothing when undo/redo called with nothing to undo/redo", () => {
    const { result } = renderHook(() => useHistoryState("a"));
    act(() => result.current.undo());
    expect(result.current.state).toBe("a");
    act(() => result.current.redo());
    expect(result.current.state).toBe("a");
  });
});
