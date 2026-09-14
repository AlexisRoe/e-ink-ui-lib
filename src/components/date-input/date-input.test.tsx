import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Form } from "../form/form.component";
import { DateInput } from "./date-input.component";

describe("DateInput", () => {
  it("renders as a labeled date field, standalone", () => {
    const onChange = vi.fn();
    render(
      <DateInput value="2024-01-01" onChange={onChange}>
        Birthday
      </DateInput>,
    );

    const input = screen.getByLabelText("Birthday") as HTMLInputElement;
    expect(input.type).toBe("date");
    expect(input.value).toBe("2024-01-01");

    fireEvent.change(input, { target: { value: "2024-02-14" } });
    expect(onChange).toHaveBeenCalledWith("2024-02-14");
  });

  it("binds to the enclosing Form via name", () => {
    const onSubmit = vi.fn();
    render(
      <Form initialValues={{ birthday: "2024-01-01" }} onSubmit={onSubmit}>
        <DateInput name="birthday">Birthday</DateInput>
        <Form.SubmitButton>Save</Form.SubmitButton>
      </Form>,
    );

    fireEvent.change(screen.getByLabelText("Birthday"), { target: { value: "2024-03-05" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onSubmit).toHaveBeenCalledWith({ birthday: "2024-03-05" }, expect.anything());
  });

  it("marks the field as required and renders a marker", () => {
    render(
      <DateInput value="" onChange={() => {}} required>
        Birthday
      </DateInput>,
    );
    expect(screen.getByLabelText(/Birthday/)).toBeRequired();
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("disables the field", () => {
    render(
      <DateInput value="" onChange={() => {}} disabled>
        Birthday
      </DateInput>,
    );
    expect(screen.getByLabelText("Birthday")).toBeDisabled();
  });
});
