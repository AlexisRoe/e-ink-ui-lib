import type { Meta, StoryObj } from "@storybook/react-vite";
import { Label } from "./label.component";

const meta = {
  title: "Components/Typography/Label",
  component: Label,
  tags: ["autodocs"],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Battery status",
  },
};
