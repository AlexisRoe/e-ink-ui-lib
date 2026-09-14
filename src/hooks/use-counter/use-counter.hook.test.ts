import { act, renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useCounter } from "./use-counter.hook";

describe("useCounter", () => {
  it("starts at 0 by default", () => {
    const { result } = renderHook(() => useCounter());
    expect(result.current[0]).toBe(0);
  });

  it("starts at the given starting value", () => {
    const { result } = renderHook(() => useCounter(5));
    expect(result.current[0]).toBe(5);
  });

  it("increments and decrements", () => {
    const { result } = renderHook(() => useCounter(5));

    act(() => result.current[1].increment());
    expect(result.current[0]).toBe(6);

    act(() => result.current[1].decrement());
    expect(result.current[0]).toBe(5);
  });

  it("clamps increment to max", () => {
    const { result } = renderHook(() => useCounter(5, { max: 5 }));
    act(() => result.current[1].increment());
    expect(result.current[0]).toBe(5);
  });

  it("clamps decrement to min", () => {
    const { result } = renderHook(() => useCounter(0, { min: 0 }));
    act(() => result.current[1].decrement());
    expect(result.current[0]).toBe(0);
  });

  it("sets to a valid value within bounds", () => {
    const { result } = renderHook(() => useCounter(0, { min: 0, max: 10 }));
    act(() => result.current[1].set(7));
    expect(result.current[0]).toBe(7);
  });

  it("ignores set outside of bounds", () => {
    const { result } = renderHook(() => useCounter(0, { min: 0, max: 10 }));
    act(() => result.current[1].set(20));
    expect(result.current[0]).toBe(0);
  });

  it("resets to the starting value", () => {
    const { result } = renderHook(() => useCounter(3));
    act(() => result.current[1].increment());
    act(() => result.current[1].reset());
    expect(result.current[0]).toBe(3);
  });

  it("throws when starting value is below min", () => {
    expect(() => renderHook(() => useCounter(-1, { min: 0 }))).toThrow(
      "Your starting value of -1 is less than your min of 0.",
    );
  });

  it("throws when starting value is above max", () => {
    expect(() => renderHook(() => useCounter(11, { max: 10 }))).toThrow(
      "Your starting value of 11 is greater than your max of 10.",
    );
  });
});
