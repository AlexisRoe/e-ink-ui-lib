import type { Meta, StoryObj } from "@storybook/react-vite";
import { Description } from "./description.component";

const meta = {
  title: "Components/Data Display/Description",
  component: Description,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    value: { control: "text" },
  },
} satisfies Meta<typeof Description>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Updated",
    value: "Today, 14:02",
  },
};

export const MultipleSiblings: Story = {
  args: {
    label: "Updated",
    value: "Today, 14:02",
  },
  render: () => (
    <div>
      <Description label="Updated" value="Today, 14:02" />
      <Description label="Author" value="Jane Doe" />
      <Description label="Status" value="Published" />
    </div>
  ),
};
