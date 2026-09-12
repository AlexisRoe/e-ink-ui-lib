import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Card } from "./card.component";

describe("Card", () => {
  it("renders header, title, subtitle, and content", () => {
    render(
      <Card>
        <Card.Header>
          <Card.Title>Annual report</Card.Title>
          <Card.Subtitle>Finance · 2026</Card.Subtitle>
        </Card.Header>
        <Card.Content>Full year results are now available.</Card.Content>
      </Card>,
    );

    const title = screen.getByText("Annual report");
    const subtitle = screen.getByText("Finance · 2026");
    const content = screen.getByText("Full year results are now available.");

    expect(title.tagName).toBe("H3");
    expect(title).toHaveClass("eink-card__title");
    expect(subtitle).toHaveClass("eink-card__subtitle");
    expect(content).toHaveClass("eink-card__content");
    expect(content.previousElementSibling).toHaveClass("eink-card__header");
  });

  it("applies a custom className alongside the base class", () => {
    render(<Card className="custom">Body</Card>);
    expect(screen.getByText("Body")).toHaveClass("eink-card", "custom");
  });

  it("renders a subcomponent used standalone", () => {
    render(<Card.Content>Standalone content</Card.Content>);
    expect(screen.getByText("Standalone content")).toHaveClass("eink-card__content");
  });

  it("renders a Card.Action as a Button on the right side of the header", () => {
    const onClick = vi.fn();
    render(
      <Card.Header>
        <Card.Title>Annual report</Card.Title>
        <Card.Action onClick={onClick} iconLeft="download">
          Download
        </Card.Action>
      </Card.Header>,
    );

    const button = screen.getByRole("button", { name: "Download" });
    expect(button).toHaveClass("eink-button--filled");
    expect(button.closest(".eink-card__header-action")).not.toBeNull();
    expect(screen.getByText("Annual report").closest(".eink-card__header-text")).not.toBeNull();

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("omits the action wrapper when no Card.Action is provided", () => {
    render(
      <Card.Header>
        <Card.Title>Annual report</Card.Title>
      </Card.Header>,
    );
    expect(document.querySelector(".eink-card__header-action")).toBeNull();
  });

  it("renders a Card.Ribbon", () => {
    render(
      <Card>
        <Card.Ribbon>New</Card.Ribbon>
        <Card.Content>Body</Card.Content>
      </Card>,
    );
    expect(screen.getByText("New")).toHaveClass("eink-card__ribbon");
  });
});
