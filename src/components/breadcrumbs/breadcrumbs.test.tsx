import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { BreadCrumbs } from "./breadcrumbs.component";

function renderBreadCrumbs(onNavigate?: (target: string) => void) {
  return render(
    <BreadCrumbs onNavigate={onNavigate}>
      <BreadCrumbs.Item target="/">Home</BreadCrumbs.Item>
      <BreadCrumbs.Item target="/settings">Settings</BreadCrumbs.Item>
      <BreadCrumbs.Item target="/settings/profile">Profile</BreadCrumbs.Item>
    </BreadCrumbs>,
  );
}

describe("BreadCrumbs", () => {
  it("renders each item as a button", () => {
    renderBreadCrumbs();
    expect(screen.getByText("Home").closest("button")).not.toBeNull();
    expect(screen.getByText("Profile").closest("button")).not.toBeNull();
  });

  it("renders a separator between items but not before the first", () => {
    renderBreadCrumbs();
    expect(screen.getAllByText("/")).toHaveLength(2);
  });

  it("renders a home icon only in front of the first item", () => {
    renderBreadCrumbs();
    const items = screen.getAllByRole("button");
    expect(items[0].querySelector("svg")).not.toBeNull();
    expect(items[1].querySelector("svg")).toBeNull();
    expect(items[2].querySelector("svg")).toBeNull();
  });

  it("calls onNavigate with the target of the clicked item", () => {
    const onNavigate = vi.fn();
    renderBreadCrumbs(onNavigate);

    fireEvent.click(screen.getByText("Settings"));

    expect(onNavigate).toHaveBeenCalledWith("/settings");
  });
});
