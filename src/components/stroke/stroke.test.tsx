import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Stroke } from "./stroke.component";

describe("Stroke", () => {
  it("renders the children inside a <span> element", () => {
    const { getByText } = render(<Stroke>no longer available</Stroke>);
    const el = getByText("no longer available");
    expect(el.tagName).toBe("SPAN");
  });

  it("applies the stroke class", () => {
    const { getByText } = render(<Stroke>no longer available</Stroke>);
    expect(getByText("no longer available")).toHaveClass("eink-stroke");
  });

  it("merges a custom className", () => {
    const { getByText } = render(<Stroke className="custom">no longer available</Stroke>);
    expect(getByText("no longer available")).toHaveClass("custom");
  });
});
