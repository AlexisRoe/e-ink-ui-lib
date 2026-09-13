import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Image } from "./image.component";

describe("Image", () => {
  it("renders the img with the label as alt text", () => {
    render(<Image src="/office.jpeg" width={100} height={100} label="Office" />);
    expect(screen.getByRole("img", { hidden: true, name: "Office" })).toBeInTheDocument();
  });

  it("renders the img with the alt prop when no label is given", () => {
    render(<Image src="/office.jpeg" width={100} height={100} alt="Office" />);
    expect(screen.getByRole("img", { hidden: true, name: "Office" })).toBeInTheDocument();
  });

  it("lazy-loads the image", () => {
    render(<Image src="/office.jpeg" width={100} height={100} alt="Office" />);
    expect(screen.getByRole("img", { hidden: true })).toHaveAttribute("loading", "lazy");
  });

  it("hides the img and shows the placeholder icon until it loads", () => {
    const { container } = render(
      <Image src="/office.jpeg" width={100} height={100} alt="Office" />,
    );
    expect(container.querySelector(".eink-image__placeholder")).toBeInTheDocument();
    expect(screen.getByRole("img", { hidden: true })).toHaveStyle({ opacity: "0" });

    fireEvent.load(screen.getByRole("img", { hidden: true }));

    expect(container.querySelector(".eink-image__placeholder")).not.toBeInTheDocument();
    expect(screen.getByRole("img", { hidden: true })).toHaveStyle({ opacity: "1" });
  });

  it("renders the placeholder icon on a black background when src is empty", () => {
    const { container } = render(<Image src="" width={100} height={100} alt="Office" />);
    expect(container.querySelector("img")).not.toBeInTheDocument();
    expect(container.querySelector(".eink-image__placeholder")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "Office" })).toBeInTheDocument();
  });

  it("renders a border by default", () => {
    const { container } = render(<Image src="" width={100} height={100} alt="Office" />);
    expect(container.querySelector(".eink-image__frame")).toHaveClass(
      "eink-image__frame--bordered",
    );
  });

  it("omits the border when withBorder is false", () => {
    const { container } = render(
      <Image src="" width={100} height={100} alt="Office" withBorder={false} />,
    );
    expect(container.querySelector(".eink-image__frame")).not.toHaveClass(
      "eink-image__frame--bordered",
    );
  });

  it("applies width, height, and aspectRatio to the frame", () => {
    const { container } = render(
      <Image src="" width={320} height={200} aspectRatio={1.6} alt="Office" />,
    );
    expect(container.querySelector(".eink-image__frame")).toHaveStyle({
      width: "320px",
      height: "200px",
      aspectRatio: "1.6",
    });
  });

  it("does not render a label by default", () => {
    const { container } = render(<Image src="" width={100} height={100} alt="Office" />);
    expect(container.querySelector(".eink-image__label")).not.toBeInTheDocument();
  });

  it("renders the label below the image when provided", () => {
    render(<Image src="" width={100} height={100} label="Office" />);
    expect(screen.getByText("Office")).toHaveClass("eink-image__label");
  });
});
