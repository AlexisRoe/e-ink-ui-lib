import type { Meta, StoryObj } from "@storybook/react-vite";
import { Space } from "./Space";

const meta = {
  title: "Components/Layout/Space",
  component: Space,
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: [2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 36, 48, 64, 128],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ border: "1px dashed #999" }}>
        <div>Above</div>
        <Story />
        <div>Below</div>
      </div>
    ),
  ],
} satisfies Meta<typeof Space>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    size: 16,
  },
};

export const AllSizes: Story = {
  render: () => (
    <div>
      {([2, 4, 6, 8, 10, 12, 14, 16, 20, 24, 36, 48, 64, 128] as const).map((size) => (
        <div key={size} style={{ border: "1px dashed #999", marginBottom: 8 }}>
          <div>size={size}</div>
          <Space size={size} />
          <div>size={size}</div>
        </div>
      ))}
    </div>
  ),
};
