import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Description } from "./description.component";

describe("Description", () => {
  it("renders the label and value", () => {
    render(<Description label="Updated" value="Today, 14:02" />);
    expect(screen.getByText("Updated")).toBeInTheDocument();
    expect(screen.getByText("Today, 14:02")).toBeInTheDocument();
  });

  it("applies the base class and merges a custom className", () => {
    const { container } = render(
      <Description label="Updated" value="Today, 14:02" className="custom" />,
    );
    expect(container.firstElementChild).toHaveClass("eink-description", "custom");
  });
});
