import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Form } from "../form/form.component";
import { Checkbox } from "./checkbox.component";

describe("Checkbox", () => {
  it("renders unchecked by default with its children as the label", () => {
    render(<Checkbox checked={false}>Accept terms</Checkbox>);
    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });
    expect(checkbox).not.toBeChecked();
  });

  it("calls onChange with the flipped value when clicked (controlled)", () => {
    const onChange = vi.fn();
    render(
      <Checkbox checked={false} onChange={onChange}>
        Accept terms
      </Checkbox>,
    );

    fireEvent.click(screen.getByRole("checkbox", { name: "Accept terms" }));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("toggles its own checked state when used as an uncontrolled component", () => {
    render(<Checkbox defaultChecked={false}>Accept terms</Checkbox>);

    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });
    expect(checkbox).not.toBeChecked();
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
  });

  it("binds to the enclosing Form via name, reading and updating the field value", () => {
    const onSubmit = vi.fn();
    render(
      <Form initialValues={{ terms: false }} onSubmit={onSubmit}>
        <Checkbox name="terms">Accept terms</Checkbox>
        <Form.SubmitButton>Save</Form.SubmitButton>
      </Form>,
    );

    const checkbox = screen.getByRole("checkbox", { name: "Accept terms" });
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onSubmit).toHaveBeenCalledWith({ terms: true }, expect.anything());
  });

  it("does not toggle when disabled", () => {
    const onChange = vi.fn();
    render(
      <Checkbox checked={false} onChange={onChange} disabled>
        Accept terms
      </Checkbox>,
    );

    fireEvent.click(screen.getByRole("checkbox", { name: "Accept terms" }));
    expect(onChange).not.toHaveBeenCalled();
  });

  describe("Checkbox.Group", () => {
    it("tracks multiple checked values, standalone", () => {
      const onChange = vi.fn();
      render(
        <Checkbox.Group label="Toppings" onChange={onChange}>
          <Checkbox value="cheese">Cheese</Checkbox>
          <Checkbox value="olives">Olives</Checkbox>
        </Checkbox.Group>,
      );

      fireEvent.click(screen.getByRole("checkbox", { name: "Cheese" }));
      expect(onChange).toHaveBeenLastCalledWith(["cheese"]);

      fireEvent.click(screen.getByRole("checkbox", { name: "Olives" }));
      expect(onChange).toHaveBeenLastCalledWith(["cheese", "olives"]);

      fireEvent.click(screen.getByRole("checkbox", { name: "Cheese" }));
      expect(onChange).toHaveBeenLastCalledWith(["olives"]);
    });

    it("binds to the enclosing Form via name", () => {
      const onSubmit = vi.fn();
      render(
        <Form initialValues={{ toppings: ["cheese"] }} onSubmit={onSubmit}>
          <Checkbox.Group label="Toppings" name="toppings">
            <Checkbox value="cheese">Cheese</Checkbox>
            <Checkbox value="olives">Olives</Checkbox>
          </Checkbox.Group>
          <Form.SubmitButton>Save</Form.SubmitButton>
        </Form>,
      );

      expect(screen.getByRole("checkbox", { name: "Cheese" })).toBeChecked();
      fireEvent.click(screen.getByRole("checkbox", { name: "Olives" }));

      fireEvent.click(screen.getByRole("button", { name: "Save" }));
      expect(onSubmit).toHaveBeenCalledWith({ toppings: ["cheese", "olives"] }, expect.anything());
    });

    it("associates the label with the group", () => {
      render(
        <Checkbox.Group label="Toppings">
          <Checkbox value="cheese">Cheese</Checkbox>
        </Checkbox.Group>,
      );
      expect(screen.getByRole("group", { name: "Toppings" })).toBeInTheDocument();
    });

    it("disables every item in the group when the group is disabled", () => {
      render(
        <Checkbox.Group label="Toppings" disabled>
          <Checkbox value="cheese">Cheese</Checkbox>
        </Checkbox.Group>,
      );
      expect(screen.getByRole("checkbox", { name: "Cheese" })).toBeDisabled();
    });
  });
});
