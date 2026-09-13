import { describe, expect, it } from "vitest";
import { formatLogTimestamp } from "./log.utils";

describe("formatLogTimestamp", () => {
  it("formats hours, minutes, seconds and milliseconds, zero-padded", () => {
    const date = new Date(2026, 0, 1, 11, 31, 44, 7);
    expect(formatLogTimestamp(date)).toBe("11:31:44:007");
  });

  it("pads single-digit hours, minutes and seconds", () => {
    const date = new Date(2026, 0, 1, 1, 2, 3, 4);
    expect(formatLogTimestamp(date)).toBe("01:02:03:004");
  });

  it("formats midnight correctly", () => {
    const date = new Date(2026, 0, 1, 0, 0, 0, 0);
    expect(formatLogTimestamp(date)).toBe("00:00:00:000");
  });
});
