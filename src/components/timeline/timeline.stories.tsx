import type { Meta, StoryObj } from "@storybook/react-vite";
import { Timeline } from "./timeline.component";

const meta = {
  title: "Components/Data Display/Timeline",
  component: Timeline,
  tags: ["autodocs"],
} satisfies Meta<typeof Timeline>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Timeline>
      <Timeline.Item time="08:30" title="Stand-up" state="done">
        Daily sync.
      </Timeline.Item>
      <Timeline.Item time="11:00" title="Review" state="done">
        Approved release notes.
      </Timeline.Item>
      <Timeline.Item time="14:00" title="Deploy" state="pending">
        Pushing v1.4.0.
      </Timeline.Item>
      <Timeline.Item time="17:30" title="Postmortem" state="todo">
        Pending writeup.
      </Timeline.Item>
    </Timeline>
  ),
};

export const States: Story = {
  render: () => (
    <Timeline>
      <Timeline.Item time="08:30" title="Done" state="done">
        Already completed.
      </Timeline.Item>
      <Timeline.Item time="11:00" title="Pending" state="pending">
        Currently in progress.
      </Timeline.Item>
      <Timeline.Item time="14:00" title="Todo" state="todo">
        Not started yet.
      </Timeline.Item>
    </Timeline>
  ),
};
