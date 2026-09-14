import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Form } from "../form/form.component";
import { Rating } from "./rating.component";

describe("Rating", () => {
  it("renders a labeled radiogroup with max icons", () => {
    render(
      <Rating value={0} max={5}>
        Satisfaction
      </Rating>,
    );
    const group = screen.getByRole("radiogroup", { name: "Satisfaction" });
    expect(group).toBeInTheDocument();
    expect(screen.getAllByRole("radio")).toHaveLength(5);
  });

  it("marks icons up to the current value as checked/filled", () => {
    render(
      <Rating value={3} max={5}>
        Satisfaction
      </Rating>,
    );
    const radios = screen.getAllByRole("radio");
    expect(radios[2]).toHaveAttribute("aria-checked", "true");
    expect(radios[3]).toHaveAttribute("aria-checked", "false");
  });

  it("clamps an initial value higher than max down to max", () => {
    render(
      <Rating value={10} max={5}>
        Satisfaction
      </Rating>,
    );
    const radios = screen.getAllByRole("radio");
    expect(radios[4]).toHaveAttribute("aria-checked", "true");
  });

  it("calls onChange with the clicked step as a controlled component", () => {
    const onChange = vi.fn();
    render(
      <Rating value={0} onChange={onChange} max={5}>
        Satisfaction
      </Rating>,
    );
    fireEvent.click(screen.getByRole("radio", { name: "3 out of 5" }));
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it("clears the rating when clicking the currently selected icon again", () => {
    const onChange = vi.fn();
    render(
      <Rating value={3} onChange={onChange} max={5}>
        Satisfaction
      </Rating>,
    );
    fireEvent.click(screen.getByRole("radio", { name: "3 out of 5" }));
    expect(onChange).toHaveBeenCalledWith(0);
  });

  it("does not render a clear button by default", () => {
    render(
      <Rating value={3} max={5}>
        Satisfaction
      </Rating>,
    );
    expect(screen.queryByRole("button", { name: "Clear rating" })).not.toBeInTheDocument();
  });

  it("clears the rating via the clear button when withClear is set", () => {
    const onChange = vi.fn();
    render(
      <Rating value={3} onChange={onChange} max={5} withClear>
        Satisfaction
      </Rating>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Clear rating" }));
    expect(onChange).toHaveBeenCalledWith(0);
  });

  it("disables the clear button when the value is already 0", () => {
    render(
      <Rating value={0} max={5} withClear>
        Satisfaction
      </Rating>,
    );
    expect(screen.getByRole("button", { name: "Clear rating" })).toBeDisabled();
  });

  it("binds to the enclosing Form via name, reading and updating the field value", () => {
    render(
      <Form initialValues={{ satisfaction: 0 }} onSubmit={() => {}}>
        <Rating name="satisfaction" max={5}>
          Satisfaction
        </Rating>
      </Form>,
    );
    fireEvent.click(screen.getByRole("radio", { name: "4 out of 5" }));
    expect(screen.getByRole("radio", { name: "4 out of 5" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });

  it("renders as a plain, non-interactive icon display when readOnly", () => {
    const onChange = vi.fn();
    render(
      <Rating value={2} onChange={onChange} max={5} readOnly>
        Satisfaction
      </Rating>,
    );
    expect(screen.queryByRole("radio")).not.toBeInTheDocument();
    expect(screen.getByRole("img", { name: "2 out of 5" })).toBeInTheDocument();
  });

  it("hides the clear button when readOnly", () => {
    render(
      <Rating value={2} max={5} readOnly withClear>
        Satisfaction
      </Rating>,
    );
    expect(screen.queryByRole("button", { name: "Clear rating" })).not.toBeInTheDocument();
  });

  it("disables every radio when disabled", () => {
    render(
      <Rating value={2} max={5} disabled>
        Satisfaction
      </Rating>,
    );
    for (const radio of screen.getAllByRole("radio")) {
      expect(radio).toBeDisabled();
    }
  });

  it("renders the heart icon variant", () => {
    const { container } = render(
      <Rating value={0} max={5} icon="heart">
        Favorite
      </Rating>,
    );
    expect(container.querySelector(".tabler-icon-heart")).toBeInTheDocument();
  });

  it("renders the smiley icon variant", () => {
    const { container } = render(
      <Rating value={0} max={5} icon="smiley">
        Mood
      </Rating>,
    );
    expect(container.querySelector(".tabler-icon-mood-smile-beam")).toBeInTheDocument();
  });

  it("renders without a border around each icon when withBorder is false", () => {
    render(
      <Rating value={0} max={5} withBorder={false}>
        Satisfaction
      </Rating>,
    );
    for (const radio of screen.getAllByRole("radio")) {
      expect(radio).toHaveClass("eink-rating__icon--no-border");
    }
  });

  it("updates as a controlled component when re-rendered with a new value", () => {
    function Wrapper() {
      const [value, setValue] = useState(0);
      return (
        <Rating value={value} onChange={setValue} max={5}>
          Satisfaction
        </Rating>
      );
    }
    render(<Wrapper />);
    fireEvent.click(screen.getByRole("radio", { name: "2 out of 5" }));
    expect(screen.getByRole("radio", { name: "2 out of 5" })).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });
});
