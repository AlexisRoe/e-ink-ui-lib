import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Counter } from "./counter.component";

describe("Counter", () => {
  it("renders the label", () => {
    const { getByText } = render(<Counter label="Inbox" />);
    expect(getByText("Inbox")).toBeInTheDocument();
  });

  it("renders no badge by default", () => {
    const { container } = render(<Counter label="Inbox" />);
    expect(container.querySelector(".eink-counter__badge")).toBeNull();
  });

  it("renders the count", () => {
    const { getByText } = render(<Counter label="Inbox" count={5} />);
    expect(getByText("5")).toBeInTheDocument();
  });

  it("renders counts of 100 and above as 99+", () => {
    const { getByText, queryByText } = render(<Counter label="Inbox" count={132} />);
    expect(getByText("99+")).toBeInTheDocument();
    expect(queryByText("132")).not.toBeInTheDocument();
  });

  it("renders 99 as-is", () => {
    const { getByText } = render(<Counter label="Inbox" count={99} />);
    expect(getByText("99")).toBeInTheDocument();
  });

  it("renders a dot badge", () => {
    const { container } = render(<Counter label="Inbox" dot />);
    expect(container.querySelector(".eink-counter__badge--dot")).not.toBeNull();
  });

  it("applies the size modifier class", () => {
    const { container } = render(<Counter label="Inbox" size="xl" />);
    expect(container.firstChild).toHaveClass("eink-counter--xl");
  });

  it("defaults to the md size", () => {
    const { container } = render(<Counter label="Inbox" />);
    expect(container.firstChild).toHaveClass("eink-counter--md");
  });

  it("merges a custom className", () => {
    const { container } = render(<Counter label="Inbox" className="custom" />);
    expect(container.firstChild).toHaveClass("custom");
  });
});
