import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Value } from "./value.component";

describe("Value", () => {
  it("renders the value and unit", () => {
    const { container } = render(<Value unit="%">44</Value>);
    expect(container.textContent).toBe("44%");
  });

  it("renders a decimal value", () => {
    const { container } = render(<Value unit="°C">21.4</Value>);
    expect(container.textContent).toBe("21.4°C");
  });

  it("defaults to md size", () => {
    const { container } = render(<Value unit="%">44</Value>);
    expect(container.querySelector("span")).toHaveClass("eink-value--md");
  });

  it("applies the given size", () => {
    const { container } = render(
      <Value unit="%" size="xl">
        44
      </Value>,
    );
    expect(container.querySelector("span")).toHaveClass("eink-value--xl");
  });

  it("merges a custom className", () => {
    const { container } = render(
      <Value unit="%" className="custom">
        44
      </Value>,
    );
    expect(container.querySelector("span")).toHaveClass("custom");
  });
});
