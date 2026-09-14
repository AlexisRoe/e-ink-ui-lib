import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Form } from "../form/form.component";
import { Input } from "./input.component";

describe("Input", () => {
  it("renders a labeled text field, standalone", () => {
    const onChange = vi.fn();
    render(
      <Input value="" onChange={onChange}>
        Name
      </Input>,
    );
    const field = screen.getByLabelText("Name");
    fireEvent.change(field, { target: { value: "Ada" } });
    expect(onChange).toHaveBeenCalledWith("Ada");
  });

  it("enforces maxLength", () => {
    render(
      <Input value="" onChange={() => {}} maxLength={3}>
        Code
      </Input>,
    );
    expect(screen.getByLabelText("Code")).toHaveAttribute("maxlength", "3");
  });

  it("shows a validation error on change and clears it once fixed", () => {
    render(
      <Input value="" onChange={() => {}} validate={(v) => (v.length < 3 ? "Too short" : null)}>
        Name
      </Input>,
    );
    const field = screen.getByLabelText("Name");
    fireEvent.change(field, { target: { value: "ab" } });
    expect(screen.getByRole("alert")).toHaveTextContent("Too short");
    expect(field).toHaveAttribute("aria-invalid", "true");

    fireEvent.change(field, { target: { value: "abc" } });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(field).toHaveAttribute("aria-invalid", "false");
  });

  it("validates on blur", () => {
    render(
      <Input value="" onChange={() => {}} validate={(v) => (v ? null : "Required")}>
        Name
      </Input>,
    );
    fireEvent.blur(screen.getByLabelText("Name"));
    expect(screen.getByRole("alert")).toHaveTextContent("Required");
  });

  it("clears the field with the clear button", () => {
    const onChange = vi.fn();
    render(
      <Input value="hello" onChange={onChange}>
        Name
      </Input>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect(onChange).toHaveBeenCalledWith("");
  });

  it("hides the clear button when useClear is false", () => {
    render(
      <Input value="hello" onChange={() => {}} useClear={false}>
        Name
      </Input>,
    );
    expect(screen.queryByRole("button", { name: "Clear" })).not.toBeInTheDocument();
  });

  it("toggles password visibility with the eye button", () => {
    render(
      <Input value="secret" onChange={() => {}} type="password">
        Password
      </Input>,
    );
    const field = screen.getByLabelText("Password");
    expect(field).toHaveAttribute("type", "password");
    fireEvent.click(screen.getByRole("button", { name: "Show password" }));
    expect(field).toHaveAttribute("type", "text");
    fireEvent.click(screen.getByRole("button", { name: "Hide password" }));
    expect(field).toHaveAttribute("type", "password");
  });

  it("hides the eye button when useEye is false", () => {
    render(
      <Input value="secret" onChange={() => {}} type="password" useEye={false}>
        Password
      </Input>,
    );
    expect(screen.queryByRole("button", { name: "Show password" })).not.toBeInTheDocument();
  });

  it("binds to the enclosing Form via name, including errors", () => {
    const onSubmit = vi.fn();
    render(
      <Form initialValues={{ email: "" }} onSubmit={onSubmit}>
        <Input name="email" validate={(v) => (v.includes("@") ? null : "Invalid email")}>
          Email
        </Input>
        <Form.SubmitButton>Save</Form.SubmitButton>
      </Form>,
    );

    const field = screen.getByLabelText("Email");
    fireEvent.change(field, { target: { value: "not-an-email" } });
    expect(screen.getByRole("alert")).toHaveTextContent("Invalid email");
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();

    fireEvent.change(field, { target: { value: "a@b.com" } });
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onSubmit).toHaveBeenCalledWith({ email: "a@b.com" }, expect.anything());
  });

  it("disables the field", () => {
    render(
      <Input value="" onChange={() => {}} disabled>
        Name
      </Input>,
    );
    expect(screen.getByLabelText("Name")).toBeDisabled();
  });
});
