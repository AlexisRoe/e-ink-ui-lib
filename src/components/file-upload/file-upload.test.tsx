import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Form } from "../form/form.component";
import { FileUpload } from "./file-upload.component";

function makeFile(name: string, type: string) {
  return new File(["content"], name, { type });
}

describe("FileUpload", () => {
  it("renders a labeled dropzone with an upload prompt", () => {
    render(<FileUpload onUpload={vi.fn()}>Attachment</FileUpload>);
    expect(screen.getByText("Attachment")).toBeInTheDocument();
    expect(screen.getByText(/click to choose a file/i)).toBeInTheDocument();
  });

  it("calls onUpload with the chosen file and shows an uploading state while pending", async () => {
    let resolveUpload: () => void = () => {};
    const onUpload = vi.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveUpload = resolve;
        }),
    );
    render(<FileUpload onUpload={onUpload}>Attachment</FileUpload>);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    const file = makeFile("report.pdf", "application/pdf");
    fireEvent.change(input, { target: { files: [file] } });

    expect(onUpload).toHaveBeenCalledWith(file);
    expect(screen.getByText(/uploading report\.pdf/i)).toBeInTheDocument();
    expect(input).toBeDisabled();

    resolveUpload();
    await waitFor(() => expect(screen.getByText(/report\.pdf uploaded/i)).toBeInTheDocument());
  });

  it("shows an error state when onUpload rejects", async () => {
    const onUpload = vi.fn(() => Promise.reject(new Error("network error")));
    render(<FileUpload onUpload={onUpload}>Attachment</FileUpload>);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makeFile("report.pdf", "application/pdf")] } });

    await waitFor(() => expect(screen.getByText(/upload failed/i)).toBeInTheDocument());
  });

  it("rejects a file that doesn't match accept without calling onUpload", () => {
    const onUpload = vi.fn();
    render(
      <FileUpload onUpload={onUpload} accept={[".pdf"]}>
        Attachment
      </FileUpload>,
    );

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makeFile("photo.png", "image/png")] } });

    expect(onUpload).not.toHaveBeenCalled();
    expect(screen.getByText(/isn't supported/i)).toBeInTheDocument();
  });

  it("accepts a file matching a mime wildcard in accept", async () => {
    const onUpload = vi.fn(() => Promise.resolve());
    render(
      <FileUpload onUpload={onUpload} accept={["image/*"]}>
        Attachment
      </FileUpload>,
    );

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makeFile("photo.png", "image/png")] } });

    expect(onUpload).toHaveBeenCalled();
    await waitFor(() => expect(screen.getByText(/photo\.png uploaded/i)).toBeInTheDocument());
  });

  it("blocks the enclosing Form's submit button until a file is successfully uploaded", async () => {
    const onSubmit = vi.fn();
    const onUpload = vi.fn(() => Promise.resolve());
    render(
      <Form initialValues={{ attachment: "" }} onSubmit={onSubmit}>
        <FileUpload name="attachment" onUpload={onUpload}>
          Attachment
        </FileUpload>
        <Form.SubmitButton>Save</Form.SubmitButton>
      </Form>,
    );

    const submitButton = screen.getByRole("button", { name: "Save" });
    expect(submitButton).toBeDisabled();

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makeFile("report.pdf", "application/pdf")] } });
    expect(submitButton).toBeDisabled();

    await waitFor(() => expect(submitButton).toBeEnabled());
    fireEvent.click(submitButton);
    expect(onSubmit).toHaveBeenCalledWith({ attachment: "report.pdf" }, expect.anything());
  });

  it("keeps the form blocked when the upload fails", async () => {
    const onUpload = vi.fn(() => Promise.reject(new Error("network error")));
    render(
      <Form initialValues={{ attachment: "" }}>
        <FileUpload name="attachment" onUpload={onUpload}>
          Attachment
        </FileUpload>
        <Form.SubmitButton>Save</Form.SubmitButton>
      </Form>,
    );

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makeFile("report.pdf", "application/pdf")] } });

    await waitFor(() => expect(screen.getByText(/upload failed/i)).toBeInTheDocument());
    expect(screen.getByRole("button", { name: "Save" })).toBeDisabled();
  });

  it("disables the file input when disabled", () => {
    render(
      <FileUpload onUpload={vi.fn()} disabled>
        Attachment
      </FileUpload>,
    );
    expect(document.querySelector('input[type="file"]')).toBeDisabled();
  });
});
