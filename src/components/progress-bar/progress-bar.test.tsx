import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProgressBar } from "./progress-bar.component";

describe("ProgressBar", () => {
  it("sets aria-valuenow to the given value", () => {
    render(<ProgressBar value={42} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "42");
  });

  it("clamps values above 100", () => {
    render(<ProgressBar value={150} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "100");
  });

  it("clamps values below 0", () => {
    render(<ProgressBar value={-10} />);
    expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "0");
  });

  it("does not render a label by default", () => {
    render(<ProgressBar value={42} />);
    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
  });

  it("renders the label as `label · value%`", () => {
    render(<ProgressBar value={42} label="Upload" />);
    expect(screen.getByText("Upload · 42%")).toBeInTheDocument();
  });
});

describe("ProgressBar.Naked", () => {
  it("never renders a label", () => {
    render(<ProgressBar.Naked value={42} />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
    expect(screen.queryByText(/%/)).not.toBeInTheDocument();
  });
});

describe("ProgressBar.Diagonal", () => {
  it("renders the same label format as ProgressBar", () => {
    render(<ProgressBar.Diagonal value={42} label="Upload" />);
    expect(screen.getByText("Upload · 42%")).toBeInTheDocument();
  });
});

describe("ProgressBar.Stepper", () => {
  it("fills no steps when currentStep is 0", () => {
    const { container } = render(<ProgressBar.Stepper steps={5} currentStep={0} />);
    expect(container.querySelectorAll(".eink-progress-bar-stepper__step--filled")).toHaveLength(0);
  });

  it("fills exactly currentStep steps", () => {
    const { container } = render(<ProgressBar.Stepper steps={5} currentStep={2} />);
    expect(container.querySelectorAll(".eink-progress-bar-stepper__step--filled")).toHaveLength(2);
  });

  it("fills all steps when currentStep exceeds steps", () => {
    const { container } = render(<ProgressBar.Stepper steps={5} currentStep={10} />);
    expect(container.querySelectorAll(".eink-progress-bar-stepper__step--filled")).toHaveLength(5);
  });

  it("renders the label as `label · currentStep / steps`", () => {
    render(<ProgressBar.Stepper steps={5} currentStep={1} label="Upload" />);
    expect(screen.getByText("Upload · 1 / 5")).toBeInTheDocument();
  });

  it("renders `-` in the label when currentStep is 0", () => {
    render(<ProgressBar.Stepper steps={5} currentStep={0} label="Upload" />);
    expect(screen.getByText("Upload · - / 5")).toBeInTheDocument();
  });

  it("caps the label at steps when currentStep exceeds it", () => {
    render(<ProgressBar.Stepper steps={7} currentStep={10} label="Upload" />);
    expect(screen.getByText("Upload · 7 / 7")).toBeInTheDocument();
  });

  it("does not render a label by default", () => {
    render(<ProgressBar.Stepper steps={5} currentStep={1} />);
    expect(screen.queryByText(/\/ 5/)).not.toBeInTheDocument();
  });
});
