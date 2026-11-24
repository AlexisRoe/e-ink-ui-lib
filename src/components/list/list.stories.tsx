import type { Meta, StoryObj } from "@storybook/react-vite";
import { List } from "./list.component";

const meta = {
  title: "Components/Layout/List",
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

export const WrappedItems: Story = {
  render: (args) => (
    <List {...args} style={{ maxWidth: "20rem" }}>
      <List.Item>
        A long item that wraps onto several lines keeps its marker aligned with the first line of
        text instead of floating in the middle.
      </List.Item>
      <List.Item>Short item</List.Item>
    </List>
  ),
};
