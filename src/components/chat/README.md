---
type: component
title: "Chat"
description: "Bordered chat window with a conversation array (reasoner, timestamp, message) exposed via React context, message bubbles, and a composer."
tags: [react, e-ink, ui-component, okf-v0.2]
resource: "src/components/chat/chat.component.tsx"
version: "1.0.0"
created_by: "agent:claude-sonnet-5" (2026-09-14T10:00:00Z)
reviewed_by: "user:a.roehrling" (pending)
---

# Chat

> **OKF Concept Document** — Follows Open Knowledge Format (OKF v0.2). TypeScript interfaces, standard prop signatures, and JSDoc types are intentionally excluded. Refer to source files for API types.

---

## Key Features
- Compound component: `Chat` (wrapper), `Chat.Messages` (auto-rendered list), `Chat.Message` (single bubble), and `Chat.Composer` (text field + send button).
- `Chat` owns the conversation as an array of entries — `{ id, reasoner: "ai" | "user", timestamp, message }` — held in internal state and exposed to descendants through `ChatContext`/`useChatContext`, mirroring the `Form`/`FormContext` pattern.
- `Chat` accepts `initialEntries` (`{ reasoner, timestamp, message }[]`, `id` generated automatically) to seed the conversation, and an `onEntry` callback fired with the full entry whenever one is appended.
- `Chat.Messages` maps `entries` from context into `Chat.Message`s automatically, oldest first; `Chat.Message` can also be rendered standalone (outside a `<Chat>`) for fully manual layouts.
- `Chat.Message` renders a bordered bubble with a small square `Avatar` and a `NAME · hh:mm` header, aligned flush left for `reasoner="ai"` and flush right (reversed) for `reasoner="user"`.
- `Chat.Composer` is a single-line field wired to the enclosing `Chat`: Enter or the send button appends a new entry via `addEntry`, clears the field, and calls `onSubmit`; blank/whitespace-only input is ignored.

---

## Code Conventions
- Uses `cx()` from `src/utils/cx.utils.ts` for all conditional className merging.
- BEM classes prefixed `eink-`: block `.eink-chat`, elements `.eink-chat__messages`, `.eink-chat__composer(-input|-send)`, and the separate block `.eink-chat-message` (`__avatar`, `__bubble`, `__header`, `__content`) with modifiers `.eink-chat-message--ai` / `--user`.
- Imports its own `chat.component.css`.
- Stateful context logic lives in a co-located `chat.context.ts` (`ChatContext`, `useChatContext`), separate from the presentational `chat.component.tsx`, matching the same pattern as `form`/`calendar`.
- Delegates timestamp formatting to the shared `formatChatTimestamp` utility (`src/utils/chat.utils.ts`, `hh:mm`) instead of formatting dates inline.
- Composes `Avatar` (initials avatar) and `Button.Icon` (send button, `icon="arrow-up"`) rather than reimplementing either.

---

## Primary Use Cases
- An offline/local AI assistant chat window (as in the reference screenshot), where messages and rich content render as plain e-ink-safe components.
- Any timestamped, two-party (`"ai"` | `"user"`) conversation thread that needs to be appended to over time, with or without a visible composer.

---

## Limits & Restrictions
- `reasoner` only supports two values, `"ai"` and `"user"` — there is no support for multi-participant conversations.
- `Chat.Composer` is single-line only; Enter always submits, there is no multi-line/Shift+Enter newline support.
- `useChatContext` (used internally by `Chat.Messages` and `Chat.Composer`) throws if called outside a `<Chat>`.
- Entry `id`s for `initialEntries` are generated positionally (`initial-<index>`) and for appended entries from `Date.now()` plus a random suffix — neither is guaranteed globally unique across remounts/concurrent appends, so don't rely on them as external identifiers.

---

## Component-Specific CSS & Tokens
- No new custom properties are introduced; `chat.component.css` uses global tokens only (`--eink-size-*`, `--eink-border-medium`, `--eink-border-thin`, `--eink-color-*`, `--eink-font-family-*`).
- Notable BEM modifiers: `.eink-chat-message--ai` / `--user` (alignment and avatar/bubble side).

---

## Related Concepts
- `src/components/form/` — the `Form`/`FormContext` composite-component-with-context pattern `Chat` follows.
- `src/components/avatar/` — provides the initials `Avatar` used in each `Chat.Message`.
- `src/components/button/` — provides `Button.Icon` used for the composer's send action.
- `src/components/log/` — another timestamped-entry list component, using `formatLogTimestamp` the way `Chat` uses `formatChatTimestamp`.
