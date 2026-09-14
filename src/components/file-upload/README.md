---
type: component
title: "FileUpload"
description: "A labeled dropzone wrapping a native file input, with idle/uploading/success/error states and optional Form binding."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/file-upload/file-upload.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (2026-09-14T18:19:01.260Z)
---

# FileUpload

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Renders a labeled dropzone (a `<label>` wrapping a visually-hidden native `<input type="file">`), always spanning the full width of its container, so it stays keyboard- and screen-reader-accessible.
- Tracks a `FileUploadStatus` of `"idle" | "uploading" | "success" | "error"`, driving both visible text and modifier classes (`eink-file-upload__dropzone--<status>`).
- Calls and awaits the required `onUpload(file)` callback; shows an "Uploading…" message with `aria-busy`/`role="status"` while pending, and disables re-picking a file during upload.
- Accepts restricted file types via `accept` (extensions like `.pdf` and/or MIME types/patterns like `image/png` or `image/*`), validated client-side by `isFileAccepted`; when set, the accepted types are also shown as a hint under the placeholder while idle.
- Can bind to an enclosing `<Form>` via `name`: on successful upload it writes the file name as the form value; with `required`, it sets a blocking form error until a file is chosen and successfully uploaded.
- `disabled` disables the whole control.

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` for className merging, including conditional dropzone status/disabled modifier classes.
- BEM classes prefixed `eink-`: `.eink-file-upload`, `.eink-file-upload__label`, `.eink-file-upload__dropzone` with modifiers `--uploading`/`--error`/`--disabled`, `.eink-file-upload__icon`, `.eink-file-upload__text`, `.eink-file-upload__hint`, `.eink-file-upload__input`.
- Imports its own `file-upload.component.css` directly.
- Reads/writes form state via `FormContext` from `../form/form.context`, uses `Label.Form` from `../label/label.component`, and the shared `Icon` component (`upload` icon) from `../icons/icon.tsx`.

---

## Primary Use Cases
- Attaching a single file (document, image) to a form, with upload progress and error feedback shown inline.
- Restricting uploads to specific file types (e.g. PDFs or images) with a visible hint of accepted formats.
- Required-attachment fields that must block form submission until upload succeeds (`name` + `required` inside a `<Form>`).

---

## Limits & Restrictions
- Handles a single file per interaction — `event.target.files?.[0]` is read and the input is cleared afterward, so only one file can be "selected" at a time even though the underlying `<input>` doesn't set `multiple`.
- `required` only blocks form submission when the component is also bound via `name` inside a `<Form>`; without `name`, `required` has no blocking effect.
- File type restriction (`accept`) is enforced only client-side via `isFileAccepted`; there is no server-side validation built in.
- `onUpload` must return a `Promise`; rejecting it is the only way to surface an "Upload failed, try again" error state.
- No component-specific restrictions beyond standard theme token usage.

---

## Component-Specific CSS & Tokens
- Status modifier classes `.eink-file-upload__dropzone--uploading` (cursor `wait`), `.eink-file-upload__dropzone--error` (thicker border via `var(--eink-border-thick)`), and `.eink-file-upload__dropzone--disabled` are defined specifically for this component's state machine.
- `.eink-file-upload__input` uses the standard clip-based visually-hidden pattern to keep the native file input accessible but invisible.

---

## Related Concepts
- `../form/form.context` and the Form component — for form-bound, required file uploads.
- `../label/label.component` — used for the field label above the dropzone.
- `../icons/icon.tsx` — provides the `upload` icon shown in the dropzone.
