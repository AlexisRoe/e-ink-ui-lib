import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Form } from "../form/form.component";
import { Slider } from "./slider.component";

describe("Slider", () => {
  it("renders a slider with its children as the label", () => {
    render(
      <Slider value={0} min={0} max={10}>
        Brightness
      </Slider>,
    );
    const slider = screen.getByRole("slider", { name: "Brightness" });
    expect(slider).toHaveValue("0");
    expect(slider).toHaveAttribute("min", "0");
    expect(slider).toHaveAttribute("max", "10");
  });

  it("calls onChange with the new value when changed (controlled)", () => {
    const onChange = vi.fn();
    render(
      <Slider value={0} onChange={onChange} min={0} max={10}>
        Brightness
      </Slider>,
    );

    fireEvent.change(screen.getByRole("slider", { name: "Brightness" }), {
      target: { value: "4" },
    });
    expect(onChange).toHaveBeenCalledWith(4);
  });

  it("snaps to step values when used as an uncontrolled component", () => {
    function Wrapper() {
      const [value, setValue] = useState(0);
      return (
        <Slider value={value} onChange={setValue} min={0} max={10} step={5}>
          Brightness
        </Slider>
      );
    }
    render(<Wrapper />);

    const slider = screen.getByRole("slider", { name: "Brightness" });
    fireEvent.change(slider, { target: { value: "5" } });
    expect(slider).toHaveValue("5");
  });

  it("binds to the enclosing Form via name, reading and updating the field value", () => {
    const onSubmit = vi.fn();
    render(
      <Form initialValues={{ brightness: 0 }} onSubmit={onSubmit}>
        <Slider name="brightness" min={0} max={10}>
          Brightness
        </Slider>
        <Form.SubmitButton>Save</Form.SubmitButton>
      </Form>,
    );

    const slider = screen.getByRole("slider", { name: "Brightness" });
    fireEvent.change(slider, { target: { value: "7" } });
    expect(slider).toHaveValue("7");

    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onSubmit).toHaveBeenCalledWith({ brightness: 7 }, expect.anything());
  });

  it("renders a * after the label when required", () => {
    render(
      <Slider value={0} min={0} max={10} required>
        Brightness
      </Slider>,
    );
    expect(screen.getByRole("slider", { name: "Brightness*" })).toBeInTheDocument();
  });

  it("supports a vertical orientation", () => {
    render(
      <Slider value={0} min={0} max={10} orientation="vertical">
        Brightness
      </Slider>,
    );
    expect(screen.getByRole("slider")).toHaveAttribute("aria-orientation", "vertical");
  });

  it("does not update when disabled", () => {
    const onChange = vi.fn();
    render(
      <Slider value={0} onChange={onChange} min={0} max={10} disabled>
        Brightness
      </Slider>,
    );

    fireEvent.change(screen.getByRole("slider", { name: "Brightness" }), {
      target: { value: "4" },
    });
    expect(onChange).not.toHaveBeenCalled();
  });
});
