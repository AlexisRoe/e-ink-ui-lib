import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Center } from "./center.component";

describe("Center", () => {
  it("renders its children", () => {
    render(
      <Center>
        <span>child</span>
      </Center>,
    );
    expect(screen.getByText("child")).toBeInTheDocument();
  });

  it("does not apply full-width/full-height classes by default", () => {
    const { container } = render(<Center>content</Center>);
    const center = container.firstElementChild as HTMLElement;
    expect(center).not.toHaveClass("eink-center--full-width");
    expect(center).not.toHaveClass("eink-center--full-height");
  });

  it("applies the full-width class when fullWidth is true", () => {
    const { container } = render(<Center fullWidth>content</Center>);
    expect(container.firstElementChild).toHaveClass("eink-center--full-width");
  });

  it("applies the full-height class when fullHeight is true", () => {
    const { container } = render(<Center fullHeight>content</Center>);
    expect(container.firstElementChild).toHaveClass("eink-center--full-height");
  });
});
