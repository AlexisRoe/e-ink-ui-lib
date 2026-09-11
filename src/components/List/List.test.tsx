import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { List, ListItem } from "./List.component";

describe("List", () => {
  it("renders a ul by default", () => {
    render(
      <List>
        <List.Item>First</List.Item>
      </List>,
    );
    expect(screen.getByRole("list").tagName).toBe("UL");
    expect(screen.getByRole("list")).toHaveClass("eink-list--unordered");
  });

  it("renders an ol when as='ordered'", () => {
    render(
      <List as="ordered">
        <List.Item>First</List.Item>
      </List>,
    );
    expect(screen.getByRole("list").tagName).toBe("OL");
    expect(screen.getByRole("list")).toHaveClass("eink-list--ordered");
  });

  it("exports ListItem as a standalone component", () => {
    render(
      <List>
        <ListItem>First</ListItem>
      </List>,
    );
    expect(screen.getByText("First").tagName).toBe("LI");
  });

  it("renders a title and description for the detailed variant", () => {
    render(
      <List as="detailed">
        <List.Item title="Annual report" description="Finance · 2026" />
      </List>,
    );
    expect(screen.getByRole("list")).toHaveClass("eink-list--detailed");
    const title = screen.getByText("Annual report");
    const description = screen.getByText("Finance · 2026");
    expect(title).toHaveClass("eink-list__item-title");
    expect(description).toHaveClass("eink-list__item-description");
  });
});
