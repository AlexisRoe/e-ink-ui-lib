import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { Form } from "../form/form.component";
import { Signature } from "./signature.component";

// jsdom doesn't implement the canvas 2D context; stub the subset Signature calls.
beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue({
    scale: vi.fn(),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    clearRect: vi.fn(),
    lineCap: "round",
    lineJoin: "round",
    lineWidth: 2,
    strokeStyle: "black",
  } as unknown as CanvasRenderingContext2D);
  HTMLCanvasElement.prototype.setPointerCapture = vi.fn();
  HTMLCanvasElement.prototype.releasePointerCapture = vi.fn();
});

function draw(canvas: HTMLElement) {
  fireEvent.pointerDown(canvas, { clientX: 10, clientY: 10, pointerId: 1 });
  fireEvent.pointerMove(canvas, { clientX: 20, clientY: 20, pointerId: 1 });
  fireEvent.pointerUp(canvas, { clientX: 20, clientY: 20, pointerId: 1 });
}

describe("Signature", () => {
  it("renders a labeled, empty pad", () => {
    render(<Signature>Signature</Signature>);
    expect(screen.getByRole("img", { name: "Signature pad, empty" })).toBeInTheDocument();
  });

  it("calls onChange with SVG markup after a stroke, and null after clearing", () => {
    const onChange = vi.fn();
    render(<Signature onChange={onChange}>Signature</Signature>);
    const canvas = screen.getByRole("img");
    draw(canvas);
    expect(onChange).toHaveBeenCalledWith(expect.stringContaining("<svg"));
    expect(screen.getByRole("img", { name: "Signature captured" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect(onChange).toHaveBeenCalledWith(null);
    expect(screen.getByRole("img", { name: "Signature pad, empty" })).toBeInTheDocument();
  });

  it("disables the clear button while empty", () => {
    render(<Signature>Signature</Signature>);
    expect(screen.getByRole("button", { name: "Clear" })).toBeDisabled();
  });

  it("blocks a required Form until signed", () => {
    const onSubmit = vi.fn();
    render(
      <Form initialValues={{ signature: undefined }} onSubmit={onSubmit}>
        <Signature name="signature" required>
          Signature
        </Signature>
        <Form.SubmitButton>Save</Form.SubmitButton>
      </Form>,
    );

    const canvas = screen.getByRole("img");
    draw(canvas);
    expect(screen.getByRole("button", { name: "Save" })).not.toBeDisabled();

    fireEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });

  it("does not draw or clear when disabled", () => {
    const onChange = vi.fn();
    render(
      <Signature onChange={onChange} disabled>
        Signature
      </Signature>,
    );
    draw(screen.getByRole("img"));
    expect(onChange).not.toHaveBeenCalled();
  });
});
