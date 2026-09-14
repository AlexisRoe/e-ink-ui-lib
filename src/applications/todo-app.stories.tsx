import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Checkbox } from "../components/checkbox/checkbox.component";
import { Container } from "../components/container/container.component";
import { Flex } from "../components/flex/flex.component";
import { ProgressBar } from "../components/progress-bar/progress-bar.component";
import { Space } from "../components/space/space.component";
import { Title } from "../components/title/title.component";
import { Todo } from "../components/todo/todo.component";

/**
 * Example composition: a todo application combining `Todo` for the task
 * list, a `Checkbox.Group` for category filters, and `ProgressBar` to track
 * completion — all inside a `Container`/`Flex` layout.
 */
const meta = {
  title: "Applications/Todo App",
  component: Todo,
  tags: ["autodocs"],
} satisfies Meta<typeof Todo>;

export default meta;
type Story = StoryObj<typeof meta>;

function TodoAppDemo() {
  const initialItems = [
    { id: "water-plants", label: "Water the plants", done: false },
    { id: "feed-cat", label: "Feed the cat", done: true },
    { id: "pay-rent", label: "Pay rent", done: false },
    { id: "groceries", label: "Buy groceries", done: false },
    { id: "call-dentist", label: "Call the dentist", done: true },
  ];
  const [done, setDone] = useState<Record<string, boolean>>(
    Object.fromEntries(initialItems.map((item) => [item.id, item.done])),
  );
  const [categories, setCategories] = useState<string[]>(["home", "errands"]);

  const completedCount = Object.values(done).filter(Boolean).length;
  const percent = Math.round((completedCount / initialItems.length) * 100);

  return (
    <Container withBorder fullWidth style={{ maxWidth: 420, padding: "1rem" }}>
      <Flex column gap="md">
        <Title size="3">Today</Title>
        <Checkbox.Group label="Categories" value={categories} onChange={setCategories}>
          <Checkbox value="home">Home</Checkbox>
          <Checkbox value="errands">Errands</Checkbox>
          <Checkbox value="work">Work</Checkbox>
        </Checkbox.Group>
        <Space />
        <Todo
          title="Tasks"
          onChange={(id, checked) => setDone((prev) => ({ ...prev, [String(id)]: checked }))}
        >
          {initialItems.map((item) => (
            <Todo.Item key={item.id} id={item.id} initialState={item.done}>
              {item.label}
            </Todo.Item>
          ))}
        </Todo>
        <Space />
        <ProgressBar value={percent} label="Completed" />
      </Flex>
    </Container>
  );
}

export const Default: Story = {
  args: { children: null },
  render: () => <TodoAppDemo />,
};
