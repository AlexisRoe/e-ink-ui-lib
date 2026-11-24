import { describe, expect, it } from "vitest";
import { move, scramble, shuffle } from "./array.utils";

describe("move", () => {
  it("moves an element forward and backward", () => {
    expect(move(["a", "b", "c"], 0, 1)).toEqual(["b", "a", "c"]);
    expect(move(["a", "b", "c"], 2, -1)).toEqual(["a", "c", "b"]);
  });

  it("returns an unchanged copy when out of range", () => {
    const items = ["a", "b"];
    const result = move(items, 0, -1);
    expect(result).toEqual(["a", "b"]);
    expect(result).not.toBe(items);
    expect(move(items, 1, 1)).toEqual(["a", "b"]);
    expect(move(items, 5, -1)).toEqual(["a", "b"]);
  });

  it("does not mutate the input", () => {
    const items = ["a", "b", "c"];
    move(items, 0, 2);
    expect(items).toEqual(["a", "b", "c"]);
  });
});

describe("shuffle", () => {
  it("keeps all elements and does not mutate the input", () => {
    const items = [1, 2, 3, 4, 5];
    const result = shuffle(items);
    expect([...result].sort()).toEqual(items);
    expect(items).toEqual([1, 2, 3, 4, 5]);
  });

  it("is reproducible with a seeded rng", () => {
    const rng = () => 0;
    expect(shuffle([1, 2, 3], rng)).toEqual([2, 3, 1]);
  });
});

describe("scramble", () => {
  it("is deterministic and differs from the input for two or more items", () => {
    expect(scramble(["a", "b", "c", "d"])).toEqual(["d", "b", "a", "c"]);
    expect(scramble(["a", "b"])).toEqual(["b", "a"]);
  });

  it("returns a copy for fewer than two items", () => {
    expect(scramble([])).toEqual([]);
    expect(scramble(["a"])).toEqual(["a"]);
  });
});
