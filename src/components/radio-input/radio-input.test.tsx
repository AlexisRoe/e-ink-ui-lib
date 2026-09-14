import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Form } from "../form/form.component";
import { RadioInput } from "./radio-input.component";

describe("RadioInput.Group", () => {
  it("selects one option at a time, standalone", () => {
    const onChange = vi.fn();
    render(
      <RadioInput.Group label="Size" onChange={onChange}>
        <RadioInput value="s">Small</RadioInput>
        <RadioInput value="m">Medium</RadioInput>
      </RadioInput.Group>,
    );

    fireEvent.click(screen.getByRole("radio", { name: "Small" }));
    expect(onChange).toHaveBeenLastCalledWith("s");

    fireEvent.click(screen.getByRole("radio", { name: "Medium" }));
    expect(onChange).toHaveBeenLastCalledWith("m");
  });

  it("shares a native name across items so they behave as one exclusive group", () => {
    render(
      <RadioInput.Group label="Size" defaultValue="s">
        <RadioInput value="s">Small</RadioInput>
        <RadioInput value="m">Medium</RadioInput>
      </RadioInput.Group>,
    );

    const small = screen.getByRole("radio", { name: "Small" }) as HTMLInputElement;
    const medium = screen.getByRole("radio", { name: "Medium" }) as HTMLInputElement;
    expect(small.name).toBe(medium.name);
    expect(small).toBeChecked();

    fireEvent.click(medium);
    expect(medium).toBeChecked();
  });

  it("binds to the enclosing Form via name", () => {
    const onSubmit = vi.fn();
    render(
      <Form initialValues={{ size: "s" }} onSubmit={onSubmit}>
        <RadioInput.Group label="Size" name="size">
          <RadioInput value="s">Small</RadioInput>
          <RadioInput value="m">Medium</RadioInput>
        </RadioInput.Group>
        <Form.SubmitButton>Save</Form.SubmitButton>
      </Form>,
    );

    expect(screen.getByRole("radio", { name: "Small" })).toBeChecked();
    fireEvent.click(screen.getByRole("radio", { name: "Medium" }));

    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onSubmit).toHaveBeenCalledWith({ size: "m" }, expect.anything());
  });

  it("associates the label with the group", () => {
    render(
      <RadioInput.Group label="Size">
        <RadioInput value="s">Small</RadioInput>
      </RadioInput.Group>,
    );
    expect(screen.getByRole("radiogroup", { name: "Size" })).toBeInTheDocument();
  });

  it("disables every item in the group when the group is disabled", () => {
    render(
      <RadioInput.Group label="Size" disabled>
        <RadioInput value="s">Small</RadioInput>
      </RadioInput.Group>,
    );
    expect(screen.getByRole("radio", { name: "Small" })).toBeDisabled();
  });

  it("lays items out vertically by default and horizontally when requested", () => {
    const { rerender } = render(
      <RadioInput.Group label="Size">
        <RadioInput value="s">Small</RadioInput>
      </RadioInput.Group>,
    );
    expect(
      screen.getByRole("radio", { name: "Small" }).closest(".eink-radio-group__items"),
    ).not.toHaveClass("eink-radio-group__items--horizontal");

    rerender(
      <RadioInput.Group label="Size" orientation="horizontal">
        <RadioInput value="s">Small</RadioInput>
      </RadioInput.Group>,
    );
    expect(
      screen.getByRole("radio", { name: "Small" }).closest(".eink-radio-group__items"),
    ).toHaveClass("eink-radio-group__items--horizontal");
  });
});
