import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { OrderList } from "./order-list.component";

const items = ["Plan", "Build", "Test"];

function renderList(overrides: Partial<Parameters<typeof OrderList<string>>[0]> = {}) {
  const onChange = vi.fn();
  render(
    <OrderList
      items={items}
      onChange={onChange}
      getKey={(item) => item}
      renderItem={(item) => item}
      {...overrides}
    />,
  );
  return onChange;
}

describe("OrderList", () => {
  it("renders the items as an ordered list", () => {
    renderList();
    expect(screen.getByRole("list").tagName).toBe("OL");
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("reports the new order when moving up and down", () => {
    const onChange = renderList();
    fireEvent.click(screen.getByRole("button", { name: "Move item 2 up" }));
    expect(onChange).toHaveBeenLastCalledWith(["Build", "Plan", "Test"]);
    fireEvent.click(screen.getByRole("button", { name: "Move item 2 down" }));
    expect(onChange).toHaveBeenLastCalledWith(["Plan", "Test", "Build"]);
  });

  it("disables the first up and the last down button", () => {
    renderList();
    expect(screen.getByRole("button", { name: "Move item 1 up" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Move item 3 down" })).toBeDisabled();
  });

  it("disables every button when disabled", () => {
    renderList({ disabled: true });
    for (const button of screen.getAllByRole("button")) {
      expect(button).toBeDisabled();
    }
  });

  it("uses custom labels and renders a suffix", () => {
    renderList({
      labels: { moveUp: (item) => `${item} nach oben`, moveDown: (item) => `${item} nach unten` },
      renderSuffix: (item) => <span>{`ok ${item}`}</span>,
    });
    expect(screen.getByRole("button", { name: "Build nach oben" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Build nach unten" })).toBeInTheDocument();
    expect(screen.getByText("ok Plan")).toBeInTheDocument();
  });
});
