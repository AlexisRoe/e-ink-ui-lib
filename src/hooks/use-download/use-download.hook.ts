import { downloadFile } from "../../utils/download.utils";

/**
 * Returns a stable function that saves content as a file download, next to
 * `useCopyToClipboard` and `FileUpload` for exporting and importing data.
 * See {@link downloadFile} for the parameters.
 *
 * @example
 * ```tsx
 * const download = useDownload();
 * <Button onClick={() => download(JSON.stringify(data), "export.json", "application/json")}>
 *   Export
 * </Button>
 * ```
 */
export function useDownload(): typeof downloadFile {
  return downloadFile;
}
