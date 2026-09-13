import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Navigation } from "./navigation.component";

function renderNavigation(onSelect?: (target: string, index: number) => void) {
  return render(
    <Navigation onSelect={onSelect}>
      <Navigation.Item target="/" icon="home" label="Home" />
      <Navigation.Item label="Products">
        <Navigation.Item target="/products/new" label="New" />
        <Navigation.Item target="/products/archived" label="Archived" />
      </Navigation.Item>
      <Navigation.Item target="/settings" label="Settings" />
    </Navigation>,
  );
}

describe("Navigation", () => {
  it("renders each top-level item as a menuitem", () => {
    renderNavigation();
    expect(screen.getByText("Home").closest("[role='menuitem']")).not.toBeNull();
    expect(screen.getByText("Products").closest("[role='menuitem']")).not.toBeNull();
    expect(screen.getByText("Settings").closest("[role='menuitem']")).not.toBeNull();
  });

  it("does not render the submenu until opened", () => {
    renderNavigation();
    expect(screen.queryByText("New")).toBeNull();
  });

  it("calls onSelect with the target and index of a clicked leaf item", () => {
    const onSelect = vi.fn();
    renderNavigation(onSelect);

    fireEvent.click(screen.getByText("Settings"));

    expect(onSelect).toHaveBeenCalledWith("/settings", 2);
  });

  it("opens a submenu on click instead of calling onSelect", () => {
    const onSelect = vi.fn();
    renderNavigation(onSelect);

    fireEvent.click(screen.getByText("Products"));

    expect(screen.getByText("New")).not.toBeNull();
    expect(onSelect).not.toHaveBeenCalled();
  });

  it("calls onSelect with the target and index of a clicked submenu item", () => {
    const onSelect = vi.fn();
    renderNavigation(onSelect);

    fireEvent.click(screen.getByText("Products"));
    fireEvent.click(screen.getByText("Archived"));

    expect(onSelect).toHaveBeenCalledWith("/products/archived", 1);
  });

  it("opens a submenu with the perpendicular arrow key and focuses its first item", () => {
    renderNavigation();

    screen.getByText("Products").focus();
    fireEvent.keyDown(screen.getByText("Products"), { key: "ArrowRight" });

    expect(screen.getByText("New")).not.toBeNull();
    expect(screen.getByText("New").closest("button")).toHaveFocus();
  });

  it("closes an open submenu on Escape and refocuses the trigger", () => {
    renderNavigation();

    const trigger = screen.getByText("Products").closest("button") as HTMLButtonElement;
    trigger.focus();
    fireEvent.keyDown(trigger, { key: "ArrowRight" });
    fireEvent.keyDown(screen.getByText("New"), { key: "Escape" });

    expect(screen.queryByText("New")).toBeNull();
    expect(trigger).toHaveFocus();
  });

  it("moves focus between siblings with arrow keys", () => {
    renderNavigation();

    const home = screen.getByText("Home").closest("button") as HTMLButtonElement;
    home.focus();
    fireEvent.keyDown(home, { key: "ArrowDown" });

    expect(screen.getByText("Products").closest("button")).toHaveFocus();
  });
});
