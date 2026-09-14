import type { Meta, StoryObj } from "@storybook/react-vite";
import { Chat } from "./chat.component";

const meta = {
  title: "Components/Data Display/Chat",
  component: Chat,
  tags: ["autodocs"],
} satisfies Meta<typeof Chat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: null },
  render: () => (
    <Chat
      initialEntries={[
        {
          reasoner: "user",
          timestamp: new Date(2026, 8, 14, 9, 41),
          message: "What can you show me?",
        },
        {
          reasoner: "ai",
          timestamp: new Date(2026, 8, 14, 9, 41),
          message:
            "Quite a lot, for someone with no network connection. I am a chat dummy rendered entirely with EPaper components — avatars, tables, sparklines, meters and tags as rich chat content, all e-paper safe.",
        },
      ]}
    >
      <Chat.Messages />
      <Chat.Composer />
    </Chat>
  ),
};

export const StaticMessages: Story = {
  args: { children: null },
  render: () => (
    <Chat>
      <Chat.Messages />
      <Chat.Message reasoner="user" timestamp={new Date(2026, 8, 14, 9, 41)}>
        What can you show me?
      </Chat.Message>
      <Chat.Message reasoner="ai" timestamp={new Date(2026, 8, 14, 9, 41)} name="EPaper Assistant">
        Quite a lot, for someone with no network connection.
      </Chat.Message>
    </Chat>
  ),
};

export const EmptyConversation: Story = {
  args: { children: null },
  render: () => (
    <Chat>
      <Chat.Messages />
      <Chat.Composer placeholder="Ask something…" />
    </Chat>
  ),
};
