import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Text } from "./Text.component";

describe("Text", () => {
  it("renders a paragraph by default", () => {
    render(<Text>Copy</Text>);
    const text = screen.getByText("Copy");
    expect(text.tagName).toBe("P");
  });

  it("renders a span when as='span'", () => {
    render(<Text as="span">Copy</Text>);
    const text = screen.getByText("Copy");
    expect(text.tagName).toBe("SPAN");
  });
});
