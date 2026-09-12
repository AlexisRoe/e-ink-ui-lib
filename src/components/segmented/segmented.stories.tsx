import type { Meta, StoryObj } from "@storybook/react-vite";
import { Segmented } from "./segmented.component";

const meta = {
  title: "Components/Actions/Segmented",
  component: Segmented,
  tags: ["autodocs"],
  argTypes: {
    defaultId: { control: "text" },
    fullWidth: { control: "boolean" },
  },
} satisfies Meta<typeof Segmented>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultId: "year",
  },
  render: (args) => (
    <Segmented {...args}>
      <Segmented.Item id="day">Day</Segmented.Item>
      <Segmented.Item id="week">Week</Segmented.Item>
      <Segmented.Item id="month">Month</Segmented.Item>
      <Segmented.Item id="year">Year</Segmented.Item>
    </Segmented>
  ),
};

export const FullWidth: Story = {
  args: {
    defaultId: "week",
    fullWidth: true,
  },
  render: (args) => (
    <div style={{ width: 480 }}>
      <Segmented {...args}>
        <Segmented.Item id="day">Day</Segmented.Item>
        <Segmented.Item id="week">Week</Segmented.Item>
        <Segmented.Item id="month">Month</Segmented.Item>
        <Segmented.Item id="year">Year</Segmented.Item>
      </Segmented>
    </div>
  ),
};

export const NoDefaultValue: Story = {
  render: (args) => (
    <Segmented {...args}>
      <Segmented.Item id="day">Day</Segmented.Item>
      <Segmented.Item id="week">Week</Segmented.Item>
      <Segmented.Item id="month">Month</Segmented.Item>
      <Segmented.Item id="year">Year</Segmented.Item>
    </Segmented>
  ),
};
