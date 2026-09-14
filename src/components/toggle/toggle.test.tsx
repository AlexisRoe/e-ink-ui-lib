import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Form } from "../form/form.component";
import { Toggle } from "./toggle.component";

describe("Toggle", () => {
  it("renders unchecked by default as a switch with its children as the label", () => {
    render(<Toggle checked={false}>Notifications</Toggle>);
    const toggle = screen.getByRole("switch", { name: "Notifications" });
    expect(toggle).toHaveAttribute("aria-checked", "false");
  });

  it("calls onChange with the flipped value when clicked (controlled)", () => {
    const onChange = vi.fn();
    render(
      <Toggle checked={false} onChange={onChange}>
        Notifications
      </Toggle>,
    );

    fireEvent.click(screen.getByRole("switch", { name: "Notifications" }));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("toggles its own checked state when used as an uncontrolled component", () => {
    function Wrapper() {
      const [checked, setChecked] = useState(false);
      return (
        <Toggle checked={checked} onChange={setChecked}>
          Notifications
        </Toggle>
      );
    }
    render(<Wrapper />);

    const toggle = screen.getByRole("switch", { name: "Notifications" });
    expect(toggle).toHaveAttribute("aria-checked", "false");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "true");
  });

  it("binds to the enclosing Form via name, reading and updating the field value", () => {
    const onSubmit = vi.fn();
    render(
      <Form initialValues={{ notifications: false }} onSubmit={onSubmit}>
        <Toggle name="notifications">Notifications</Toggle>
        <Form.SubmitButton>Save</Form.SubmitButton>
      </Form>,
    );

    const toggle = screen.getByRole("switch", { name: "Notifications" });
    expect(toggle).toHaveAttribute("aria-checked", "false");

    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-checked", "true");

    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onSubmit).toHaveBeenCalledWith({ notifications: true }, expect.anything());
  });

  it("renders a * after the label when required", () => {
    render(
      <Toggle checked={false} required>
        Notifications
      </Toggle>,
    );
    expect(screen.getByRole("switch").closest("label")).toHaveTextContent("Notifications*");
  });

  it("does not toggle when disabled", () => {
    const onChange = vi.fn();
    render(
      <Toggle checked={false} onChange={onChange} disabled>
        Notifications
      </Toggle>,
    );

    fireEvent.click(screen.getByRole("switch", { name: "Notifications" }));
    expect(onChange).not.toHaveBeenCalled();
  });
});
