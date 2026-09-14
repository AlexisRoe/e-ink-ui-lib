import { describe, expect, it } from "vitest";
import { shallowEqual } from "./shallow-equal.utils";

describe("shallowEqual", () => {
  it("returns true for the same reference", () => {
    const a = { name: "Ada" };
    expect(shallowEqual(a, a)).toBe(true);
  });

  it("returns true for equal top-level values", () => {
    expect(shallowEqual({ name: "Ada", age: 30 }, { name: "Ada", age: 30 })).toBe(true);
  });

  it("returns false when a value differs", () => {
    expect(shallowEqual({ name: "Ada" }, { name: "Grace" })).toBe(false);
  });

  it("returns false when key counts differ", () => {
    expect(shallowEqual({ name: "Ada" }, { name: "Ada", age: 30 })).toBe(false);
  });

  it("does not compare nested objects deeply", () => {
    const nested = { address: { city: "Berlin" } };
    expect(shallowEqual({ address: { city: "Berlin" } }, nested)).toBe(false);
    expect(shallowEqual(nested, nested)).toBe(true);
  });
});
