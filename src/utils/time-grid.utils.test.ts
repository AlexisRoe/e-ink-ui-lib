import { describe, expect, it } from "vitest";
import { assignLanes } from "./time-grid.utils";

describe("assignLanes", () => {
  it("gives non-overlapping intervals the full width", () => {
    const lanes = assignLanes([
      { id: "a", startMin: 0, durationMin: 30 },
      { id: "b", startMin: 30, durationMin: 30 },
    ]);
    expect(lanes.get("a")).toEqual({ lane: 0, lanes: 1 });
    expect(lanes.get("b")).toEqual({ lane: 0, lanes: 1 });
  });

  it("splits overlapping intervals into lanes", () => {
    const lanes = assignLanes([
      { id: "a", startMin: 0, durationMin: 60 },
      { id: "b", startMin: 10, durationMin: 20 },
      { id: "c", startMin: 40, durationMin: 10 },
    ]);
    expect(lanes.get("a")).toEqual({ lane: 0, lanes: 2 });
    expect(lanes.get("b")).toEqual({ lane: 1, lanes: 2 });
    expect(lanes.get("c")).toEqual({ lane: 1, lanes: 2 });
  });
});
