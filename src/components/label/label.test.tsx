import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Label } from "./label.component";

describe("Label", () => {
  it("renders a span", () => {
    render(<Label>Battery status</Label>);
    const label = screen.getByText("Battery status");
    expect(label.tagName).toBe("SPAN");
    expect(label).toHaveClass("eink-label");
  });

  it("Label.Form renders a native label associated via htmlFor", () => {
    render(
      <>
        <Label.Form htmlFor="email">Email</Label.Form>
        <input id="email" />
      </>,
    );
    expect(screen.getByLabelText("Email").tagName).toBe("INPUT");
    expect(screen.getByText("Email")).toHaveClass("eink-label", "eink-label--form");
  });
});
