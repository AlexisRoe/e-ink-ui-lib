import type { Meta, StoryObj } from "@storybook/react-vite";
import { LastUpdated } from "./last-updated.component";

const meta = {
  title: "Components/Data Display/LastUpdated",
  component: LastUpdated,
  tags: ["autodocs"],
  args: {
    date: new Date(),
    children: "$42.00",
  },
  argTypes: {
    date: { control: "date" },
    stale: { control: "number" },
    expired: { control: "number" },
    withBorder: { control: "boolean" },
  },
} satisfies Meta<typeof LastUpdated>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Fresh: Story = {};

export const Stale: Story = {
  args: {
    date: new Date(Date.now() - 90_000),
  },
};

export const Expired: Story = {
  args: {
    date: new Date(Date.now() - 600_000),
  },
};

export const CustomThresholds: Story = {
  args: {
    date: new Date(Date.now() - 45_000),
    stale: 30,
    expired: 120,
  },
};

export const CustomLabels: Story = {
  args: {
    date: new Date(Date.now() - 600_000),
    statusLabels: {
      fresh: "up to date",
      stale: "check soon",
      expired: "outdated",
    },
  },
};

export const WithoutBorder: Story = {
  args: {
    withBorder: false,
  },
};

export const CustomMinutesAgoFormat: Story = {
  args: {
    date: new Date(Date.now() - 600_000),
    formatMinutesAgo: (minutes) => `updated ${minutes}m ago`,
  },
};
