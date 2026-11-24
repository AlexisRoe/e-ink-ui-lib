import type { Meta, StoryObj } from "@storybook/react-vite";
import { RichText } from "./rich-text.component";

const meta = {
  title: "Components/Typography/RichText",
  component: RichText,
  tags: ["autodocs"],
  argTypes: { mono: { control: "boolean" } },
} satisfies Meta<typeof RichText>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { text: "Passwords should be **long** and **unique** for every service." },
};

export const Mono: Story = {
  args: { text: "Passwords should be **long** and **unique** for every service.", mono: true },
};
