import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Highlight } from "./highlight.component";

describe("Highlight", () => {
  it("renders the children inside a <mark> element", () => {
    const { getByText } = render(<Highlight>important</Highlight>);
    const el = getByText("important");
    expect(el.tagName).toBe("MARK");
  });

  it("uses the background style by default", () => {
    const { getByText } = render(<Highlight>important</Highlight>);
    expect(getByText("important")).toHaveClass("eink-highlight--background");
    expect(getByText("important")).not.toHaveClass("eink-highlight--mono");
  });

  it("uses the mono wave-underline style when mono is true", () => {
    const { getByText } = render(<Highlight mono>important</Highlight>);
    expect(getByText("important")).toHaveClass("eink-highlight--mono");
    expect(getByText("important")).not.toHaveClass("eink-highlight--background");
  });

  it("merges a custom className", () => {
    const { getByText } = render(<Highlight className="custom">important</Highlight>);
    expect(getByText("important")).toHaveClass("custom");
  });
});
