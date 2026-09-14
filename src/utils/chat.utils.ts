function pad(value: number): string {
  return value.toString().padStart(2, "0");
}

/** Formats a {@link Date} as `hh:mm` for display in a {@link Chat.Message} header. */
export function formatChatTimestamp(date: Date): string {
  return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
