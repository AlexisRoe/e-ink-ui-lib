import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Avatar } from "./avatar.component";

describe("Avatar", () => {
  it("renders up to two uppercase initials from userName", () => {
    const { getByText } = render(<Avatar userName="ada lovelace" />);
    expect(getByText("AL")).toBeInTheDocument();
  });

  it("renders a single initial for a one-word name", () => {
    const { getByText } = render(<Avatar userName="ada" />);
    expect(getByText("A")).toBeInTheDocument();
  });

  it("ignores extra words beyond the first two", () => {
    const { getByText } = render(<Avatar userName="ada lovelace byron" />);
    expect(getByText("AL")).toBeInTheDocument();
  });

  it("applies the size modifier class", () => {
    const { container } = render(<Avatar userName="Ada Lovelace" size="xl" />);
    expect(container.firstChild).toHaveClass("eink-avatar--xl");
  });

  it("defaults to the md size", () => {
    const { container } = render(<Avatar userName="Ada Lovelace" />);
    expect(container.firstChild).toHaveClass("eink-avatar--md");
  });

  it("renders a notification badge when notification is true", () => {
    const { container } = render(<Avatar userName="Ada Lovelace" notification />);
    expect(container.querySelector(".eink-avatar__notification")).not.toBeNull();
  });

  it("does not render a notification badge by default", () => {
    const { container } = render(<Avatar userName="Ada Lovelace" />);
    expect(container.querySelector(".eink-avatar__notification")).toBeNull();
  });

  it("merges a custom className", () => {
    const { container } = render(<Avatar userName="Ada Lovelace" className="custom" />);
    expect(container.firstChild).toHaveClass("custom");
  });
});

describe("Avatar.Profile", () => {
  it("renders an image when src is provided", () => {
    const { container, queryByText } = render(
      <Avatar.Profile userName="Ada Lovelace" src="https://example.com/ada.jpg" />,
    );
    const img = container.querySelector("img");
    expect(img).not.toBeNull();
    expect(img).toHaveAttribute("src", "https://example.com/ada.jpg");
    expect(img).toHaveAttribute("alt", "Ada Lovelace");
    expect(queryByText("AL")).not.toBeInTheDocument();
  });

  it("renders a fallback user icon on a black background when src is omitted", () => {
    const { container } = render(<Avatar.Profile userName="Ada Lovelace" />);
    expect(container.querySelector("img")).toBeNull();
    expect(container.querySelector(".eink-avatar--fallback")).not.toBeNull();
    expect(container.querySelector(".eink-avatar__fallback-icon")).not.toBeNull();
  });

  it("does not apply the mono class by default", () => {
    const { container } = render(
      <Avatar.Profile userName="Ada Lovelace" src="https://example.com/ada.jpg" />,
    );
    expect(container.querySelector("img")).not.toHaveClass("eink-avatar__image--mono");
  });

  it("applies the mono class when mono is true", () => {
    const { container } = render(
      <Avatar.Profile userName="Ada Lovelace" src="https://example.com/ada.jpg" mono />,
    );
    expect(container.querySelector("img")).toHaveClass("eink-avatar__image--mono");
  });

  it("applies the size modifier class", () => {
    const { container } = render(
      <Avatar.Profile userName="Ada Lovelace" src="https://example.com/ada.jpg" size="xl" />,
    );
    expect(container.firstChild).toHaveClass("eink-avatar--xl");
  });

  it("defaults to the md size", () => {
    const { container } = render(<Avatar.Profile userName="Ada Lovelace" />);
    expect(container.firstChild).toHaveClass("eink-avatar--md");
  });

  it("renders a notification badge when notification is true", () => {
    const { container } = render(<Avatar.Profile userName="Ada Lovelace" notification />);
    expect(container.querySelector(".eink-avatar__notification")).not.toBeNull();
  });

  it("merges a custom className", () => {
    const { container } = render(<Avatar.Profile userName="Ada Lovelace" className="custom" />);
    expect(container.firstChild).toHaveClass("custom");
  });
});
