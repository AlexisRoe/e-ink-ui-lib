import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Stepper } from "./stepper.component";

describe("Stepper", () => {
  it("numbers items by their position, starting at 1", () => {
    const { getAllByText } = render(
      <Stepper>
        <Stepper.Item title="Ordered" />
        <Stepper.Item title="Packed" />
        <Stepper.Item title="Delivered" />
      </Stepper>,
    );
    expect(getAllByText("1", { selector: ".eink-stepper-item__number" })).toHaveLength(1);
    expect(getAllByText("2", { selector: ".eink-stepper-item__number" })).toHaveLength(1);
    expect(getAllByText("3", { selector: ".eink-stepper-item__number" })).toHaveLength(1);
  });

  it("renders each item's title and description children", () => {
    const { getByText } = render(
      <Stepper>
        <Stepper.Item title="Ordered">28 Aug, 09:12</Stepper.Item>
      </Stepper>,
    );
    expect(getByText("Ordered")).toBeInTheDocument();
    expect(getByText("28 Aug, 09:12")).toBeInTheDocument();
  });

  it("omits the description element when not provided", () => {
    const { container } = render(
      <Stepper>
        <Stepper.Item title="Ordered" />
      </Stepper>,
    );
    expect(container.querySelector(".eink-stepper-item__description")).toBeNull();
  });

  it("defaults to highlighting the first item", () => {
    const { container } = render(
      <Stepper>
        <Stepper.Item title="Ordered" />
        <Stepper.Item title="Packed" />
      </Stepper>,
    );
    const items = container.querySelectorAll(".eink-stepper-item");
    expect(items[0]).toHaveClass("eink-stepper-item--active");
    expect(items[1]).not.toHaveClass("eink-stepper-item--active");
  });

  it("highlights the item at initialIndex", () => {
    const { container } = render(
      <Stepper initialIndex={1}>
        <Stepper.Item title="Ordered" />
        <Stepper.Item title="Packed" />
      </Stepper>,
    );
    const items = container.querySelectorAll(".eink-stepper-item");
    expect(items[0]).not.toHaveClass("eink-stepper-item--active");
    expect(items[1]).toHaveClass("eink-stepper-item--active");
  });

  it("defaults to full width", () => {
    const { container } = render(
      <Stepper>
        <Stepper.Item title="Ordered" />
      </Stepper>,
    );
    expect(container.querySelector(".eink-stepper")).toHaveClass("eink-stepper--full-width");
  });

  it("does not apply the full-width class when fullWidth is false", () => {
    const { container } = render(
      <Stepper fullWidth={false}>
        <Stepper.Item title="Ordered" />
      </Stepper>,
    );
    expect(container.querySelector(".eink-stepper")).not.toHaveClass("eink-stepper--full-width");
  });

  it("highlights currentIndex over initialIndex when both are given", () => {
    const { container } = render(
      <Stepper initialIndex={0} currentIndex={1}>
        <Stepper.Item title="Ordered" />
        <Stepper.Item title="Packed" />
      </Stepper>,
    );
    const items = container.querySelectorAll(".eink-stepper-item");
    expect(items[0]).not.toHaveClass("eink-stepper-item--active");
    expect(items[1]).toHaveClass("eink-stepper-item--active");
  });

  it("merges a custom className", () => {
    const { container } = render(
      <Stepper className="custom">
        <Stepper.Item title="Ordered" />
      </Stepper>,
    );
    expect(container.querySelector(".eink-stepper")).toHaveClass("custom");
  });
});
