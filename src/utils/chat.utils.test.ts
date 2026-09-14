import { describe, expect, it } from "vitest";
import { formatChatTimestamp } from "./chat.utils";

describe("formatChatTimestamp", () => {
  it("pads single-digit hours and minutes", () => {
    expect(formatChatTimestamp(new Date(2026, 0, 1, 9, 5))).toBe("09:05");
  });

  it("formats double-digit hours and minutes as-is", () => {
    expect(formatChatTimestamp(new Date(2026, 0, 1, 23, 41))).toBe("23:41");
  });

  it("formats midnight", () => {
    expect(formatChatTimestamp(new Date(2026, 0, 1, 0, 0))).toBe("00:00");
  });
});
