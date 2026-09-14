import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { DropdownMenu } from "./dropdown-menu.component";

describe("DropdownMenu", () => {
  it("opens the menu when the trigger is clicked and shows its items", () => {
    render(
      <DropdownMenu label="Actions">
        <DropdownMenu.Item id="edit">Edit</DropdownMenu.Item>
      </DropdownMenu>,
    );

    expect(screen.queryByRole("menuitem", { name: "Edit" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /actions/i }));

    expect(screen.getByRole("menuitem", { name: "Edit" })).toBeInTheDocument();
  });

  it("calls onSelect with the clicked item's id and closes the menu", () => {
    const onSelect = vi.fn();
    render(
      <DropdownMenu label="Actions" onSelect={onSelect}>
        <DropdownMenu.Item id="edit">Edit</DropdownMenu.Item>
      </DropdownMenu>,
    );

    fireEvent.click(screen.getByRole("button", { name: /actions/i }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Edit" }));

    expect(onSelect).toHaveBeenCalledWith("edit");
    expect(screen.queryByRole("menuitem", { name: "Edit" })).not.toBeInTheDocument();
  });

  it("does not call onSelect when a disabled item is clicked", () => {
    const onSelect = vi.fn();
    render(
      <DropdownMenu label="Actions" onSelect={onSelect}>
        <DropdownMenu.Item id="delete" disabled>
          Delete
        </DropdownMenu.Item>
      </DropdownMenu>,
    );

    fireEvent.click(screen.getByRole("button", { name: /actions/i }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Delete" }));

    expect(onSelect).not.toHaveBeenCalled();
  });

  it("groups items with DropdownMenu.Group", () => {
    render(
      <DropdownMenu label="Actions">
        <DropdownMenu.Group>
          <DropdownMenu.Item id="cut">Cut</DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Group>
          <DropdownMenu.Item id="copy">Copy</DropdownMenu.Item>
        </DropdownMenu.Group>
      </DropdownMenu>,
    );

    fireEvent.click(screen.getByRole("button", { name: /actions/i }));

    expect(screen.getAllByRole("group")).toHaveLength(2);
  });

  it("opens a submenu instead of calling onSelect when an item nests items", () => {
    const onSelect = vi.fn();
    render(
      <DropdownMenu label="Actions" onSelect={onSelect}>
        <DropdownMenu.Item id="share">
          Share
          <DropdownMenu.Item id="share-link">Copy link</DropdownMenu.Item>
        </DropdownMenu.Item>
      </DropdownMenu>,
    );

    fireEvent.click(screen.getByRole("button", { name: /actions/i }));
    expect(screen.queryByRole("menuitem", { name: "Copy link" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("menuitem", { name: "Share" }));
    expect(screen.getByRole("menuitem", { name: "Copy link" })).toBeInTheDocument();
    expect(onSelect).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("menuitem", { name: "Copy link" }));
    expect(onSelect).toHaveBeenCalledWith("share-link");
  });

  it("shows the keys hint next to a leaf item", () => {
    render(
      <DropdownMenu label="Actions">
        <DropdownMenu.Item id="copy" keys="⌘C">
          Copy
        </DropdownMenu.Item>
      </DropdownMenu>,
    );

    fireEvent.click(screen.getByRole("button", { name: /actions/i }));

    expect(screen.getByText("⌘C")).toBeInTheDocument();
  });

  it("closes the menu when clicking outside", () => {
    render(
      <div>
        <DropdownMenu label="Actions">
          <DropdownMenu.Item id="edit">Edit</DropdownMenu.Item>
        </DropdownMenu>
        <button type="button">Outside</button>
      </div>,
    );

    fireEvent.click(screen.getByRole("button", { name: /actions/i }));
    expect(screen.getByRole("menuitem", { name: "Edit" })).toBeInTheDocument();

    fireEvent.mouseDown(screen.getByRole("button", { name: "Outside" }));
    expect(screen.queryByRole("menuitem", { name: "Edit" })).not.toBeInTheDocument();
  });
});
