/**
 * Saves `content` as a file through the browser: wraps it in a `Blob`, clicks a
 * temporary `<a download>` and revokes the object URL again.
 *
 * @param content - Text, bytes or a `Blob`.
 * @param fileName - Suggested file name, e.g. `"export-2026-11-24.json"`.
 * @param type - MIME type of the file. Defaults to `"text/plain"`; ignored for a `Blob` that has its own type.
 *
 * @example
 * ```ts
 * downloadFile(JSON.stringify(data, null, 2), "progress.json", "application/json");
 * ```
 */
export function downloadFile(
  content: BlobPart | Blob,
  fileName: string,
  type = "text/plain",
): void {
  const blob = content instanceof Blob ? content : new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
