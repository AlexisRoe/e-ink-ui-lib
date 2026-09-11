import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Label } from "./Label.component";

describe("Label", () => {
  it("renders a span", () => {
    render(<Label>Battery status</Label>);
    const label = screen.getByText("Battery status");
    expect(label.tagName).toBe("SPAN");
    expect(label).toHaveClass("eink-label");
  });
});
