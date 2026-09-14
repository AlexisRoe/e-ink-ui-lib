import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Form } from "../form/form.component";
import { Keypad } from "./keypad.component";

describe("Keypad", () => {
  it("appends digits up to maxLength", () => {
    const onChange = vi.fn();
    render(<Keypad label="Quantity" maxLength={2} onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "1" }));
    fireEvent.click(screen.getByRole("button", { name: "2" }));
    fireEvent.click(screen.getByRole("button", { name: "3" }));

    expect(onChange).toHaveBeenNthCalledWith(1, "1");
    expect(onChange).toHaveBeenNthCalledWith(2, "12");
    expect(onChange).toHaveBeenCalledTimes(2);
  });

  it("clears and deletes the last digit", () => {
    const onChange = vi.fn();
    render(<Keypad label="Quantity" maxLength={4} defaultValue="12" onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Backspace" }));
    expect(onChange).toHaveBeenLastCalledWith("1");

    fireEvent.click(screen.getByRole("button", { name: "C" }));
    expect(onChange).toHaveBeenLastCalledWith("");
  });

  it("shows the current value in the display when enabled", () => {
    render(<Keypad label="Quantity" maxLength={4} defaultValue="42" display />);
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("supports a decimal point when allowDecimal is set, once per value", () => {
    const onChange = vi.fn();
    render(<Keypad label="Amount" maxLength={4} allowDecimal onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "1" }));
    fireEvent.click(screen.getByRole("button", { name: "." }));
    fireEvent.click(screen.getByRole("button", { name: "5" }));
    fireEvent.click(screen.getByRole("button", { name: "." }));

    expect(onChange).toHaveBeenNthCalledWith(1, "1");
    expect(onChange).toHaveBeenNthCalledWith(2, "1.");
    expect(onChange).toHaveBeenNthCalledWith(3, "1.5");
    expect(onChange).toHaveBeenCalledTimes(3);
  });

  it("does not render a decimal key by default", () => {
    render(<Keypad label="Quantity" maxLength={4} />);
    expect(screen.queryByRole("button", { name: "." })).not.toBeInTheDocument();
  });

  it("does not respond to key presses when disabled", () => {
    const onChange = vi.fn();
    render(<Keypad label="Quantity" maxLength={4} disabled onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "1" }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("binds to a Form via name", () => {
    const onSubmit = vi.fn();
    render(
      <Form initialValues={{ pin: "" }} onSubmit={onSubmit}>
        <Keypad name="pin" label="PIN" maxLength={4} display />
        <Form.SubmitButton>Save</Form.SubmitButton>
      </Form>,
    );

    fireEvent.click(screen.getByRole("button", { name: "9" }));
    fireEvent.click(screen.getByRole("button", { name: "9" }));
    expect(screen.getByText("99")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onSubmit).toHaveBeenCalledWith({ pin: "99" }, expect.anything());
  });

  it("associates the label with the group", () => {
    render(<Keypad label="Quantity" maxLength={4} />);
    expect(screen.getByRole("group", { name: "Quantity" })).toBeInTheDocument();
  });
});
