import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Todo } from "./todo.component";

describe("Todo", () => {
  it("renders the title when provided", () => {
    const { getByText } = render(
      <Todo title="Today">
        <Todo.Item id="water-plants">Water the plants</Todo.Item>
      </Todo>,
    );
    expect(getByText("Today")).toBeInTheDocument();
  });

  it("renders no title element when omitted", () => {
    const { container } = render(
      <Todo>
        <Todo.Item id="water-plants">Water the plants</Todo.Item>
      </Todo>,
    );
    expect(container.querySelector(".eink-todo__title")).toBeNull();
  });

  it("renders each item's children", () => {
    const { getByText } = render(
      <Todo>
        <Todo.Item id="water-plants">Water the plants</Todo.Item>
        <Todo.Item id="feed-cat">Feed the cat</Todo.Item>
      </Todo>,
    );
    expect(getByText("Water the plants")).toBeInTheDocument();
    expect(getByText("Feed the cat")).toBeInTheDocument();
  });

  it("starts unchecked by default", () => {
    const { getByRole } = render(
      <Todo>
        <Todo.Item id="water-plants">Water the plants</Todo.Item>
      </Todo>,
    );
    expect(getByRole("button")).toHaveAttribute("aria-pressed", "false");
  });

  it("starts checked when initialState is true", () => {
    const { getByRole } = render(
      <Todo>
        <Todo.Item id="water-plants" initialState>
          Water the plants
        </Todo.Item>
      </Todo>,
    );
    expect(getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  it("toggles checked state on click", () => {
    const { getByRole } = render(
      <Todo>
        <Todo.Item id="water-plants">Water the plants</Todo.Item>
      </Todo>,
    );
    const button = getByRole("button");
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(button);
    expect(button).toHaveAttribute("aria-pressed", "false");
  });

  it("shows the check icon only when checked", () => {
    const { getByRole, container } = render(
      <Todo>
        <Todo.Item id="water-plants">Water the plants</Todo.Item>
      </Todo>,
    );
    expect(container.querySelector(".eink-todo-item__icon")).toBeNull();
    fireEvent.click(getByRole("button"));
    expect(container.querySelector(".eink-todo-item__icon")).not.toBeNull();
  });

  it("calls onChange with the item's id and new state", () => {
    const onChange = vi.fn();
    const { getAllByRole } = render(
      <Todo onChange={onChange}>
        <Todo.Item id="water-plants">Water the plants</Todo.Item>
        <Todo.Item id="feed-cat">Feed the cat</Todo.Item>
      </Todo>,
    );
    fireEvent.click(getAllByRole("button")[1]);
    expect(onChange).toHaveBeenCalledWith("feed-cat", true);
  });

  it("calls onChange with the item's index when id is omitted", () => {
    const onChange = vi.fn();
    const { getAllByRole } = render(
      <Todo onChange={onChange}>
        <Todo.Item>Water the plants</Todo.Item>
        <Todo.Item>Feed the cat</Todo.Item>
      </Todo>,
    );
    fireEvent.click(getAllByRole("button")[1]);
    expect(onChange).toHaveBeenCalledWith(1, true);
  });

  it("merges a custom className", () => {
    const { container } = render(
      <Todo className="custom">
        <Todo.Item id="water-plants">Water the plants</Todo.Item>
      </Todo>,
    );
    expect(container.querySelector(".eink-todo")).toHaveClass("custom");
  });
});
