import { useCallback, useState } from "react";

function oldSchoolCopy(text: string): void {
  const tempTextArea = document.createElement("textarea");
  tempTextArea.value = text;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();
  document.execCommand("copy");
  document.body.removeChild(tempTextArea);
}

/**
 * Copies text to the clipboard, using the async Clipboard API when available
 * and falling back to a hidden `<textarea>` + `execCommand("copy")` otherwise.
 *
 * @returns A `[copiedText, copyToClipboard]` tuple: the last successfully
 * copied value (`null` until a copy succeeds), and a function to copy a new value.
 *
 * @example
 * ```tsx
 * const [copiedText, copyToClipboard] = useCopyToClipboard();
 * copyToClipboard("hello");
 * ```
 */
export function useCopyToClipboard(): [string | null, (value: string) => Promise<void>] {
  const [state, setState] = useState<string | null>(null);

  const copyToClipboard = useCallback(async (value: string): Promise<void> => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        setState(value);
      } else {
        throw new Error("writeText not supported");
      }
    } catch {
      oldSchoolCopy(value);
      setState(value);
    }
  }, []);

  return [state, copyToClipboard];
}
