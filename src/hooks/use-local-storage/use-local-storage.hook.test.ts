import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useLocalStorage } from "./use-local-storage.hook";

describe("useLocalStorage", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it("returns the initial value when nothing is stored", () => {
    const { result } = renderHook(() => useLocalStorage("key", "initial"));
    expect(result.current[0]).toBe("initial");
  });

  it("seeds localStorage with the initial value", () => {
    renderHook(() => useLocalStorage("key", "initial"));
    expect(window.localStorage.getItem("key")).toBe(JSON.stringify("initial"));
  });

  it("reads an existing value from localStorage", () => {
    window.localStorage.setItem("key", JSON.stringify("existing"));
    const { result } = renderHook(() => useLocalStorage("key", "initial"));
    expect(result.current[0]).toBe("existing");
  });

  it("updates the stored value", () => {
    const { result } = renderHook(() => useLocalStorage("key", "initial"));

    act(() => result.current[1]("updated"));

    expect(result.current[0]).toBe("updated");
    expect(window.localStorage.getItem("key")).toBe(JSON.stringify("updated"));
  });

  it("supports updater functions", () => {
    const { result } = renderHook(() => useLocalStorage<number>("count", 1));

    act(() => result.current[1]((prev) => prev + 1));

    expect(result.current[0]).toBe(2);
  });

  it("removes the item when set to undefined", () => {
    const { result } = renderHook(() => useLocalStorage<string | undefined>("key", "initial"));

    act(() => result.current[1](undefined));

    expect(window.localStorage.getItem("key")).toBeNull();
  });

  it("stays in sync across hook instances via storage events", () => {
    const { result: a } = renderHook(() => useLocalStorage("shared", "initial"));
    const { result: b } = renderHook(() => useLocalStorage("shared", "initial"));

    act(() => a.current[1]("changed"));

    expect(b.current[0]).toBe("changed");
  });
});
