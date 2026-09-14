/**
 * Dispatches a synthetic `storage` event so same-tab listeners (which the
 * native `storage` event does not reach) can react to a local write.
 */
export function dispatchStorageEvent(key: string, newValue: string | null): void {
  window.dispatchEvent(new StorageEvent("storage", { key, newValue }));
}
