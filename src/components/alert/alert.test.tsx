import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Alert } from "./alert.component";

describe("Alert", () => {
  it("renders the required title", () => {
    render(<Alert title="Heads up" />);
    expect(screen.getByText("Heads up")).toBeInTheDocument();
  });

  it("renders an optional description", () => {
    render(<Alert title="Heads up" description="Something to know." />);
    expect(screen.getByText("Something to know.")).toBeInTheDocument();
  });

  it("does not render a description by default", () => {
    render(<Alert title="Heads up" />);
    expect(screen.queryByText("Something to know.")).not.toBeInTheDocument();
  });

  it("defaults to the info variant", () => {
    const { container } = render(<Alert title="Heads up" />);
    expect(container.querySelector(".eink-alert__bar--info")).toBeInTheDocument();
  });

  it("renders the warning variant with a diagonal-line pattern", () => {
    const { container } = render(<Alert title="Heads up" variant="warning" />);
    expect(container.querySelector(".eink-alert__bar--warning")).toBeInTheDocument();
    expect(container.querySelector(".eink-alert__pattern")).toBeInTheDocument();
  });

  it("renders the error variant", () => {
    const { container } = render(<Alert title="Heads up" variant="error" />);
    expect(container.querySelector(".eink-alert__bar--error")).toBeInTheDocument();
  });

  it("renders an optional icon", () => {
    render(<Alert title="Heads up" icon="alert-triangle" />);
    expect(document.querySelector(".eink-alert__icon")).toBeInTheDocument();
  });

  it("does not render an icon by default", () => {
    render(<Alert title="Heads up" />);
    expect(document.querySelector(".eink-alert__icon")).not.toBeInTheDocument();
  });

  it("uses role alert for the error variant", () => {
    render(<Alert title="Heads up" variant="error" />);
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("uses role status for non-error variants", () => {
    render(<Alert title="Heads up" />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});
