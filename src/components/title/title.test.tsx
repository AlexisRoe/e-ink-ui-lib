import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Title } from "./title.component";

describe("Title", () => {
  it("renders an h1 by default", () => {
    render(<Title>Heading</Title>);
    expect(screen.getByRole("heading", { level: 1, name: "Heading" })).toBeInTheDocument();
  });

  it("renders the tag matching the size prop", () => {
    render(<Title size="3">Heading</Title>);
    const heading = screen.getByRole("heading", { level: 3, name: "Heading" });
    expect(heading.tagName).toBe("H3");
    expect(heading).toHaveClass("eink-title--3");
  });

  it("forwards extra props", () => {
    render(<Title id="page-title">Heading</Title>);
    expect(screen.getByRole("heading")).toHaveAttribute("id", "page-title");
  });
});
