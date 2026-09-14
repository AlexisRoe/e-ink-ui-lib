import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Form } from "../form/form.component";
import { Pin } from "./pin.component";

describe("Pin", () => {
  it("renders one masked box per digit of length, labeled as a group", () => {
    render(
      <Pin value="" length={4}>
        PIN code
      </Pin>,
    );
    const boxes = screen.getAllByLabelText(/Digit \d of 4/);
    expect(boxes).toHaveLength(4);
    for (const box of boxes) {
      expect(box).toHaveAttribute("type", "password");
    }
    expect(screen.getByRole("group", { name: "PIN code" })).toBeInTheDocument();
  });

  it("renders plain text boxes when useMask is false", () => {
    render(
      <Pin value="" length={4} useMask={false}>
        PIN code
      </Pin>,
    );
    for (const box of screen.getAllByLabelText(/Digit \d of 4/)) {
      expect(box).toHaveAttribute("type", "text");
    }
  });

  it("prefills boxes from an initial value", () => {
    render(
      <Pin value="12" length={4} useMask={false}>
        PIN code
      </Pin>,
    );
    expect(screen.getByLabelText("Digit 1 of 4")).toHaveValue("1");
    expect(screen.getByLabelText("Digit 2 of 4")).toHaveValue("2");
    expect(screen.getByLabelText("Digit 3 of 4")).toHaveValue("");
  });

  it("types through the boxes without clicking, auto-advancing focus", () => {
    function Wrapper() {
      const [value, setValue] = useState("");
      return (
        <Pin value={value} onChange={setValue} length={3} useMask={false}>
          PIN code
        </Pin>
      );
    }
    render(<Wrapper />);

    fireEvent.change(screen.getByLabelText("Digit 1 of 3"), { target: { value: "1" } });
    expect(screen.getByLabelText("Digit 2 of 3")).toHaveFocus();
    fireEvent.change(screen.getByLabelText("Digit 2 of 3"), { target: { value: "2" } });
    expect(screen.getByLabelText("Digit 3 of 3")).toHaveFocus();
    fireEvent.change(screen.getByLabelText("Digit 3 of 3"), { target: { value: "3" } });
    expect(screen.getByLabelText("Digit 1 of 3")).toHaveValue("1");
    expect(screen.getByLabelText("Digit 2 of 3")).toHaveValue("2");
    expect(screen.getByLabelText("Digit 3 of 3")).toHaveValue("3");
  });

  it("moves focus back and clears the previous digit on backspace", () => {
    function Wrapper() {
      const [value, setValue] = useState("12");
      return (
        <Pin value={value} onChange={setValue} length={3} useMask={false}>
          PIN code
        </Pin>
      );
    }
    render(<Wrapper />);

    fireEvent.keyDown(screen.getByLabelText("Digit 3 of 3"), { key: "Backspace" });
    expect(screen.getByLabelText("Digit 2 of 3")).toHaveFocus();
    expect(screen.getByLabelText("Digit 2 of 3")).toHaveValue("");
  });

  it("fills all boxes from a single paste", () => {
    const onChange = vi.fn();
    render(
      <Pin value="" onChange={onChange} length={4} useMask={false}>
        PIN code
      </Pin>,
    );

    const clipboardData = { getData: () => "5678" };
    fireEvent.paste(screen.getByLabelText("Digit 1 of 4"), { clipboardData });
    expect(onChange).toHaveBeenCalledWith("5678");
  });

  it("binds to the enclosing Form via name, reading and updating the field value", () => {
    const onSubmit = vi.fn();
    render(
      <Form initialValues={{ pin: "" }} onSubmit={onSubmit}>
        <Pin name="pin" length={4} useMask={false}>
          PIN code
        </Pin>
        <Form.SubmitButton>Save</Form.SubmitButton>
      </Form>,
    );

    fireEvent.change(screen.getByLabelText("Digit 1 of 4"), { target: { value: "9" } });
    expect(screen.getByLabelText("Digit 1 of 4")).toHaveValue("9");
    fireEvent.change(screen.getByLabelText("Digit 2 of 4"), { target: { value: "8" } });
    fireEvent.change(screen.getByLabelText("Digit 3 of 4"), { target: { value: "7" } });
    fireEvent.change(screen.getByLabelText("Digit 4 of 4"), { target: { value: "6" } });

    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onSubmit).toHaveBeenCalledWith({ pin: "9876" }, expect.anything());
  });

  it("keeps the form's submit button disabled until all digits are entered", () => {
    const onSubmit = vi.fn();
    render(
      <Form initialValues={{ pin: "" }} onSubmit={onSubmit}>
        <Pin name="pin" length={4} required useMask={false}>
          PIN code
        </Pin>
        <Form.SubmitButton>Save</Form.SubmitButton>
      </Form>,
    );

    const submitButton = screen.getByRole("button", { name: "Save" });
    expect(submitButton).toBeDisabled();

    fireEvent.change(screen.getByLabelText("Digit 1 of 4"), { target: { value: "1" } });
    fireEvent.change(screen.getByLabelText("Digit 2 of 4"), { target: { value: "2" } });
    expect(submitButton).toBeDisabled();

    fireEvent.change(screen.getByLabelText("Digit 3 of 4"), { target: { value: "3" } });
    fireEvent.change(screen.getByLabelText("Digit 4 of 4"), { target: { value: "4" } });
    expect(submitButton).toBeEnabled();

    fireEvent.click(submitButton);
    expect(onSubmit).toHaveBeenCalledWith({ pin: "1234" }, expect.anything());
  });

  it("re-disables the submit button if a digit is removed after being complete", () => {
    render(
      <Form initialValues={{ pin: "1234" }}>
        <Pin name="pin" length={4} useMask={false}>
          PIN code
        </Pin>
        <Form.SubmitButton>Save</Form.SubmitButton>
      </Form>,
    );

    fireEvent.keyDown(screen.getByLabelText("Digit 4 of 4"), { key: "Backspace" });
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });

  it("renders a * after the label when required", () => {
    render(
      <Pin value="" length={4} required>
        PIN code
      </Pin>,
    );
    expect(screen.getByRole("group", { name: "PIN code*" })).toBeInTheDocument();
  });

  it("disables all boxes when disabled", () => {
    render(
      <Pin value="" length={4} disabled useMask={false}>
        PIN code
      </Pin>,
    );
    for (const box of screen.getAllByLabelText(/Digit \d of 4/)) {
      expect(box).toBeDisabled();
    }
  });
});
