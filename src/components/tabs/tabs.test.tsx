import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Tabs } from "./tabs.component";

function renderTabs(props: Partial<React.ComponentProps<typeof Tabs>> = {}) {
  return render(
    <Tabs {...props}>
      <Tabs.Item id="overview">Overview</Tabs.Item>
      <Tabs.Item id="details">Details</Tabs.Item>
      <Tabs.Item id="billing">Billing</Tabs.Item>
      <Tabs.Content id="overview">Overview content</Tabs.Content>
      <Tabs.Content id="details">Details content</Tabs.Content>
      <Tabs.Content id="billing">Billing content</Tabs.Content>
    </Tabs>,
  );
}

describe("Tabs", () => {
  it("selects the first item by default when defaultId is omitted", () => {
    renderTabs();
    expect(screen.getByText("Overview content")).toBeInTheDocument();
    expect(screen.queryByText("Details content")).not.toBeInTheDocument();
  });

  it("shows the content matching defaultId", () => {
    renderTabs({ defaultId: "billing" });
    expect(screen.getByText("Billing content")).toBeInTheDocument();
    expect(screen.queryByText("Overview content")).not.toBeInTheDocument();
  });

  it("switches content when a different tab is clicked", () => {
    renderTabs();
    fireEvent.click(screen.getByText("Details"));

    expect(screen.getByText("Details content")).toBeInTheDocument();
    expect(screen.queryByText("Overview content")).not.toBeInTheDocument();
  });

  it("calls onChange with the clicked tab's id", () => {
    const onChange = vi.fn();
    renderTabs({ onChange });

    fireEvent.click(screen.getByText("Billing"));

    expect(onChange).toHaveBeenCalledWith("billing");
  });

  it("renders the tab row as a nav and the content as a card", () => {
    renderTabs();
    expect(screen.getByText("Overview").closest("nav")).toHaveClass("eink-segmented");
    expect(screen.getByText("Overview content")).toHaveClass("eink-card", "eink-tabs__content");
  });

  it("does not apply the full-height class by default", () => {
    const { container } = renderTabs();
    expect(container.querySelector(".eink-tabs")).not.toHaveClass("eink-tabs--full-height");
  });

  it("applies the full-height class when fullHeight is true", () => {
    const { container } = renderTabs({ fullHeight: true });
    expect(container.querySelector(".eink-tabs")).toHaveClass("eink-tabs--full-height");
  });
});
