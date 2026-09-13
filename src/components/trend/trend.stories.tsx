import type { Meta, StoryObj } from "@storybook/react-vite";
import { Trend } from "./trend.component";

const meta = {
  title: "Components/Numbers/Trend",
  component: Trend,
  tags: ["autodocs"],
  args: {
    direction: "up",
    children: "0.6",
  },
  argTypes: {
    direction: {
      control: "radio",
      options: ["up", "down", "none"],
      description: "Direction of the change.",
    },
    size: {
      control: "radio",
      options: ["sm", "md", "xl"],
      description: "Size of the trend. Defaults to md.",
    },
    children: {
      control: "text",
      description: "Content rendered alongside the direction indicator.",
    },
  },
} satisfies Meta<typeof Trend>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Up: Story = {};

export const Down: Story = {
  args: {
    direction: "down",
    children: "-0.6",
  },
};

export const NoChange: Story = {
  args: {
    direction: "none",
    children: "0.0",
  },
};

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
