import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders children", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });

  it("applies the filled variant class by default", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button")).toHaveClass("eink-button--filled");
  });

  it("renders a left icon, hidden from assistive tech", () => {
    render(<Button iconLeft="check">Confirm</Button>);
    const button = screen.getByRole("button", { name: "Confirm" });
    const icon = button.querySelector("svg");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("aria-hidden", "true");
    expect(button.querySelector(".eink-button__label")?.nextElementSibling).toBeNull();
  });

  it("renders a right icon, hidden from assistive tech", () => {
    render(<Button iconRight="arrow-right">Next</Button>);
    const button = screen.getByRole("button", { name: "Next" });
    const label = button.querySelector(".eink-button__label");
    expect(label?.nextElementSibling?.tagName).toBe("svg");
    expect(label?.nextElementSibling).toHaveAttribute("aria-hidden", "true");
  });

  it("forwards extra props such as disabled", () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});

describe("Button.Outlined", () => {
  it("applies the outlined variant class", () => {
    render(<Button.Outlined>Outlined</Button.Outlined>);
    expect(screen.getByRole("button")).toHaveClass("eink-button--outlined");
  });
});

describe("Button.Naked", () => {
  it("applies the naked variant class", () => {
    render(<Button.Naked>Naked</Button.Naked>);
    expect(screen.getByRole("button")).toHaveClass("eink-button--naked");
  });
});

describe("Button.Icon", () => {
  it("renders an icon-only filled button with an accessible label", () => {
    render(<Button.Icon icon="trash" aria-label="Delete" />);
    const button = screen.getByRole("button", { name: "Delete" });
    expect(button).toHaveClass("eink-button--filled", "eink-button--icon");
    const icon = button.querySelector("svg");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });
});

describe("Button.IconOutlined", () => {
  it("renders an icon-only outlined button", () => {
    render(<Button.IconOutlined icon="edit" aria-label="Edit" />);
    const button = screen.getByRole("button", { name: "Edit" });
    expect(button).toHaveClass("eink-button--outlined", "eink-button--icon");
  });
});

describe("Button.IconNaked", () => {
  it("renders an icon-only naked button", () => {
    render(<Button.IconNaked icon="close" aria-label="Close" />);
    const button = screen.getByRole("button", { name: "Close" });
    expect(button).toHaveClass("eink-button--naked", "eink-button--icon");
  });
});
