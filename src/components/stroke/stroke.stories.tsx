import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stroke } from "./stroke.component";

const meta = {
  title: "Components/Typography/Stroke",
  component: Stroke,
  tags: ["autodocs"],
  args: {
    children: "no longer available",
  },
} satisfies Meta<typeof Stroke>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const InParagraph: Story = {
  render: () => (
    <p style={{ maxWidth: 480, lineHeight: 1.8 }}>
      The original price was <Stroke>$49.99</Stroke> and is now $29.99.
    </p>
  ),
};
