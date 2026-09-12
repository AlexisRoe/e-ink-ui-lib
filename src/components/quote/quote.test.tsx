import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Quote } from "./quote.component";

describe("Quote", () => {
  it("renders the children inside a <blockquote> element", () => {
    const { container } = render(<Quote>Some quoted text</Quote>);
    expect(container.querySelector("blockquote")).not.toBeNull();
    expect(container.querySelector("blockquote")?.textContent).toContain("Some quoted text");
  });

  it("does not render a <cite> element when cite is not provided", () => {
    const { container } = render(<Quote>Some quoted text</Quote>);
    expect(container.querySelector("cite")).toBeNull();
  });

  it("renders the cite prop inside a <cite> element", () => {
    const { container } = render(<Quote cite="Forrest Gump">Some quoted text</Quote>);
    const cite = container.querySelector("cite");
    expect(cite).not.toBeNull();
    expect(cite?.textContent).toBe("— Forrest Gump");
  });

  it("merges a custom className", () => {
    const { container } = render(<Quote className="custom">Some quoted text</Quote>);
    expect(container.querySelector("blockquote")).toHaveClass("custom");
  });

  it("uses the light background style by default", () => {
    const { container } = render(<Quote>Some quoted text</Quote>);
    expect(container.querySelector("blockquote")).not.toHaveClass("eink-quote--mono");
  });

  it("uses the black and white style when mono is true", () => {
    const { container } = render(<Quote mono>Some quoted text</Quote>);
    expect(container.querySelector("blockquote")).toHaveClass("eink-quote--mono");
  });
});
