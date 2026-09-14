import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Form } from "../form/form.component";
import { DateInput } from "./date-input.component";

function openAndGetColumns() {
  fireEvent.click(screen.getByRole("button", { name: /Birthday/ }));
  return {
    days: within(screen.getByRole("listbox", { name: "Day" })),
    months: within(screen.getByRole("listbox", { name: "Month" })),
    years: within(screen.getByRole("listbox", { name: "Year" })),
  };
}

describe("DateInput", () => {
  it("shows a placeholder until a date is picked, standalone", () => {
    render(
      <DateInput value="" onChange={() => {}}>
        Birthday
      </DateInput>,
    );
    expect(screen.getByRole("button", { name: /Birthday/ })).toHaveTextContent("DD.MM.YYYY");
  });

  it("opens a day/month/year popup and picks a date", () => {
    const onChange = vi.fn();
    render(
      <DateInput value="2024-01-01" onChange={onChange}>
        Birthday
      </DateInput>,
    );

    const { days } = openAndGetColumns();
    expect(screen.getByRole("dialog", { name: "Choose date" })).toBeInTheDocument();

    fireEvent.click(days.getByRole("option", { name: "15" }));
    expect(onChange).toHaveBeenLastCalledWith("2024-01-15");
  });

  it("picks a month and year, clamping the day to the new month's length", () => {
    const onChange = vi.fn();
    render(
      <DateInput value="2024-01-31" onChange={onChange}>
        Birthday
      </DateInput>,
    );

    const { months } = openAndGetColumns();
    fireEvent.click(months.getByRole("option", { name: "February" }));
    expect(onChange).toHaveBeenLastCalledWith("2024-02-29");
  });

  it("moves focus within a column with arrow keys and picks with Enter", () => {
    const onChange = vi.fn();
    render(
      <DateInput value="2024-01-15" onChange={onChange}>
        Birthday
      </DateInput>,
    );
    const { days } = openAndGetColumns();

    const day15 = days.getByRole("option", { name: "15" });
    expect(day15).toHaveFocus();

    fireEvent.keyDown(day15, { key: "ArrowDown" });
    const day16 = days.getByRole("option", { name: "16" });
    expect(day16).toHaveFocus();

    fireEvent.keyDown(day16, { key: "Enter" });
    expect(onChange).toHaveBeenLastCalledWith("2024-01-16");
  });

  it("wraps from the last day to the first with ArrowDown", () => {
    render(
      <DateInput value="2024-01-31" onChange={() => {}}>
        Birthday
      </DateInput>,
    );
    const { days } = openAndGetColumns();
    fireEvent.keyDown(days.getByRole("option", { name: "31" }), { key: "ArrowDown" });
    expect(days.getByRole("option", { name: "01" })).toHaveFocus();
  });

  it("jumps to the first/last year with Home/End", () => {
    render(
      <DateInput value="2024-01-15" onChange={() => {}}>
        Birthday
      </DateInput>,
    );
    const { years } = openAndGetColumns();
    fireEvent.keyDown(years.getByRole("option", { name: "2024" }), { key: "End" });
    expect(document.activeElement).toHaveTextContent(String(new Date().getFullYear() + 10));
  });

  it("binds to the enclosing Form via name", () => {
    const onSubmit = vi.fn();
    render(
      <Form initialValues={{ birthday: "2024-01-01" }} onSubmit={onSubmit}>
        <DateInput name="birthday">Birthday</DateInput>
        <Form.SubmitButton>Save</Form.SubmitButton>
      </Form>,
    );

    const { days } = openAndGetColumns();
    fireEvent.click(days.getByRole("option", { name: "05" }));
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onSubmit).toHaveBeenCalledWith({ birthday: "2024-01-05" }, expect.anything());
  });

  it("closes on Escape and returns focus to the trigger", () => {
    render(
      <DateInput value="2024-01-01" onChange={() => {}}>
        Birthday
      </DateInput>,
    );
    const trigger = screen.getByRole("button", { name: /Birthday/ });
    fireEvent.click(trigger);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("disables the trigger", () => {
    render(
      <DateInput value="" onChange={() => {}} disabled>
        Birthday
      </DateInput>,
    );
    expect(screen.getByRole("button", { name: /Birthday/ })).toBeDisabled();
  });
});
