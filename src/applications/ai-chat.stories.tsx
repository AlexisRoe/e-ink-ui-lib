import type { Meta, StoryObj } from "@storybook/react-vite";
import { Chat } from "../components/chat/chat.component";
import { Container } from "../components/container/container.component";
import { Space } from "../components/space/space.component";
import { Title } from "../components/title/title.component";

/**
 * Example composition: an AI chat application built entirely from the
 * `Chat` composite (`Chat.Messages` + `Chat.Composer`), wrapped in a
 * `Container` with a `Title` as the app header. Demonstrates a realistic
 * e-ink assistant conversation.
 */
const meta = {
  title: "Applications/AI Chat",
  component: Chat,
  tags: ["autodocs"],
} satisfies Meta<typeof Chat>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: null },
  render: () => (
    <Container withBorder fullWidth style={{ maxWidth: 800, padding: "1rem" }}>
      <Title size={4} style={{ marginBottom: "var(--eink-size-md)" }}>
        Assistant
      </Title>
      <Space />
      <Chat
        initialEntries={[
          {
            reasoner: "user",
            timestamp: new Date(2026, 8, 14, 9, 12),
            message: "Summarize today's weather and my first meeting.",
          },
          {
            reasoner: "ai",
            timestamp: new Date(2026, 8, 14, 9, 12),
            message:
              'It\'s 9°C and overcast, clearing up by noon. Your first meeting is "Design review" at 11:30 in Room 2B.',
          },
          {
            reasoner: "user",
            timestamp: new Date(2026, 8, 14, 9, 14),
            message: "Remind me to bring the wireframes.",
          },
          {
            reasoner: "ai",
            timestamp: new Date(2026, 8, 14, 9, 14),
            message: "Noted. I'll remind you at 11:15.",
          },
        ]}
      >
        <Chat.Messages />
        <Chat.Composer placeholder="Ask the assistant…" />
      </Chat>
    </Container>
  ),
};
