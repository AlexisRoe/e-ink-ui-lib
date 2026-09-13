import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Flex } from "./flex.component";

describe("Flex", () => {
  it("renders its children", () => {
    render(
      <Flex>
        <span>child</span>
      </Flex>,
    );
    expect(screen.getByText("child")).toBeInTheDocument();
  });

  it("defaults to a row layout with the md gap", () => {
    const { container } = render(<Flex>content</Flex>);
    const flex = container.firstElementChild as HTMLElement;
    expect(flex).toHaveClass("eink-flex");
    expect(flex).not.toHaveClass("eink-flex--column");
    expect(flex).toHaveClass("eink-flex--gap-md");
  });

  it("switches to a column layout when column is true", () => {
    const { container } = render(<Flex column>content</Flex>);
    expect(container.firstElementChild).toHaveClass("eink-flex--column");
  });

  it("applies the requested gap", () => {
    const { container } = render(<Flex gap="xl">content</Flex>);
    expect(container.firstElementChild).toHaveClass("eink-flex--gap-xl");
  });

  it("applies the wrap class when wrap is true", () => {
    const { container } = render(<Flex wrap>content</Flex>);
    expect(container.firstElementChild).toHaveClass("eink-flex--wrap");
  });

  it("does not apply the wrap class by default", () => {
    const { container } = render(<Flex>content</Flex>);
    expect(container.firstElementChild).not.toHaveClass("eink-flex--wrap");
  });

  it("does not apply the inline class by default", () => {
    const { container } = render(<Flex>content</Flex>);
    expect(container.firstElementChild).not.toHaveClass("eink-flex--inline");
  });

  it("applies the inline class when inline is true", () => {
    const { container } = render(<Flex inline>content</Flex>);
    expect(container.firstElementChild).toHaveClass("eink-flex--inline");
  });

  it("maps justify and align to CSS values", () => {
    const { container } = render(
      <Flex justify="space-between" align="center">
        content
      </Flex>,
    );
    const flex = container.firstElementChild as HTMLElement;
    expect(flex.style.justifyContent).toBe("space-between");
    expect(flex.style.alignItems).toBe("center");
  });
});
