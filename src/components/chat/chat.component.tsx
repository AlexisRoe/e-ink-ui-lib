import type { HTMLAttributes, KeyboardEvent, ReactNode } from "react";
import { useCallback, useId, useMemo, useState } from "react";
import { formatChatTimestamp } from "../../utils/chat.utils";
import { cx } from "../../utils/cx.utils";
import { Avatar } from "../avatar/avatar.component";
import { Button } from "../button/button.component";
import type { ChatEntry, ChatReasoner } from "./chat.context";
import { ChatContext, useChatContext } from "./chat.context";

import "./chat.component.css";

export type { ChatEntry, ChatReasoner } from "./chat.context";

/** Props accepted by {@link Chat}. */
export interface ChatProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Entries the conversation starts with. Defaults to an empty conversation. */
  initialEntries?: Omit<ChatEntry, "id">[];
  /** Called with the full entry whenever one is appended, e.g. via {@link Chat.Composer}. */
  onEntry?: (entry: ChatEntry) => void;
  children: ReactNode;
}

/** Props accepted by {@link Chat.Message}. */
export interface ChatMessageProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  /** Who authored the message. Determines alignment and avatar styling. */
  reasoner: ChatReasoner;
  /** Moment the message was sent, formatted as `hh:mm` next to the reasoner's name. */
  timestamp: Date;
  /** Name shown in the message header. Defaults to `"You"` for `"user"`, `"Assistant"` for `"ai"`. */
  name?: string;
  /** Message content. */
  children: ReactNode;
}

/** Props accepted by {@link Chat.Messages}. */
export type ChatMessagesProps = Omit<HTMLAttributes<HTMLDivElement>, "children">;

/** Props accepted by {@link Chat.Composer}. */
export interface ChatComposerProps
  extends Omit<HTMLAttributes<HTMLDivElement>, "children" | "onSubmit"> {
  /** Reasoner new entries are appended as. Defaults to `"user"`. */
  reasoner?: ChatReasoner;
  /** Placeholder text shown when the field is empty. Defaults to `"Type a message"`. */
  placeholder?: string;
  /** Called with the trimmed text right after it is appended as a new entry. */
  onSubmit?: (message: string) => void;
}

/**
 * Single message bubble: a bordered box with a small square {@link Avatar}
 * and a `NAME · hh:mm` header above the content. Rendered flush right with
 * a filled avatar for `reasoner="user"`, flush left with an outlined
 * avatar for `reasoner="ai"`.
 *
 * @example
 * ```tsx
 * <Chat.Message reasoner="ai" timestamp={new Date()}>
 *   Quite a lot, for someone with no network connection.
 * </Chat.Message>
 * ```
 */
function ChatMessage({
  className,
  reasoner,
  timestamp,
  name,
  children,
  ...rest
}: ChatMessageProps) {
  const label = name ?? (reasoner === "user" ? "You" : "Assistant");

  return (
    <div
      className={cx(`eink-chat-message eink-chat-message--${reasoner}`, [
        className ?? "",
        !!className,
      ])}
      {...rest}
    >
      <Avatar className="eink-chat-message__avatar" userName={label} size="sm" />
      <div className="eink-chat-message__bubble">
        <div className="eink-chat-message__header">
          {label} · {formatChatTimestamp(timestamp)}
        </div>
        <div className="eink-chat-message__content">{children}</div>
      </div>
    </div>
  );
}

/**
 * Renders every entry currently held by the enclosing {@link Chat} as a
 * {@link Chat.Message}, oldest first.
 *
 * @example
 * ```tsx
 * <Chat.Messages />
 * ```
 */
function ChatMessages({ className, ...rest }: ChatMessagesProps) {
  const { entries } = useChatContext();

  return (
    <div className={cx("eink-chat__messages", [className ?? "", !!className])} {...rest}>
      {entries.map((entry) => (
        <ChatMessage key={entry.id} reasoner={entry.reasoner} timestamp={entry.timestamp}>
          {entry.message}
        </ChatMessage>
      ))}
    </div>
  );
}

/**
 * Single-line composer wired to the enclosing {@link Chat}: typing and
 * pressing Enter (or clicking the send button) appends a new entry via
 * `addEntry` and clears the field. Shift+Enter is ignored (no newline
 * support, this is a single-line field).
 *
 * @example
 * ```tsx
 * <Chat.Composer onSubmit={(message) => console.log(message)} />
 * ```
 */
function ChatComposer({
  className,
  reasoner = "user",
  placeholder = "Type a message",
  onSubmit,
  ...rest
}: ChatComposerProps) {
  const { addEntry } = useChatContext();
  const [value, setValue] = useState("");
  const inputId = useId();

  const submit = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed) return;
    addEntry(reasoner, trimmed);
    onSubmit?.(trimmed);
    setValue("");
  }, [value, reasoner, addEntry, onSubmit]);

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      submit();
    }
  };

  return (
    <div className={cx("eink-chat__composer", [className ?? "", !!className])} {...rest}>
      <input
        id={inputId}
        className="eink-chat__composer-input"
        type="text"
        value={value}
        placeholder={placeholder}
        aria-label={placeholder}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      <Button.Icon
        className="eink-chat__composer-send"
        icon="arrow-up"
        aria-label="Send message"
        size="sm"
        onClick={submit}
        disabled={!value.trim()}
      />
    </div>
  );
}

/**
 * Bordered chat window holding a conversation as an array of entries
 * (`{ id, reasoner: "ai" | "user", timestamp, message }`), managed
 * internally and exposed to descendants through context. Compose with
 * {@link Chat.Messages} to auto-render the conversation and
 * {@link Chat.Composer} to append to it, or read `entries`/`addEntry`
 * yourself via `useChatContext`/manually-placed {@link Chat.Message}s for
 * full control over layout.
 *
 * @example
 * ```tsx
 * <Chat
 *   initialEntries={[
 *     { reasoner: "user", timestamp: new Date(), message: "What can you show me?" },
 *     { reasoner: "ai", timestamp: new Date(), message: "Quite a lot." },
 *   ]}
 * >
 *   <Chat.Messages />
 *   <Chat.Composer />
 * </Chat>
 * ```
 */
export function Chat({ className, initialEntries, onEntry, children, ...rest }: ChatProps) {
  const [entries, setEntries] = useState<ChatEntry[]>(() =>
    (initialEntries ?? []).map((entry, index) => ({ ...entry, id: `initial-${index}` })),
  );

  const addEntry = useCallback(
    (reasoner: ChatReasoner, message: ReactNode) => {
      const entry: ChatEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        reasoner,
        timestamp: new Date(),
        message,
      };
      setEntries((current) => [...current, entry]);
      onEntry?.(entry);
    },
    [onEntry],
  );

  const contextValue = useMemo(() => ({ entries, addEntry }), [entries, addEntry]);

  return (
    <ChatContext.Provider value={contextValue}>
      <div className={cx("eink-chat", [className ?? "", !!className])} {...rest}>
        {children}
      </div>
    </ChatContext.Provider>
  );
}

Chat.Message = ChatMessage;
Chat.Messages = ChatMessages;
Chat.Composer = ChatComposer;
