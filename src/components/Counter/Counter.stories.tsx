import type { Meta, StoryObj } from "@storybook/react-vite";
import { Counter } from "./Counter.component";

const meta = {
  title: "Components/Data Display/Counter",
  component: Counter,
  tags: ["autodocs"],
  args: {
    label: "Inbox",
  },
} satisfies Meta<typeof Counter>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithDot: Story = {
  args: {
    dot: true,
  },
};

export const WithCount: Story = {
  args: {
    count: 5,
  },
};

export const OverflowCount: Story = {
  args: {
    count: 132,
  },
};

export const Sizes: Story = {
  render: ({ label }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
      <Counter label={label} size="sm" count={5} />
      <Counter label={label} size="md" count={5} />
      <Counter label={label} size="xl" count={5} />
    </div>
  ),
};

export const DotSizes: Story = {
  render: ({ label }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
      <Counter label={label} size="sm" dot />
      <Counter label={label} size="md" dot />
      <Counter label={label} size="xl" dot />
    </div>
  ),
};

export const OverflowSizes: Story = {
  render: ({ label }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
      <Counter label={label} size="sm" count={132} />
      <Counter label={label} size="md" count={132} />
      <Counter label={label} size="xl" count={132} />
    </div>
  ),
};
