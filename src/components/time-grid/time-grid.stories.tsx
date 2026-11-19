import type { Meta, StoryObj } from "@storybook/react-vite";
import { TimeGrid, type TimeGridItem } from "./time-grid.component";

const items: TimeGridItem[] = [
  { id: "standup", startMin: 540, durationMin: 30, content: "Stand-up", label: "Stand-up" },
  {
    id: "review",
    startMin: 550,
    durationMin: 90,
    content: "Design review",
    label: "Design review",
  },
  { id: "lunch", startMin: 720, durationMin: 60, content: "Lunch", label: "Lunch", done: true },
  {
    id: "launch",
    startMin: 840,
    durationMin: 60,
    content: "Launch",
    label: "Launch",
    emphasis: true,
  },
];

const meta = {
  title: "Components/Data Display/TimeGrid",
  component: TimeGrid,
  tags: ["autodocs"],
  args: {
    startHour: 8,
    endHour: 18,
    hourHeight: 80,
    minBlockHeight: 28,
    items,
    style: { height: 480 },
  },
  argTypes: {
    startHour: { control: "number" },
    endHour: { control: "number" },
    hourHeight: { control: "number" },
    nowMinutes: { control: "number" },
  },
} satisfies Meta<typeof TimeGrid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithNowMarker: Story = {
  args: { nowMinutes: 625, scrollToMinutes: 540, scrollKey: "now" },
};
