import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Link } from "./link.component";

describe("Link", () => {
  it("renders the children", () => {
    const { getByText } = render(<Link href="/about">About</Link>);
    expect(getByText("About")).toBeInTheDocument();
  });

  it("renders as an anchor with the given href", () => {
    const { getByText } = render(<Link href="/about">About</Link>);
    expect(getByText("About").closest("a")).toHaveAttribute("href", "/about");
  });

  it("does not open in a new tab by default", () => {
    const { getByText } = render(<Link href="/about">About</Link>);
    const anchor = getByText("About").closest("a");
    expect(anchor).not.toHaveAttribute("target");
    expect(anchor).not.toHaveAttribute("rel");
  });

  it("does not render the icon by default", () => {
    const { container } = render(<Link href="/about">About</Link>);
    expect(container.querySelector(".eink-link__icon")).toBeNull();
  });

  it("opens in a new tab with rel protection when external", () => {
    const { getByText } = render(
      <Link href="https://example.com" external>
        Example
      </Link>,
    );
    const anchor = getByText("Example").closest("a");
    expect(anchor).toHaveAttribute("target", "_blank");
    expect(anchor).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("renders the external-link icon when external", () => {
    const { container } = render(
      <Link href="https://example.com" external>
        Example
      </Link>,
    );
    expect(container.querySelector(".eink-link__icon")).not.toBeNull();
  });

  it("is not marked as clicked by default", () => {
    const { getByText } = render(<Link href="/about">About</Link>);
    expect(getByText("About").closest("a")).not.toHaveClass("eink-link--clicked");
  });

  it("applies the clicked modifier class when alreadyClicked", () => {
    const { getByText } = render(
      <Link href="/about" alreadyClicked>
        About
      </Link>,
    );
    expect(getByText("About").closest("a")).toHaveClass("eink-link--clicked");
  });

  it("does not apply the mono class by default", () => {
    const { getByText } = render(<Link href="/about">About</Link>);
    expect(getByText("About").closest("a")).not.toHaveClass("eink-link--mono");
  });

  it("applies the mono class when mono is true", () => {
    const { getByText } = render(
      <Link href="/about" alreadyClicked mono>
        About
      </Link>,
    );
    expect(getByText("About").closest("a")).toHaveClass("eink-link--mono");
  });

  it("is not disabled by default", () => {
    const { getByText } = render(<Link href="/about">About</Link>);
    const anchor = getByText("About").closest("a");
    expect(anchor).not.toHaveClass("eink-link--disabled");
    expect(anchor).toHaveAttribute("href", "/about");
  });

  it("applies the disabled modifier class and removes href when disabled", () => {
    const { getByText } = render(
      <Link href="/about" disabled>
        About
      </Link>,
    );
    const anchor = getByText("About").closest("a");
    expect(anchor).toHaveClass("eink-link--disabled");
    expect(anchor).not.toHaveAttribute("href");
    expect(anchor).toHaveAttribute("aria-disabled", "true");
    expect(anchor).toHaveAttribute("tabIndex", "-1");
  });

  it("prevents onClick from firing when disabled", () => {
    const onClick = vi.fn();
    const { getByText } = render(
      <Link href="/about" disabled onClick={onClick}>
        About
      </Link>,
    );
    fireEvent.click(getByText("About"));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("merges a custom className", () => {
    const { getByText } = render(
      <Link href="/about" className="custom">
        About
      </Link>,
    );
    expect(getByText("About").closest("a")).toHaveClass("custom");
  });
});
