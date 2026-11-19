import type { Meta, StoryObj } from "@storybook/react-vite";
import { Inverted } from "./inverted.component";

const meta = {
  title: "Components/Layout/Inverted",
  component: Inverted,
  tags: ["autodocs"],
  argTypes: {
    active: { control: "boolean" },
  },
} satisfies Meta<typeof Inverted>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Today" },
};

export const Inactive: Story = {
  args: { active: false, children: "Not today" },
};
