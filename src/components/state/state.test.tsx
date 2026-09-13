import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { State } from "./state.component";

describe("State.Empty", () => {
  it("renders the required title", () => {
    render(<State.Empty title="Nothing here yet" />);
    expect(screen.getByText("Nothing here yet")).toBeInTheDocument();
  });

  it("does not render subtitle, description, or action by default", () => {
    render(<State.Empty title="Nothing here yet" />);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders an optional subtitle and description", () => {
    render(<State.Empty title="Nothing here yet" subtitle="Sub" description="Desc" />);
    expect(screen.getByText("Sub")).toBeInTheDocument();
    expect(screen.getByText("Desc")).toBeInTheDocument();
  });

  it("renders an outlined action button and calls onClick", () => {
    const onClick = vi.fn();
    render(<State.Empty title="Nothing here yet" action={{ label: "Add item", onClick }} />);
    const button = screen.getByRole("button", { name: "Add item" });
    expect(button).toHaveClass("eink-button--outlined");
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("has a border by default", () => {
    const { container } = render(<State.Empty title="Nothing here yet" />);
    expect(container.firstElementChild).toHaveClass("eink-container--border");
  });
});

describe("State.Error", () => {
  it("renders the required title", () => {
    render(<State.Error title="Something went wrong" />);
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("renders a filled action button and calls onClick", () => {
    const onClick = vi.fn();
    render(<State.Error title="Something went wrong" action={{ label: "Retry", onClick }} />);
    const button = screen.getByRole("button", { name: "Retry" });
    expect(button).toHaveClass("eink-button--filled");
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
