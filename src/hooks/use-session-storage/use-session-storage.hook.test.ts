import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useSessionStorage } from "./use-session-storage.hook";

describe("useSessionStorage", () => {
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  afterEach(() => {
    window.sessionStorage.clear();
  });

  it("returns the initial value when nothing is stored", () => {
    const { result } = renderHook(() => useSessionStorage("key", "initial"));
    expect(result.current[0]).toBe("initial");
  });

  it("seeds sessionStorage with the initial value", () => {
    renderHook(() => useSessionStorage("key", "initial"));
    expect(window.sessionStorage.getItem("key")).toBe(JSON.stringify("initial"));
  });

  it("reads an existing value from sessionStorage", () => {
    window.sessionStorage.setItem("key", JSON.stringify("existing"));
    const { result } = renderHook(() => useSessionStorage("key", "initial"));
    expect(result.current[0]).toBe("existing");
  });

  it("updates the stored value", () => {
    const { result } = renderHook(() => useSessionStorage("key", "initial"));

    act(() => result.current[1]("updated"));

    expect(result.current[0]).toBe("updated");
    expect(window.sessionStorage.getItem("key")).toBe(JSON.stringify("updated"));
  });

  it("supports updater functions", () => {
    const { result } = renderHook(() => useSessionStorage<number>("count", 1));

    act(() => result.current[1]((prev) => prev + 1));

    expect(result.current[0]).toBe(2);
  });

  it("removes the item when set to undefined", () => {
    const { result } = renderHook(() => useSessionStorage<string | undefined>("key", "initial"));

    act(() => result.current[1](undefined));

    expect(window.sessionStorage.getItem("key")).toBeNull();
  });

  it("stays in sync across hook instances via storage events", () => {
    const { result: a } = renderHook(() => useSessionStorage("shared", "initial"));
    const { result: b } = renderHook(() => useSessionStorage("shared", "initial"));

    act(() => a.current[1]("changed"));

    expect(b.current[0]).toBe("changed");
  });
});
