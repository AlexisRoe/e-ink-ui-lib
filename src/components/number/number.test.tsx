import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
// biome-ignore lint/suspicious/noShadowRestrictedNames: `Number` is the intended public component name.
import { Number } from "./number.component";

describe("Number", () => {
  it("renders the value as text", () => {
    const { container } = render(<Number value={42} />);
    expect(container.textContent).toBe("42");
  });

  it("renders a prefix and suffix", () => {
    const { container } = render(<Number value={42} prefix="€" suffix="kg" />);
    expect(container.textContent).toBe("€42kg");
  });

  it("does not round by default", () => {
    const { container } = render(<Number value={1.23456} />);
    expect(container.textContent).toBe("1.23456");
  });

  it("rounds to the given number of decimal places", () => {
    const { container } = render(<Number value={1.23456} roundDecimal={2} />);
    expect(container.textContent).toBe("1.23");
  });

  it("pads with zeros when rounding requires it", () => {
    const { container } = render(<Number value={5} roundDecimal={2} />);
    expect(container.textContent).toBe("5.00");
  });

  it("does not group digits by default", () => {
    const { container } = render(<Number value={1234567} />);
    expect(container.textContent).toBe("1234567");
  });

  it("groups digits by thousands", () => {
    const { container } = render(<Number value={1234567} groupingBy="thousands" />);
    expect(container.textContent).toBe("1,234,567");
  });

  it("groups digits by lakh", () => {
    const { container } = render(<Number value={1234567} groupingBy="lakh" />);
    expect(container.textContent).toBe("12,34,567");
  });

  it("groups digits by wan", () => {
    const { container } = render(<Number value={123456789} groupingBy="wan" />);
    expect(container.textContent).toBe("1,2345,6789");
  });

  it("uses us separators by default", () => {
    const { container } = render(<Number value={1234.5} roundDecimal={1} groupingBy="thousands" />);
    expect(container.textContent).toBe("1,234.5");
  });

  it("uses eu separators when separatorStyle is eu", () => {
    const { container } = render(
      <Number value={1234.5} roundDecimal={1} groupingBy="thousands" separatorStyle="eu" />,
    );
    expect(container.textContent).toBe("1.234,5");
  });

  it("renders negative values with the sign before the prefix formatting", () => {
    const { container } = render(<Number value={-1234} groupingBy="thousands" />);
    expect(container.textContent).toBe("-1,234");
  });

  it("merges a custom className", () => {
    const { container } = render(<Number value={1} className="custom" />);
    expect(container.querySelector("span")).toHaveClass("custom");
  });
});
