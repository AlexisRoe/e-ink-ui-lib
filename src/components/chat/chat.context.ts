import type { ReactNode } from "react";
import { createContext, useContext } from "react";

/** Who authored a {@link ChatEntry}. */
export type ChatReasoner = "ai" | "user";

/** Single entry stored by {@link Chat}, as exposed through context. */
export interface ChatEntry {
  /** Stable identifier for the entry, used as the React key when auto-rendered. */
  id: string;
  /** Who authored the entry. */
  reasoner: ChatReasoner;
  /** Moment the entry was sent. */
  timestamp: Date;
  /** Entry content. */
  message: ReactNode;
}

/** Value exposed by {@link Chat} through context to its descendants. */
export interface ChatContextValue {
  /** Entries currently held by the enclosing {@link Chat}, oldest first. */
  entries: ChatEntry[];
  /** Appends a new entry with the given `reasoner` and `message`, timestamped `now`. */
  addEntry: (reasoner: ChatReasoner, message: ReactNode) => void;
}

export const ChatContext = createContext<ChatContextValue | null>(null);

/**
 * Reads the enclosing {@link Chat}'s entries and `addEntry` method. Intended
 * for components that render or append to the conversation, such as
 * {@link Chat.Messages} and {@link Chat.Composer}.
 *
 * Throws if used outside a `<Chat>`.
 *
 * @example
 * ```tsx
 * const { entries, addEntry } = useChatContext();
 * ```
 */
export function useChatContext(): ChatContextValue {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChatContext must be used within a <Chat>");
  }
  return context;
}
