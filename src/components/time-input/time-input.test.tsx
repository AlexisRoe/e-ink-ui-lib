import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Form } from "../form/form.component";
import { TimeInput } from "./time-input.component";

describe("TimeInput", () => {
  it("renders as a labeled time field, standalone", () => {
    const onChange = vi.fn();
    render(
      <TimeInput value="09:00" onChange={onChange}>
        Alarm
      </TimeInput>,
    );

    const input = screen.getByLabelText("Alarm") as HTMLInputElement;
    expect(input.type).toBe("time");
    expect(input.value).toBe("09:00");

    fireEvent.change(input, { target: { value: "17:30" } });
    expect(onChange).toHaveBeenCalledWith("17:30");
  });

  it("binds to the enclosing Form via name", () => {
    const onSubmit = vi.fn();
    render(
      <Form initialValues={{ alarm: "09:00" }} onSubmit={onSubmit}>
        <TimeInput name="alarm">Alarm</TimeInput>
        <Form.SubmitButton>Save</Form.SubmitButton>
      </Form>,
    );

    fireEvent.change(screen.getByLabelText("Alarm"), { target: { value: "06:45" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onSubmit).toHaveBeenCalledWith({ alarm: "06:45" }, expect.anything());
  });

  it("marks the field as required and renders a marker", () => {
    render(
      <TimeInput value="" onChange={() => {}} required>
        Alarm
      </TimeInput>,
    );
    expect(screen.getByLabelText(/Alarm/)).toBeRequired();
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("disables the field", () => {
    render(
      <TimeInput value="" onChange={() => {}} disabled>
        Alarm
      </TimeInput>,
    );
    expect(screen.getByLabelText("Alarm")).toBeDisabled();
  });
});
