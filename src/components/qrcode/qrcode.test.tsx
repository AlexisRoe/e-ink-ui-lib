import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { QRCode } from "./qrcode.component";

describe("QRCode", () => {
  it("renders an svg with an accessible label", () => {
    render(<QRCode value="https://example.com" label="Website" />);
    expect(screen.getByRole("img", { name: "Website" })).toBeInTheDocument();
  });

  it("falls back to a generic accessible name when no label is given", () => {
    render(<QRCode value="https://example.com" />);
    expect(screen.getByRole("img", { name: "QR code" })).toBeInTheDocument();
  });

  it("renders the label caption below the code", () => {
    const { container } = render(<QRCode value="https://example.com" label="Website" />);
    expect(container.querySelector(".eink-qrcode__label")).toHaveTextContent("Website");
  });

  it("applies the width prop to the container", () => {
    const { container } = render(<QRCode value="https://example.com" width={200} />);
    expect(container.querySelector(".eink-qrcode")).toHaveStyle({ width: "200px" });
  });

  it("renders modules for structured wifi values", () => {
    const { container } = render(
      <QRCode value={{ type: "wifi", ssid: "Office", password: "secret" }} />,
    );
    const path = container.querySelector(".eink-qrcode__modules");
    expect(path?.getAttribute("d")).not.toBe("");
  });

  it("produces a denser code at a higher error correction level", () => {
    const { container: low } = render(
      <QRCode value="https://example.com/a-fairly-long-path" errorCorrectionLevel="L" />,
    );
    const { container: high } = render(
      <QRCode value="https://example.com/a-fairly-long-path" errorCorrectionLevel="H" />,
    );
    const lowViewBox = low.querySelector("svg")?.getAttribute("viewBox");
    const highViewBox = high.querySelector("svg")?.getAttribute("viewBox");
    expect(lowViewBox).not.toBe(highViewBox);
  });
});
