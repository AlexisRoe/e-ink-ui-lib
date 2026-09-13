import type { Meta, StoryObj } from "@storybook/react-vite";
import { Stepper } from "./stepper.component";

const meta = {
  title: "Components/Data Display/Stepper",
  component: Stepper,
  tags: ["autodocs"],
  argTypes: {
    initialIndex: {
      control: "number",
      description: "Index of the step highlighted when the stepper first renders.",
    },
    currentIndex: {
      control: "number",
      description: "Index of the step to highlight, overriding initialIndex when different.",
    },
    fullWidth: {
      control: "boolean",
      description: "Stretches the stepper to 100% of its parent's width. Defaults to true.",
    },
  },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    initialIndex: 1,
  },
  render: (args) => (
    <Stepper {...args}>
      <Stepper.Item title="Ordered">28 Aug, 09:12</Stepper.Item>
      <Stepper.Item title="Packed">Fulfillment Leipzig</Stepper.Item>
      <Stepper.Item title="In transit">DHL · 0034043471</Stepper.Item>
      <Stepper.Item title="Delivered">Against signature</Stepper.Item>
    </Stepper>
  ),
};

export const TwoSteps: Story = {
  render: () => (
    <Stepper initialIndex={0}>
      <Stepper.Item title="Cart" />
      <Stepper.Item title="Checkout" />
    </Stepper>
  ),
};

export const ThreeSteps: Story = {
  render: () => (
    <Stepper initialIndex={2}>
      <Stepper.Item title="Details" />
      <Stepper.Item title="Shipping" />
      <Stepper.Item title="Confirmation" />
    </Stepper>
  ),
};

export const NotFullWidth: Story = {
  render: () => (
    <Stepper initialIndex={0} fullWidth={false}>
      <Stepper.Item title="Draft" />
      <Stepper.Item title="Review" />
      <Stepper.Item title="Published" />
    </Stepper>
  ),
};

export const CurrentIndexOverride: Story = {
  render: () => (
    <Stepper initialIndex={0} currentIndex={2}>
      <Stepper.Item title="Ordered">28 Aug, 09:12</Stepper.Item>
      <Stepper.Item title="Packed">Fulfillment Leipzig</Stepper.Item>
      <Stepper.Item title="In transit">DHL · 0034043471</Stepper.Item>
      <Stepper.Item title="Delivered">Against signature</Stepper.Item>
    </Stepper>
  ),
};
