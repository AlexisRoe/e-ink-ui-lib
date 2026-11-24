import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { parseRichText, RichText } from "./rich-text.component";

describe("parseRichText", () => {
  it("splits plain and strong segments", () => {
    expect(parseRichText("a **b** c")).toEqual([
      { text: "a ", strong: false },
      { text: "b", strong: true },
      { text: " c", strong: false },
    ]);
  });

  it("keeps unclosed and empty markers as plain text", () => {
    expect(parseRichText("a **b")).toEqual([{ text: "a **b", strong: false }]);
    expect(parseRichText("****")).toEqual([{ text: "****", strong: false }]);
    expect(parseRichText("")).toEqual([]);
  });
});

describe("RichText", () => {
  it("renders strong segments as marks", () => {
    render(<RichText text="Use **strong** words" />);
    expect(screen.getByText("strong").tagName).toBe("MARK");
  });

  it("never renders markup from the text", () => {
    const { container } = render(<RichText text="<b>x</b> **y**" />);
    expect(container.querySelector("b")).toBeNull();
    expect(container).toHaveTextContent("<b>x</b> y");
  });

  it("forwards span attributes", () => {
    render(<RichText text="x" data-testid="rt" className="custom" />);
    expect(screen.getByTestId("rt")).toHaveClass("custom");
  });
});
