import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Trend } from "./trend.component";

describe("Trend", () => {
  it("renders children content", () => {
    const { container } = render(<Trend direction="up">0.6</Trend>);
    expect(container.textContent).toBe("0.6");
  });

  it("applies the up direction class", () => {
    const { container } = render(<Trend direction="up">0.6</Trend>);
    expect(container.querySelector(".eink-trend__shape")).toHaveClass("eink-trend__shape--up");
  });

  it("applies the down direction class", () => {
    const { container } = render(<Trend direction="down">-0.6</Trend>);
    expect(container.querySelector(".eink-trend__shape")).toHaveClass("eink-trend__shape--down");
  });

  it("applies the none direction class", () => {
    const { container } = render(<Trend direction="none">0.0</Trend>);
    expect(container.querySelector(".eink-trend__shape")).toHaveClass("eink-trend__shape--none");
  });

  it("defaults to md size", () => {
    const { container } = render(<Trend direction="up">0.6</Trend>);
    expect(container.querySelector("span")).toHaveClass("eink-trend--md");
  });

  it("applies the given size", () => {
    const { container } = render(
      <Trend direction="up" size="xl">
        0.6
      </Trend>,
    );
    expect(container.querySelector("span")).toHaveClass("eink-trend--xl");
  });

  it("supports arbitrary children content", () => {
    const { getByText } = render(
      <Trend direction="up">
        <strong>0.6</strong>
      </Trend>,
    );
    expect(getByText("0.6").tagName).toBe("STRONG");
  });

  it("merges a custom className", () => {
    const { container } = render(
      <Trend direction="up" className="custom">
        0.6
      </Trend>,
    );
    expect(container.querySelector("span")).toHaveClass("custom");
  });
});

describe("Trend.Full", () => {
  it("renders children content", () => {
    const { container } = render(
      <Trend.Full direction="down">Decreased by 1.60 from € 14.50</Trend.Full>,
    );
    expect(container.textContent).toBe("Decreased by 1.60 from € 14.50");
  });

  it("applies the up direction class", () => {
    const { container } = render(<Trend.Full direction="up">Increased</Trend.Full>);
    expect(container.querySelector(".eink-trend-full__shape")).toHaveClass(
      "eink-trend-full__shape--up",
    );
  });

  it("applies the down direction class", () => {
    const { container } = render(<Trend.Full direction="down">Decreased</Trend.Full>);
    expect(container.querySelector(".eink-trend-full__shape")).toHaveClass(
      "eink-trend-full__shape--down",
    );
  });

  it("applies the none direction class", () => {
    const { container } = render(<Trend.Full direction="none">No change</Trend.Full>);
    expect(container.querySelector(".eink-trend-full__shape")).toHaveClass(
      "eink-trend-full__shape--none",
    );
  });

  it("merges a custom className", () => {
    const { container } = render(
      <Trend.Full direction="down" className="custom">
        Decreased
      </Trend.Full>,
    );
    expect(container.querySelector(".eink-trend-full")).toHaveClass("custom");
  });
});
