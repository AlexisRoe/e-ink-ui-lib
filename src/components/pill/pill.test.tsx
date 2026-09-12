import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Pill } from "./pill.component";

describe("Pill", () => {
  it("renders its label", () => {
    render(<Pill>ok</Pill>);
    expect(screen.getByText("ok")).toBeInTheDocument();
  });

  it("applies the solid border class by default", () => {
    render(<Pill>ok</Pill>);
    expect(screen.getByText("ok").closest(".eink-pill")).toHaveClass("eink-pill--solid");
  });

  it("defaults to the md size", () => {
    render(<Pill>ok</Pill>);
    expect(screen.getByText("ok").closest(".eink-pill")).toHaveClass("eink-pill--md");
  });

  it("applies the requested size", () => {
    render(<Pill size="xl">ok</Pill>);
    expect(screen.getByText("ok").closest(".eink-pill")).toHaveClass("eink-pill--xl");
  });

  it("renders an icon when given", () => {
    render(<Pill icon="check">ok</Pill>);
    expect(document.querySelector(".eink-pill__icon")).toBeInTheDocument();
  });

  it("renders no icon by default", () => {
    render(<Pill>ok</Pill>);
    expect(document.querySelector(".eink-pill__icon")).not.toBeInTheDocument();
  });

  it("renders Pill.Double with the double border class", () => {
    render(<Pill.Double>warning</Pill.Double>);
    expect(screen.getByText("warning").closest(".eink-pill")).toHaveClass("eink-pill--double");
  });

  it("renders Pill.Filled with the filled class", () => {
    render(<Pill.Filled>critical</Pill.Filled>);
    expect(screen.getByText("critical").closest(".eink-pill")).toHaveClass("eink-pill--filled");
  });

  it("renders Pill.Dashed with the dashed class", () => {
    render(<Pill.Dashed>neutral</Pill.Dashed>);
    expect(screen.getByText("neutral").closest(".eink-pill")).toHaveClass("eink-pill--dashed");
  });

  it("renders Pill.Dotted with the dotted class", () => {
    render(<Pill.Dotted>offline</Pill.Dotted>);
    expect(screen.getByText("offline").closest(".eink-pill")).toHaveClass("eink-pill--dotted");
  });
});
