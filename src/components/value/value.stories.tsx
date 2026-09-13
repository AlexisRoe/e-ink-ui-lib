import type { Meta, StoryObj } from "@storybook/react-vite";
import { Value } from "./value.component";

const meta = {
  title: "Components/Numbers/Value",
  component: Value,
  tags: ["autodocs"],
  args: {
    children: 44,
    unit: "%",
  },
  argTypes: {
    children: {
      control: "text",
      description: "The value to display.",
    },
    unit: {
      control: "text",
      description: "Unit rendered alongside the value.",
    },
    size: {
      control: "radio",
      options: ["sm", "md", "xl"],
      description: "Size of the value. Defaults to md.",
    },
  },
} satisfies Meta<typeof Value>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Small: Story = {
  args: {
    size: "sm",
  },
};

export const ExtraLarge: Story = {
  args: {
    size: "xl",
  },
};

export const Temperature: Story = {
  args: {
    children: 21.4,
    unit: "°C",
  },
};
