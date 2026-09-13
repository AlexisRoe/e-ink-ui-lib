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

export const Sizes: Story = {
  render: ({ direction, children }) => (
    <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
      <Trend direction={direction} size="sm">
        {children}
      </Trend>
      <Trend direction={direction} size="md">
        {children}
      </Trend>
      <Trend direction={direction} size="xl">
        {children}
      </Trend>
    </div>
  ),
};

export const Full: Story = {
  render: (args) => (
    <Trend.Full direction={args.direction}>Decreased by 1.60 from € 14.50</Trend.Full>
  ),
  args: {
    direction: "down",
  },
};
