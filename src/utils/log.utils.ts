function pad(value: number, length = 2): string {
  return value.toString().padStart(length, "0");
}

/** Formats a {@link Date} as `hh:mm:ss:ms` for display in a {@link Log.Item}. */
export function formatLogTimestamp(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}:${pad(date.getMilliseconds(), 3)}`;
}
