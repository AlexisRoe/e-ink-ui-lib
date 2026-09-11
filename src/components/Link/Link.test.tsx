import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Link } from "./Link.component";

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

  it("merges a custom className", () => {
    const { getByText } = render(
      <Link href="/about" className="custom">
        About
      </Link>,
    );
    expect(getByText("About").closest("a")).toHaveClass("custom");
  });
});
