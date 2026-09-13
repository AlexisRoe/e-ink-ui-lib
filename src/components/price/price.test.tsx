import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Price } from "./price.component";

describe("Price", () => {
  it("renders integer, decimal, and currency parts", () => {
    const { container } = render(<Price value={3.99} currency="€" />);
    expect(container.textContent).toBe("3.99€");
  });

  it("defaults to md size", () => {
    const { container } = render(<Price value={3.99} currency="€" />);
    expect(container.querySelector("span")).toHaveClass("eink-price--md");
  });

  it("applies the given size", () => {
    const { container } = render(<Price value={3.99} currency="€" size="xl" />);
    expect(container.querySelector("span")).toHaveClass("eink-price--xl");
  });

  it("pads a whole number with two decimal zeros", () => {
    const { container } = render(<Price value={5} currency="$" />);
    expect(container.textContent).toBe("5.00$");
  });

  it("rounds to two decimal places", () => {
    const { container } = render(<Price value={3.999} currency="$" />);
    expect(container.textContent).toBe("4.00$");
  });

  it("groups digits by thousands by default", () => {
    const { container } = render(<Price value={1234567.5} currency="$" />);
    expect(container.textContent).toBe("1,234,567.50$");
  });

  it("does not group digits when groupingBy is none", () => {
    const { container } = render(<Price value={1234567.5} currency="$" groupingBy="none" />);
    expect(container.textContent).toBe("1234567.50$");
  });

  it("groups digits by lakh", () => {
    const { container } = render(<Price value={1234567} currency="$" groupingBy="lakh" />);
    expect(container.textContent).toBe("12,34,567.00$");
  });

  it("groups digits by wan", () => {
    const { container } = render(<Price value={123456789} currency="$" groupingBy="wan" />);
    expect(container.textContent).toBe("1,2345,6789.00$");
  });

  it("uses us separators by default", () => {
    const { container } = render(<Price value={1234.5} currency="$" />);
    expect(container.textContent).toBe("1,234.50$");
  });

  it("uses eu separators when separatorStyle is eu", () => {
    const { container } = render(
      <Price value={1234.5} currency="€" groupingBy="thousands" separatorStyle="eu" />,
    );
    expect(container.textContent).toBe("1.234,50€");
  });

  it("renders negative values with a leading sign", () => {
    const { container } = render(<Price value={-3.99} currency="€" />);
    expect(container.textContent).toBe("-3.99€");
  });

  it("merges a custom className", () => {
    const { container } = render(<Price value={1} currency="$" className="custom" />);
    expect(container.querySelector("span")).toHaveClass("custom");
  });
});
