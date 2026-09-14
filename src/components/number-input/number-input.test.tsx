import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Form } from "../form/form.component";
import { NumberInput } from "./number-input.component";

describe("NumberInput", () => {
  it("increments and decrements by the default integer step", () => {
    const onChange = vi.fn();
    render(<NumberInput label="Quantity" defaultValue={5} onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Increase" }));
    expect(onChange).toHaveBeenLastCalledWith(6);

    fireEvent.click(screen.getByRole("button", { name: "Decrease" }));
    fireEvent.click(screen.getByRole("button", { name: "Decrease" }));
    expect(onChange).toHaveBeenLastCalledWith(4);
  });

  it("clamps to min and max, disabling the respective button at the bound", () => {
    const onChange = vi.fn();
    render(<NumberInput label="Quantity" defaultValue={1} min={0} max={1} onChange={onChange} />);

    expect(screen.getByRole("button", { name: "Increase" })).toBeDisabled();
    fireEvent.click(screen.getByRole("button", { name: "Decrease" }));
    expect(onChange).toHaveBeenLastCalledWith(0);
    expect(screen.getByRole("button", { name: "Decrease" })).toBeDisabled();
  });

  it("formats a float value with a comma and two decimal places", () => {
    render(<NumberInput label="Amount" useFloat defaultValue={5} />);
    expect(screen.getByRole("spinbutton")).toHaveTextContent("5,00");

    fireEvent.click(screen.getByRole("button", { name: "Increase" }));
    expect(screen.getByRole("spinbutton")).toHaveTextContent("5,10");
  });

  it("shows zero bare, without a decimal, even when useFloat is set", () => {
    render(<NumberInput label="Amount" useFloat defaultValue={0} />);
    expect(screen.getByRole("spinbutton")).toHaveTextContent("0");
  });

  it("steps via ArrowUp/ArrowDown on the spinbutton", () => {
    const onChange = vi.fn();
    render(<NumberInput label="Quantity" defaultValue={5} onChange={onChange} />);

    fireEvent.keyDown(screen.getByRole("spinbutton"), { key: "ArrowUp" });
    expect(onChange).toHaveBeenLastCalledWith(6);

    fireEvent.keyDown(screen.getByRole("spinbutton"), { key: "ArrowDown" });
    expect(onChange).toHaveBeenLastCalledWith(5);
  });

  it("does not respond to interaction when disabled", () => {
    const onChange = vi.fn();
    render(<NumberInput label="Quantity" defaultValue={5} disabled onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Increase" }));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("binds to a Form via name", () => {
    const onSubmit = vi.fn();
    render(
      <Form initialValues={{ quantity: 2 }} onSubmit={onSubmit}>
        <NumberInput name="quantity" label="Quantity" />
        <Form.SubmitButton>Save</Form.SubmitButton>
      </Form>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Increase" }));
    expect(screen.getByRole("spinbutton")).toHaveTextContent("3");

    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onSubmit).toHaveBeenCalledWith({ quantity: 3 }, expect.anything());
  });

  it("associates the label with the spinbutton", () => {
    render(<NumberInput label="Quantity" defaultValue={5} />);
    expect(screen.getByRole("spinbutton", { name: "Quantity" })).toBeInTheDocument();
  });
});
