import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text } from "./text.component";

const meta = {
  title: "Components/Typography/Text",
  component: Text,
  tags: ["autodocs"],
  argTypes: {
    as: { control: "select", options: ["p", "span"] },
  },
} satisfies Meta<typeof Text>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Paragraph: Story = {
  args: {
    children: "Your device is fully charged and ready for offline reading.",
  },
};

export const Span: Story = {
  args: {
    as: "span",
    children: "Inline text",
  },
};
