import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Code } from "./code.component";

describe("Code", () => {
  it("renders the children inside a <code> element", () => {
    const { getByText } = render(<Code>npm install</Code>);
    expect(getByText("npm install").tagName).toBe("CODE");
  });

  it("uses the light background style by default", () => {
    const { getByText } = render(<Code>npm install</Code>);
    expect(getByText("npm install")).not.toHaveClass("eink-code--mono");
  });

  it("uses the mono black-background style when mono is true", () => {
    const { getByText } = render(<Code mono>npm install</Code>);
    expect(getByText("npm install")).toHaveClass("eink-code--mono");
  });

  it("merges a custom className", () => {
    const { getByText } = render(<Code className="custom">npm install</Code>);
    expect(getByText("npm install")).toHaveClass("custom");
  });
});

describe("Code.Block", () => {
  const sample = "function greet() {\n  return 42;\n}";

  it("renders a <pre><code> element preserving the text content", () => {
    const { container } = render(<Code.Block>{sample}</Code.Block>);
    const pre = container.querySelector("pre");
    const code = container.querySelector("pre > code");
    expect(pre).not.toBeNull();
    expect(code).not.toBeNull();
    expect(code?.textContent).toBe(sample);
  });

  it("uses the light background style by default", () => {
    const { container } = render(<Code.Block>{sample}</Code.Block>);
    expect(container.querySelector("pre")).not.toHaveClass("eink-code__block--mono");
  });

  it("uses the mono black-background style when mono is true", () => {
    const { container } = render(<Code.Block mono>{sample}</Code.Block>);
    expect(container.querySelector("pre")).toHaveClass("eink-code__block--mono");
  });

  it("merges a custom className", () => {
    const { container } = render(<Code.Block className="custom">{sample}</Code.Block>);
    expect(container.querySelector("pre")).toHaveClass("custom");
  });
});
