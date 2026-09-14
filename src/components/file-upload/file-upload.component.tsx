import type { ChangeEvent, ReactNode } from "react";
import { useContext, useEffect, useId, useState } from "react";
import { cx } from "../../utils/cx.utils";
import { FormContext } from "../form/form.context";
import { Icon } from "../icons/icon";
import { Label } from "../label/label.component";
import "./file-upload.component.css";

/** Current state of a {@link FileUpload}'s selected file. */
export type FileUploadStatus = "idle" | "uploading" | "success" | "error";

function isFileAccepted(file: File, accept: string[] | undefined): boolean {
  if (!accept || accept.length === 0) return true;
  return accept.some((token) => {
    if (token.startsWith(".")) return file.name.toLowerCase().endsWith(token.toLowerCase());
    if (token.endsWith("/*")) return file.type.startsWith(token.slice(0, -1));
    return file.type === token;
  });
}

/** Props accepted by {@link FileUpload}. */
export interface FileUploadProps {
  /** Label rendered above the dropzone. */
  children: ReactNode;
  /** Extra class name(s) applied to the root element. */
  className?: string;
  /**
   * Field name to bind to the enclosing `<Form>`. When provided, `FileUpload`
   * blocks `Form.SubmitButton` until a file has been chosen and successfully
   * uploaded, and writes the uploaded file's name to the form's value once it has.
   */
  name?: string;
  /**
   * File types accepted, as extensions (`".pdf"`) and/or MIME types/patterns
   * (`"image/png"`, `"image/*"`). When omitted, any file type is accepted.
   */
  accept?: string[];
  /**
   * Called with the chosen file. Awaited to send/process the file; while it
   * is pending, the control shows an "uploading" state and blocks the
   * enclosing `<Form>`'s submission. Rejecting marks the field as errored.
   */
  onUpload: (file: File) => Promise<void>;
  /** Disables the whole control. Defaults to `false`. */
  disabled?: boolean;
}

/**
 * File picker for e-ink displays, rendered as a labeled dropzone wrapping a
 * native `<input type="file">` so it is fully keyboard- and
 * screen-reader-accessible. Always spans the full width of its container.
 *
 * Clicking the dropzone (or its label) opens the native file picker. Once a
 * file is chosen, `onUpload` is called and awaited; while it is pending the
 * control shows an "Uploading…" state (`aria-busy`, `role="status"`) and is
 * disabled to prevent picking another file. If `onUpload` rejects, an error
 * state is shown instead.
 *
 * Pass `name` to bind it to the enclosing `<Form>`. Unlike other form
 * components, this binding is not optional: the field blocks
 * `Form.SubmitButton` until a file has been chosen and successfully
 * uploaded (there is no `required` prop, since an unfinished upload can
 * never be a valid submission).
 *
 * Pass `accept` to restrict which files can be chosen; omit it to allow any
 * file type.
 *
 * @example
 * ```tsx
 * <FileUpload name="attachment" accept={[".pdf", "image/*"]} onUpload={uploadFile}>
 *   Attachment
 * </FileUpload>
 * ```
 */
export function FileUpload({
  className,
  children,
  name,
  accept,
  onUpload,
  disabled = false,
}: FileUploadProps) {
  const form = useContext(FormContext);
  const inputId = useId();
  const statusId = useId();
  const [status, setStatus] = useState<FileUploadStatus>("idle");
  const [message, setMessage] = useState<string>();
  const [fileName, setFileName] = useState<string>();

  const blockingError = status === "success" ? undefined : (message ?? "Upload a file");

  // Block the enclosing Form until a file has been chosen and successfully
  // uploaded; there is no `required` opt-out, an unfinished upload is never valid.
  useEffect(() => {
    if (name && form) {
      if (form.getError(name) !== blockingError) {
        form.setError(name, blockingError);
      }
    }
  }, [name, form, blockingError]);

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!isFileAccepted(file, accept)) {
      setStatus("error");
      setFileName(file.name);
      setMessage("This file type isn't supported");
      return;
    }

    setStatus("uploading");
    setFileName(file.name);
    setMessage(undefined);

    try {
      await onUpload(file);
      setStatus("success");
      setMessage(undefined);
      if (name && form) {
        form.setValue(name, file.name);
      }
    } catch {
      setStatus("error");
      setMessage("Upload failed, try again");
    }
  };

  const statusText =
    status === "uploading"
      ? `Uploading ${fileName}…`
      : status === "success"
        ? `${fileName} uploaded`
        : status === "error"
          ? message
          : accept && accept.length > 0
            ? `Click to choose a file (${accept.join(", ")})`
            : "Click to choose a file";

  return (
    <div className={cx("eink-file-upload", [className ?? "", !!className])}>
      <Label.Form htmlFor={inputId} className="eink-file-upload__label">
        {children}
      </Label.Form>
      <label
        htmlFor={inputId}
        aria-busy={status === "uploading"}
        className={cx(
          "eink-file-upload__dropzone",
          [`eink-file-upload__dropzone--${status}`, status !== "idle"],
          ["eink-file-upload__dropzone--disabled", disabled || status === "uploading"],
        )}
      >
        <Icon name="upload" aria-hidden="true" className="eink-file-upload__icon" />
        <span id={statusId} role="status" aria-live="polite" className="eink-file-upload__text">
          {statusText}
        </span>
        <input
          id={inputId}
          type="file"
          className="eink-file-upload__input"
          accept={accept?.join(",")}
          disabled={disabled || status === "uploading"}
          aria-describedby={statusId}
          onChange={handleChange}
        />
      </label>
    </div>
  );
}
