import type { Meta, StoryObj } from "@storybook/react-vite";
import { Log } from "./log.component";

const meta = {
  title: "Components/Data Display/Log",
  component: Log,
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text" },
    withBorder: { control: "boolean" },
  },
} satisfies Meta<typeof Log>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Log title="Line 2">
      <Log.Item state="critical" timeStamp={new Date(2026, 0, 1, 11, 31, 44)} source="CELL-1">
        Safety guard opened during motion
      </Log.Item>
      <Log.Item state="error" timeStamp={new Date(2026, 0, 1, 11, 20, 3)} source="PRESS-7" ack>
        Cycle aborted
      </Log.Item>
      <Log.Item state="warning" timeStamp={new Date(2026, 0, 1, 11, 14, 52)} source="PRESS-7">
        Torque above tolerance (18.4 Nm)
      </Log.Item>
      <Log.Item state="info" timeStamp={new Date(2026, 0, 1, 11, 2, 11)} source="LINE-2">
        Batch 4471 started
      </Log.Item>
    </Log>
  ),
};

export const WithoutBorder: Story = {
  render: () => (
    <Log withBorder={false}>
      <Log.Item state="info" timeStamp={new Date(2026, 0, 1, 11, 2, 11)} source="LINE-2">
        Batch 4471 started
      </Log.Item>
      <Log.Item state="warning" timeStamp={new Date(2026, 0, 1, 11, 14, 52)} source="PRESS-7">
        Torque above tolerance (18.4 Nm)
      </Log.Item>
    </Log>
  ),
};

export const WithoutSource: Story = {
  render: () => (
    <Log>
      <Log.Item state="info" timeStamp={new Date(2026, 0, 1, 11, 2, 11)}>
        Batch 4471 started
      </Log.Item>
    </Log>
  ),
};
