import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Form } from "../form/form.component";
import { TimeInput } from "./time-input.component";

function openAndGetColumns() {
  fireEvent.click(screen.getByRole("button", { name: /Alarm/ }));
  return {
    hours: within(screen.getByRole("listbox", { name: "Hour" })),
    minutes: within(screen.getByRole("listbox", { name: "Minute" })),
  };
}

describe("TimeInput", () => {
  it("shows a placeholder until a time is picked, standalone", () => {
    render(
      <TimeInput value="" onChange={() => {}}>
        Alarm
      </TimeInput>,
    );
    expect(screen.getByRole("button", { name: /Alarm/ })).toHaveTextContent("HH:MM");
  });

  it("opens a picker and picks an hour and minute", () => {
    const onChange = vi.fn();
    render(
      <TimeInput value="09:05" onChange={onChange}>
        Alarm
      </TimeInput>,
    );

    const { hours } = openAndGetColumns();
    expect(screen.getByRole("dialog", { name: "Choose time" })).toBeInTheDocument();

    fireEvent.click(hours.getByRole("option", { name: "17" }));
    expect(onChange).toHaveBeenLastCalledWith("17:05");
  });

  it("focuses the current hour when opened and moves with arrow keys", () => {
    render(
      <TimeInput value="09:05" onChange={() => {}}>
        Alarm
      </TimeInput>,
    );
    const { hours } = openAndGetColumns();

    const hour09 = hours.getByRole("option", { name: "09" });
    expect(hour09).toHaveFocus();

    fireEvent.keyDown(hour09, { key: "ArrowDown" });
    expect(hours.getByRole("option", { name: "10" })).toHaveFocus();

    fireEvent.keyDown(hours.getByRole("option", { name: "10" }), { key: "ArrowUp" });
    expect(hour09).toHaveFocus();
  });

  it("wraps from the last hour to the first with ArrowDown", () => {
    const onChange = vi.fn();
    render(
      <TimeInput value="23:00" onChange={onChange}>
        Alarm
      </TimeInput>,
    );
    const { hours } = openAndGetColumns();
    fireEvent.keyDown(hours.getByRole("option", { name: "23" }), { key: "ArrowDown" });
    const hour00 = hours.getByRole("option", { name: "00" });
    expect(hour00).toHaveFocus();
    fireEvent.keyDown(hour00, { key: "Enter" });
    expect(onChange).toHaveBeenLastCalledWith("00:00");
  });

  it("jumps to the first/last minute with Home/End", () => {
    render(
      <TimeInput value="09:30" onChange={() => {}}>
        Alarm
      </TimeInput>,
    );
    const { minutes } = openAndGetColumns();
    const minute30 = minutes.getByRole("option", { name: "30" });
    fireEvent.keyDown(minute30, { key: "End" });
    expect(minutes.getByRole("option", { name: "59" })).toHaveFocus();
  });

  it("binds to the enclosing Form via name", () => {
    const onSubmit = vi.fn();
    render(
      <Form initialValues={{ alarm: "09:00" }} onSubmit={onSubmit}>
        <TimeInput name="alarm">Alarm</TimeInput>
        <Form.SubmitButton>Save</Form.SubmitButton>
      </Form>,
    );

    const { minutes } = openAndGetColumns();
    fireEvent.click(minutes.getByRole("option", { name: "45" }));
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onSubmit).toHaveBeenCalledWith({ alarm: "09:45" }, expect.anything());
  });

  it("closes on Escape and returns focus to the trigger", () => {
    render(
      <TimeInput value="09:00" onChange={() => {}}>
        Alarm
      </TimeInput>,
    );
    const trigger = screen.getByRole("button", { name: /Alarm/ });
    fireEvent.click(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("disables the trigger", () => {
    render(
      <TimeInput value="" onChange={() => {}} disabled>
        Alarm
      </TimeInput>,
    );
    expect(screen.getByRole("button", { name: /Alarm/ })).toBeDisabled();
  });
});
