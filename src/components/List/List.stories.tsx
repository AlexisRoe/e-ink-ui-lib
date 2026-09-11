import type { Meta, StoryObj } from "@storybook/react-vite";
import { List } from "./List";

const meta = {
  title: "Components/List",
  component: List,
  tags: ["autodocs"],
  argTypes: {
    as: { control: "select", options: ["unordered", "ordered", "detailed"] },
  },
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Unordered: Story = {
  render: (args) => (
    <List {...args}>
      <List.Item>First item</List.Item>
      <List.Item>Second item</List.Item>
      <List.Item>Third item</List.Item>
    </List>
  ),
};

export const Ordered: Story = {
  args: { as: "ordered" },
  render: (args) => (
    <List {...args}>
      <List.Item>First item</List.Item>
      <List.Item>Second item</List.Item>
      <List.Item>Third item</List.Item>
    </List>
  ),
};

export const Detailed: Story = {
  args: { as: "detailed" },
  render: (args) => (
    <List {...args}>
      <List.Item title="Annual report" description="Finance · 2026" />
      <List.Item title="Sustainability" description="Operations · 2026" />
      <List.Item title="Roadmap" description="Product · 2026" />
    </List>
  ),
};
