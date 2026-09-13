import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Barcode } from "./barcode.component";

describe("Barcode", () => {
  it("renders an svg with an accessible label", () => {
    render(<Barcode value="123456789012" label="Widget" />);
    expect(screen.getByRole("img", { name: "Widget" })).toBeInTheDocument();
  });

  it("falls back to the encoded value as the accessible name when no label is given", () => {
    render(<Barcode value="123456789012" />);
    expect(screen.getByRole("img", { name: "123456789012" })).toBeInTheDocument();
  });

  it("renders the label caption below the barcode", () => {
    const { container } = render(<Barcode value="123456789012" label="Widget" />);
    expect(container.querySelector(".eink-barcode__label")).toHaveTextContent("Widget");
  });

  it("applies the width prop to the container", () => {
    const { container } = render(<Barcode value="123456789012" width={300} />);
    expect(container.querySelector(".eink-barcode")).toHaveStyle({ width: "300px" });
  });

  it("renders bars for the given value", () => {
    const { container } = render(<Barcode value="123456789012" />);
    expect(container.querySelectorAll(".eink-barcode__svg rect").length).toBeGreaterThan(0);
  });

  it("renders an error message when the value is invalid for the format", () => {
    render(<Barcode value="not-a-valid-ean" format="ean13" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });
});
