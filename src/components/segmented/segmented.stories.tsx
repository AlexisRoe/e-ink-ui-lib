import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Card } from "../card/card.component";
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

const TAB_CARDS: Record<string, { title: string; content: string }> = {
  overview: {
    title: "Overview",
    content: "A summary of account activity across all connected devices.",
  },
  details: {
    title: "Details",
    content: "Granular line items, timestamps, and device identifiers.",
  },
  billing: {
    title: "Billing",
    content: "Current plan, next invoice date, and payment method on file.",
  },
};

function TabsWithCard() {
  const [activeId, setActiveId] = useState("overview");
  const active = TAB_CARDS[activeId];

  return (
    <div style={{ maxWidth: 480, display: "flex", flexDirection: "column", gap: 16 }}>
      <Segmented defaultId="overview" onChange={setActiveId}>
        <Segmented.Item id="overview">Overview</Segmented.Item>
        <Segmented.Item id="details">Details</Segmented.Item>
        <Segmented.Item id="billing">Billing</Segmented.Item>
      </Segmented>
      <Card>
        <Card.Header>
          <Card.Title>{active.title}</Card.Title>
        </Card.Header>
        <Card.Content>{active.content}</Card.Content>
      </Card>
    </div>
  );
}

export const AsTabs: Story = {
  render: () => <TabsWithCard />,
};
