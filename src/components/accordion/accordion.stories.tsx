import type { Meta, StoryObj } from "@storybook/react-vite";
import { Accordion } from "./accordion.component";

const meta = {
  title: "Components/Layout/Accordion",
  component: Accordion,
  tags: ["autodocs"],
  argTypes: {
    defaultOpenId: { control: "text" },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Accordion {...args} style={{ maxWidth: 480 }}>
      <Accordion.Item id="shipping" summary="Shipping">
        Orders ship within 3 business days.
      </Accordion.Item>
      <Accordion.Item id="returns" summary="Returns">
        Items can be returned within 30 days of delivery.
      </Accordion.Item>
      <Accordion.Item id="warranty" summary="Warranty">
        All products carry a 2-year limited warranty.
      </Accordion.Item>
    </Accordion>
  ),
};

export const WithDefaultOpenId: Story = {
  args: {
    defaultOpenId: "returns",
  },
  render: (args) => (
    <Accordion {...args} style={{ maxWidth: 480 }}>
      <Accordion.Item id="shipping" summary="Shipping">
        Orders ship within 3 business days.
      </Accordion.Item>
      <Accordion.Item id="returns" summary="Returns">
        Items can be returned within 30 days of delivery.
      </Accordion.Item>
      <Accordion.Item id="warranty" summary="Warranty">
        All products carry a 2-year limited warranty.
      </Accordion.Item>
    </Accordion>
  ),
};

export const StandaloneItem: Story = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <Accordion.Item summary="Frequently asked question">
        Accordion.Item can be rendered on its own, without a parent Accordion.
      </Accordion.Item>
    </div>
  ),
};

export const StandaloneItemOpenByDefault: Story = {
  render: () => (
    <div style={{ maxWidth: 480 }}>
      <Accordion.Item summary="Frequently asked question" openByDefault>
        Rendered already open via the `openByDefault` prop.
      </Accordion.Item>
    </div>
  ),
};
