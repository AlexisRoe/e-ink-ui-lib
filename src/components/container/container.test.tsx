import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Container } from "./container.component";

describe("Container", () => {
  it("renders its children", () => {
    render(
      <Container>
        <span>child</span>
      </Container>,
    );
    expect(screen.getByText("child")).toBeInTheDocument();
  });

  it("has a border by default", () => {
    const { container } = render(<Container>content</Container>);
    expect(container.firstElementChild).toHaveClass("eink-container--border");
  });

  it("omits the border when withBorder is false", () => {
    const { container } = render(<Container withBorder={false}>content</Container>);
    expect(container.firstElementChild).not.toHaveClass("eink-container--border");
  });

  it("does not apply full width by default", () => {
    const { container } = render(<Container>content</Container>);
    expect(container.firstElementChild).not.toHaveClass("eink-container--full-width");
  });

  it("applies full width when fullWidth is true", () => {
    const { container } = render(<Container fullWidth>content</Container>);
    expect(container.firstElementChild).toHaveClass("eink-container--full-width");
  });

  it("applies full height when fullHeight is true", () => {
    const { container } = render(<Container fullHeight>content</Container>);
    expect(container.firstElementChild).toHaveClass("eink-container--full-height");
  });

  it("does not center by default", () => {
    const { container } = render(<Container>content</Container>);
    expect(container.firstElementChild).not.toHaveClass("eink-container--centered");
  });

  it("centers children when centered is true", () => {
    const { container } = render(<Container centered>content</Container>);
    expect(container.firstElementChild).toHaveClass("eink-container--centered");
  });

  it("forwards className and style props", () => {
    const { container } = render(
      <Container className="custom" style={{ color: "red" }}>
        content
      </Container>,
    );
    const el = container.firstElementChild as HTMLElement;
    expect(el).toHaveClass("custom");
    expect(el.style.color).toBe("red");
  });
});
