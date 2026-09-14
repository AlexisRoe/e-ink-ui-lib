import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { Form } from "./form.component";
import { useFormField } from "./form.context";

function NameField() {
  const { value, setValue } = useFormField("name");
  return (
    <input
      aria-label="name"
      value={(value as string) ?? ""}
      onChange={(e) => setValue(e.target.value)}
    />
  );
}

function ErroringField() {
  const { setError } = useFormField("name");
  return (
    <button type="button" onClick={() => setError("required")}>
      trigger error
    </button>
  );
}

describe("Form", () => {
  it("renders a form element", () => {
    render(
      <Form initialValues={{ name: "" }}>
        <span>content</span>
      </Form>,
    );
    expect(screen.getByText("content").closest("form")).toHaveClass("eink-form");
  });

  it("disables the submit button until a change is made", () => {
    render(
      <Form initialValues={{ name: "" }}>
        <NameField />
        <Form.SubmitButton>Save</Form.SubmitButton>
      </Form>,
    );

    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
    fireEvent.change(screen.getByLabelText("name"), { target: { value: "Ada" } });
    expect(screen.getByRole("button", { name: "Save" })).toBeEnabled();
  });

  it("disables the submit button while an error exists, even if dirty", () => {
    render(
      <Form initialValues={{ name: "" }}>
        <NameField />
        <ErroringField />
        <Form.SubmitButton>Save</Form.SubmitButton>
      </Form>,
    );

    fireEvent.change(screen.getByLabelText("name"), { target: { value: "Ada" } });
    expect(screen.getByRole("button", { name: "Save" })).toBeEnabled();
    fireEvent.click(screen.getByText("trigger error"));
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });

  it("calls onSubmit with current values when dirty and valid", () => {
    const onSubmit = vi.fn();
    render(
      <Form initialValues={{ name: "" }} onSubmit={onSubmit}>
        <NameField />
        <Form.SubmitButton>Save</Form.SubmitButton>
      </Form>,
    );

    fireEvent.change(screen.getByLabelText("name"), { target: { value: "Ada" } });
    fireEvent.click(screen.getByRole("button", { name: "Save" }));
    expect(onSubmit).toHaveBeenCalledWith({ name: "Ada" }, expect.anything());
  });

  it("resets values and errors, and calls onReset with the initial values", () => {
    const onReset = vi.fn();
    render(
      <Form initialValues={{ name: "" }} onReset={onReset}>
        <NameField />
        <ErroringField />
        <Form.ResetButton>Reset</Form.ResetButton>
      </Form>,
    );

    fireEvent.change(screen.getByLabelText("name"), { target: { value: "Ada" } });
    fireEvent.click(screen.getByText("trigger error"));
    fireEvent.click(screen.getByRole("button", { name: "Reset" }));

    expect(screen.getByLabelText("name")).toHaveValue("");
    expect(onReset).toHaveBeenCalledWith({ name: "" });
  });

  it("supports a custom isEqual comparator for dirtiness", () => {
    render(
      <Form initialValues={{ name: "Ada" }} isEqual={() => true}>
        <NameField />
        <Form.SubmitButton>Save</Form.SubmitButton>
      </Form>,
    );

    fireEvent.change(screen.getByLabelText("name"), { target: { value: "Grace" } });
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });

  it("re-syncs values and errors when initialValues changes (e.g. async data arriving)", () => {
    function Wrapper() {
      const [initialValues, setInitialValues] = useState({ name: "" });
      return (
        <>
          <button type="button" onClick={() => setInitialValues({ name: "Ada" })}>
            load
          </button>
          <Form initialValues={initialValues}>
            <NameField />
            <ErroringField />
            <Form.SubmitButton>Save</Form.SubmitButton>
          </Form>
        </>
      );
    }

    render(<Wrapper />);

    fireEvent.change(screen.getByLabelText("name"), { target: { value: "dirty" } });
    fireEvent.click(screen.getByText("trigger error"));
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();

    fireEvent.click(screen.getByText("load"));

    expect(screen.getByLabelText("name")).toHaveValue("Ada");
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });
});
