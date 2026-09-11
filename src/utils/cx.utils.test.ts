import { describe, expect, it } from "vitest";
import { cx } from "./cx.utils";

describe("cx", () => {
  it("returns only the base class when there are no conditions", () => {
    expect(cx("eink-button")).toBe("eink-button");
  });

  it("omits the base class when it is undefined", () => {
    expect(cx(undefined, ["eink-button--pressed", true])).toBe("eink-button--pressed");
  });

  it("appends a single conditional class when its condition is true", () => {
    expect(cx("eink-button", ["eink-button--pressed", true])).toBe(
      "eink-button eink-button--pressed",
    );
  });

  it("omits a conditional class when its condition is false", () => {
    expect(cx("eink-button", ["eink-button--pressed", false])).toBe("eink-button");
  });

  it("supports multiple conditional classes, keeping only the true ones", () => {
    expect(
      cx(
        "eink-button",
        ["eink-button--pressed", true],
        ["eink-button--disabled", false],
        ["eink-button--loading", true],
      ),
    ).toBe("eink-button eink-button--pressed eink-button--loading");
  });

  it("returns an empty string when nothing applies", () => {
    expect(cx(undefined, ["eink-button--pressed", false])).toBe("");
  });
});
