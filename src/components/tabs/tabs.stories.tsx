import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tabs } from "./tabs.component";

const meta = {
  title: "Components/Layout/Tabs",
  component: Tabs,
  tags: ["autodocs"],
  argTypes: {
    defaultId: { control: "text" },
    fullHeight: { control: "boolean" },
  },
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    defaultId: "billing",
  },
  render: (args) => (
    <Tabs {...args}>
      <Tabs.Item id="overview">Overview</Tabs.Item>
      <Tabs.Item id="details">Details</Tabs.Item>
      <Tabs.Item id="billing">Billing</Tabs.Item>
      <Tabs.Content id="overview">
        A summary of account activity across all connected devices.
      </Tabs.Content>
      <Tabs.Content id="details">
        Granular line items, timestamps, and device identifiers.
      </Tabs.Content>
      <Tabs.Content id="billing">
        Current plan, next invoice date, and payment method on file.
      </Tabs.Content>
    </Tabs>
  ),
};

export const FullHeight: Story = {
  args: {
    defaultId: "overview",
    fullHeight: true,
  },
  render: (args) => (
    <div style={{ height: 320 }}>
      <Tabs {...args}>
        <Tabs.Item id="overview">Overview</Tabs.Item>
        <Tabs.Item id="details">Details</Tabs.Item>
        <Tabs.Content id="overview">
          This panel stretches to fill the height of its 320px parent, however short its content.
        </Tabs.Content>
        <Tabs.Content id="details">Granular line items and timestamps.</Tabs.Content>
      </Tabs>
    </div>
  ),
};

export const NoDefaultId: Story = {
  render: (args) => (
    <Tabs {...args}>
      <Tabs.Item id="overview">Overview</Tabs.Item>
      <Tabs.Item id="details">Details</Tabs.Item>
      <Tabs.Content id="overview">
        Selects the first tab (Overview) when no defaultId is set.
      </Tabs.Content>
      <Tabs.Content id="details">Granular line items and timestamps.</Tabs.Content>
    </Tabs>
  ),
};
