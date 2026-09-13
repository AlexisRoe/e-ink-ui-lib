import type { Meta, StoryObj } from "@storybook/react-vite";
import { Todo } from "./todo.component";

const meta = {
  title: "Components/Data Display/Todo",
  component: Todo,
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "Optional title rendered above the list of items.",
    },
    onChange: {
      description: "Called with the id and new checked state whenever an item is toggled.",
    },
  },
} satisfies Meta<typeof Todo>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Todo {...args}>
      <Todo.Item id="water-plants">Water the plants</Todo.Item>
      <Todo.Item id="feed-cat">Feed the cat</Todo.Item>
      <Todo.Item id="pay-rent">Pay rent</Todo.Item>
    </Todo>
  ),
};

export const WithoutIds: Story = {
  render: (args) => (
    <Todo {...args} title="Untitled items report their index">
      <Todo.Item>Water the plants</Todo.Item>
      <Todo.Item>Feed the cat</Todo.Item>
    </Todo>
  ),
};

export const WithTitle: Story = {
  render: (args) => (
    <Todo {...args} title="Today">
      <Todo.Item id="water-plants">Water the plants</Todo.Item>
      <Todo.Item id="feed-cat">Feed the cat</Todo.Item>
    </Todo>
  ),
};

export const WithInitialState: Story = {
  render: (args) => (
    <Todo {...args} title="Groceries">
      <Todo.Item id="milk" initialState>
        Milk
      </Todo.Item>
      <Todo.Item id="eggs">Eggs</Todo.Item>
      <Todo.Item id="bread" initialState>
        Bread
      </Todo.Item>
    </Todo>
  ),
};
