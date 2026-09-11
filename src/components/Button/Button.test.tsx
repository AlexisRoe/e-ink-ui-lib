import { act, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button.component";

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

  it("applies the full-width modifier class when fullWidth is true", () => {
    render(<Button fullWidth>Click me</Button>);
    expect(screen.getByRole("button")).toHaveClass("eink-button--full-width");
  });

  it("omits the full-width modifier class by default", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button")).not.toHaveClass("eink-button--full-width");
  });

  it("applies the md size modifier class by default", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button")).toHaveClass("eink-button--md");
  });

  it("applies the requested size modifier class", () => {
    render(<Button size="sm">Click me</Button>);
    expect(screen.getByRole("button")).toHaveClass("eink-button--sm");
  });

  it("shows the hourglass icon and disables the button when loading", () => {
    render(<Button loading>Saving</Button>);
    const button = screen.getByRole("button", { name: "Saving" });
    expect(button).toHaveClass("eink-button--loading");
    expect(button).toBeDisabled();
    expect(button.querySelector("svg")).toBeInTheDocument();
  });

  it("allows overriding disabled while loading", () => {
    render(
      <Button loading disabled={false}>
        Saving
      </Button>,
    );
    expect(screen.getByRole("button", { name: "Saving" })).not.toBeDisabled();
  });

  it("flips the loading icon 180 degrees every 2 seconds by default", () => {
    vi.useFakeTimers();
    try {
      render(<Button loading>Saving</Button>);
      const icon = screen.getByRole("button", { name: "Saving" }).querySelector("svg");
      expect(icon).toHaveStyle({ transform: "rotate(0deg)" });

      act(() => {
        vi.advanceTimersByTime(2000);
      });
      expect(icon).toHaveStyle({ transform: "rotate(180deg)" });

      act(() => {
        vi.advanceTimersByTime(2000);
      });
      expect(icon).toHaveStyle({ transform: "rotate(0deg)" });
    } finally {
      vi.useRealTimers();
    }
  });

  it("allows overriding the flip interval while loading", () => {
    vi.useFakeTimers();
    try {
      render(
        <Button loading flipIntervalMs={500}>
          Saving
        </Button>,
      );
      const icon = screen.getByRole("button", { name: "Saving" }).querySelector("svg");
      expect(icon).toHaveStyle({ transform: "rotate(0deg)" });

      act(() => {
        vi.advanceTimersByTime(500);
      });
      expect(icon).toHaveStyle({ transform: "rotate(180deg)" });
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("Button.Outlined", () => {
  it("applies the outlined variant class", () => {
    render(<Button.Outlined>Outlined</Button.Outlined>);
    expect(screen.getByRole("button")).toHaveClass("eink-button--outlined");
  });

  it("applies the full-width modifier class when fullWidth is true", () => {
    render(<Button.Outlined fullWidth>Outlined</Button.Outlined>);
    expect(screen.getByRole("button")).toHaveClass("eink-button--full-width");
  });

  it("shows the hourglass icon and disables the button when loading", () => {
    render(<Button.Outlined loading>Saving</Button.Outlined>);
    const button = screen.getByRole("button", { name: "Saving" });
    expect(button).toHaveClass("eink-button--outlined", "eink-button--loading");
    expect(button).toBeDisabled();
    expect(button.querySelector("svg")).toBeInTheDocument();
  });
});

describe("Button.Naked", () => {
  it("applies the naked variant class", () => {
    render(<Button.Naked>Naked</Button.Naked>);
    expect(screen.getByRole("button")).toHaveClass("eink-button--naked");
  });

  it("applies the md size modifier class by default", () => {
    render(<Button.Naked>Naked</Button.Naked>);
    expect(screen.getByRole("button")).toHaveClass("eink-button--md");
  });

  it("applies the requested size modifier class", () => {
    render(<Button.Naked size="xl">Naked</Button.Naked>);
    expect(screen.getByRole("button")).toHaveClass("eink-button--xl");
  });
});

describe("Button.Icon", () => {
  it("renders an icon-only filled button with an accessible label", () => {
    render(<Button.Icon icon="trash" aria-label="Delete" />);
    const button = screen.getByRole("button", { name: "Delete" });
    expect(button).toHaveClass("eink-button--filled", "eink-button--icon", "eink-button--md");
    const icon = button.querySelector("svg");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("aria-hidden", "true");
  });

  it("applies the requested size modifier class", () => {
    render(<Button.Icon icon="trash" aria-label="Delete" size="sm" />);
    expect(screen.getByRole("button", { name: "Delete" })).toHaveClass("eink-button--sm");
  });
});

describe("Button.IconOutlined", () => {
  it("renders an icon-only outlined button", () => {
    render(<Button.IconOutlined icon="edit" aria-label="Edit" />);
    const button = screen.getByRole("button", { name: "Edit" });
    expect(button).toHaveClass("eink-button--outlined", "eink-button--icon", "eink-button--md");
  });
});

describe("Button.IconNaked", () => {
  it("renders an icon-only naked button", () => {
    render(<Button.IconNaked icon="close" aria-label="Close" />);
    const button = screen.getByRole("button", { name: "Close" });
    expect(button).toHaveClass("eink-button--naked", "eink-button--icon", "eink-button--md");
  });
});
