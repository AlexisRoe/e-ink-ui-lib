import { fireEvent, render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Chat } from "./chat.component";

const timestamp = new Date(2026, 8, 14, 9, 41);

describe("Chat", () => {
  it("renders initial entries via Chat.Messages", () => {
    const { getByText } = render(
      <Chat initialEntries={[{ reasoner: "user", timestamp, message: "Hi there" }]}>
        <Chat.Messages />
      </Chat>,
    );
    expect(getByText("Hi there")).toBeInTheDocument();
  });

  it("renders an empty conversation when initialEntries is omitted", () => {
    const { container } = render(
      <Chat>
        <Chat.Messages />
      </Chat>,
    );
    expect(container.querySelectorAll(".eink-chat-message")).toHaveLength(0);
  });

  it("labels a user entry 'You' and an ai entry 'Assistant' by default", () => {
    const { getByText } = render(
      <Chat
        initialEntries={[
          { reasoner: "user", timestamp, message: "Hi" },
          { reasoner: "ai", timestamp, message: "Hello" },
        ]}
      >
        <Chat.Messages />
      </Chat>,
    );
    expect(getByText("You · 09:41")).toBeInTheDocument();
    expect(getByText("Assistant · 09:41")).toBeInTheDocument();
  });

  it("applies the reasoner modifier class to each message", () => {
    const { container } = render(
      <Chat
        initialEntries={[
          { reasoner: "user", timestamp, message: "Hi" },
          { reasoner: "ai", timestamp, message: "Hello" },
        ]}
      >
        <Chat.Messages />
      </Chat>,
    );
    const messages = container.querySelectorAll(".eink-chat-message");
    expect(messages[0]).toHaveClass("eink-chat-message--user");
    expect(messages[1]).toHaveClass("eink-chat-message--ai");
  });

  it("appends a new entry and clears the field when the composer is submitted", () => {
    const { getByText, getByLabelText } = render(
      <Chat>
        <Chat.Messages />
        <Chat.Composer />
      </Chat>,
    );
    const input = getByLabelText("Type a message") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "New message" } });
    fireEvent.click(getByLabelText("Send message"));
    expect(getByText("New message")).toBeInTheDocument();
    expect(input.value).toBe("");
  });

  it("appends a new entry on Enter", () => {
    const { getByText, getByLabelText } = render(
      <Chat>
        <Chat.Messages />
        <Chat.Composer />
      </Chat>,
    );
    const input = getByLabelText("Type a message");
    fireEvent.change(input, { target: { value: "Sent via enter" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(getByText("Sent via enter")).toBeInTheDocument();
  });

  it("does not append an entry for a blank message", () => {
    const { container, getByLabelText } = render(
      <Chat>
        <Chat.Messages />
        <Chat.Composer />
      </Chat>,
    );
    const input = getByLabelText("Type a message");
    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(container.querySelectorAll(".eink-chat-message")).toHaveLength(0);
  });

  it("calls onEntry with the appended entry", () => {
    let received: unknown;
    const { getByLabelText } = render(
      <Chat onEntry={(entry) => (received = entry)}>
        <Chat.Messages />
        <Chat.Composer />
      </Chat>,
    );
    const input = getByLabelText("Type a message");
    fireEvent.change(input, { target: { value: "Track me" } });
    fireEvent.keyDown(input, { key: "Enter" });
    expect(received).toMatchObject({ reasoner: "user", message: "Track me" });
  });

  it("throws when Chat.Messages is used outside a Chat", () => {
    const { Messages } = Chat;
    expect(() => render(<Messages />)).toThrow("useChatContext must be used within a <Chat>");
  });

  it("merges a custom className", () => {
    const { container } = render(
      <Chat className="custom">
        <Chat.Messages />
      </Chat>,
    );
    expect(container.querySelector(".eink-chat")).toHaveClass("custom");
  });
});
