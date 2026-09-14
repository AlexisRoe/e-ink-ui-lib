import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Form } from "../form/form.component";
import { TextArea } from "./text-area.component";

describe("TextArea", () => {
  it("renders a labeled textarea", () => {
    render(<TextArea value="">Bio</TextArea>);
    expect(screen.getByLabelText("Bio")).toBeInTheDocument();
    expect(screen.getByLabelText("Bio").tagName).toBe("TEXTAREA");
  });

  it("applies the default minHeight when none is provided", () => {
    render(<TextArea value="">Bio</TextArea>);
    expect(screen.getByLabelText("Bio")).toHaveStyle({ minHeight: "96px" });
  });

  it("applies a custom minHeight", () => {
    render(
      <TextArea value="" minHeight="200px">
        Bio
      </TextArea>,
    );
    expect(screen.getByLabelText("Bio")).toHaveStyle({ minHeight: "200px" });
  });

  it("calls onChange with the next value as a controlled component", () => {
    const onChange = vi.fn();
    render(
      <TextArea value="" onChange={onChange}>
        Bio
      </TextArea>,
    );
    fireEvent.change(screen.getByLabelText("Bio"), { target: { value: "Hello" } });
    expect(onChange).toHaveBeenCalledWith("Hello");
  });

  it("does not render a counter when maxCharacters is not provided", () => {
    render(<TextArea value="">Bio</TextArea>);
    expect(screen.queryByText(/\//)).not.toBeInTheDocument();
  });

  it("renders and updates a character counter when maxCharacters is provided", () => {
    function Wrapper() {
      const [value, setValue] = useState("Hi");
      return (
        <TextArea value={value} onChange={setValue} maxCharacters={10}>
          Bio
        </TextArea>
      );
    }
    render(<Wrapper />);
    expect(screen.getByText("2 / 10")).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Bio"), { target: { value: "Hi there" } });
    expect(screen.getByText("8 / 10")).toBeInTheDocument();
  });

  it("truncates input to maxCharacters", () => {
    const onChange = vi.fn();
    render(
      <TextArea value="" onChange={onChange} maxCharacters={5}>
        Bio
      </TextArea>,
    );
    fireEvent.change(screen.getByLabelText("Bio"), { target: { value: "abcdefgh" } });
    expect(onChange).toHaveBeenCalledWith("abcde");
  });

  it("binds to the enclosing Form via name, reading and updating the field value", () => {
    const onSubmit = vi.fn();
    render(
      <Form initialValues={{ bio: "" }} onSubmit={onSubmit}>
        <TextArea name="bio">Bio</TextArea>
        <Form.SubmitButton>Save</Form.SubmitButton>
      </Form>,
    );
    fireEvent.change(screen.getByLabelText("Bio"), { target: { value: "Hello world" } });
    expect(screen.getByLabelText("Bio")).toHaveValue("Hello world");
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onSubmit).toHaveBeenCalledWith({ bio: "Hello world" }, expect.anything());
  });

  it("renders a * after the label when required", () => {
    render(
      <TextArea value="" required>
        Bio
      </TextArea>,
    );
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("disables the field when disabled", () => {
    render(
      <TextArea value="" disabled>
        Bio
      </TextArea>,
    );
    expect(screen.getByLabelText("Bio")).toBeDisabled();
  });

  it("keeps the form's submit button disabled until a required field has a value", () => {
    const onSubmit = vi.fn();
    render(
      <Form initialValues={{ bio: "" }} onSubmit={onSubmit}>
        <TextArea name="bio" required>
          Bio
        </TextArea>
        <Form.SubmitButton>Save</Form.SubmitButton>
      </Form>,
    );

    const submitButton = screen.getByRole("button", { name: "Save" });
    expect(submitButton).toBeDisabled();

    fireEvent.change(screen.getByLabelText(/Bio/), { target: { value: "Hello" } });
    expect(submitButton).toBeEnabled();

    fireEvent.click(submitButton);
    expect(onSubmit).toHaveBeenCalledWith({ bio: "Hello" }, expect.anything());
  });

  it("re-disables the submit button if a required field is cleared after being filled", () => {
    render(
      <Form initialValues={{ bio: "Hello" }}>
        <TextArea name="bio" required>
          Bio
        </TextArea>
        <Form.SubmitButton>Save</Form.SubmitButton>
      </Form>,
    );

    fireEvent.change(screen.getByLabelText(/Bio/), { target: { value: "" } });
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });
});
