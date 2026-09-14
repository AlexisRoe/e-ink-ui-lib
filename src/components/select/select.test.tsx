import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Form } from "../form/form.component";
import { Select } from "./select.component";

describe("Select", () => {
  it("shows the placeholder when nothing is selected", () => {
    render(
      <Select label="Fruit" placeholder="Pick…">
        <Select.Option value="apple">Apple</Select.Option>
        <Select.Option value="banana">Banana</Select.Option>
      </Select>,
    );
    expect(screen.getByRole("button", { name: "Pick…" })).toBeInTheDocument();
  });

  it("opens the listbox and selects an option, closing afterwards", () => {
    const onChange = vi.fn();
    render(
      <Select label="Fruit" placeholder="Pick…" onChange={onChange}>
        <Select.Option value="apple">Apple</Select.Option>
        <Select.Option value="banana">Banana</Select.Option>
      </Select>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Pick…" }));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("option", { name: "Banana" }));
    expect(onChange).toHaveBeenCalledWith("banana");
    expect(screen.getByRole("button", { name: "Banana" })).toBeInTheDocument();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("supports preselecting via defaultValue", () => {
    render(
      <Select label="Fruit" placeholder="Pick…" defaultValue="apple">
        <Select.Option value="apple">Apple</Select.Option>
        <Select.Option value="banana">Banana</Select.Option>
      </Select>,
    );
    expect(screen.getByRole("button", { name: "Apple" })).toBeInTheDocument();
  });

  it("supports grouped options", () => {
    render(
      <Select label="Fruit" placeholder="Pick…">
        <Select.Group label="Common">
          <Select.Option value="apple">Apple</Select.Option>
        </Select.Group>
        <Select.Group label="Rare">
          <Select.Option value="dragonfruit">Dragonfruit</Select.Option>
        </Select.Group>
      </Select>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Pick…" }));
    expect(screen.getByRole("option", { name: "Dragonfruit" })).toBeInTheDocument();
  });

  it("multi-selects options, keeps the list open, and reports a count", () => {
    const onChange = vi.fn();
    render(
      <Select label="Fruit" placeholder="Pick…" multiple onChange={onChange}>
        <Select.Option value="apple">Apple</Select.Option>
        <Select.Option value="banana">Banana</Select.Option>
      </Select>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Pick…" }));
    fireEvent.click(screen.getByRole("option", { name: "Apple" }));
    expect(onChange).toHaveBeenCalledWith(["apple"]);
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("option", { name: "Banana" }));
    expect(onChange).toHaveBeenLastCalledWith(["apple", "banana"]);
    expect(screen.getByRole("button", { name: "2 selected" })).toBeInTheDocument();
  });

  it("blocks a required Form field until an option is selected", () => {
    const onSubmit = vi.fn();
    render(
      <Form initialValues={{ fruit: "" }} onSubmit={onSubmit}>
        <Select name="fruit" label="Fruit" placeholder="Pick…" required>
          <Select.Option value="apple">Apple</Select.Option>
        </Select>
        <Form.SubmitButton>Save</Form.SubmitButton>
      </Form>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onSubmit).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Pick…" }));
    fireEvent.click(screen.getByRole("option", { name: "Apple" }));

    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onSubmit).toHaveBeenCalledWith({ fruit: "apple" }, expect.anything());
  });

  it("does not open when disabled", () => {
    render(
      <Select label="Fruit" placeholder="Pick…" disabled>
        <Select.Option value="apple">Apple</Select.Option>
      </Select>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Pick…" }));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
