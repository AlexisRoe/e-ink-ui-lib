import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { OrderList } from "./order-list.component";

const meta = {
  title: "Components/Layout/OrderList",
  component: OrderList,
  tags: ["autodocs"],
} satisfies Meta<typeof OrderList>;

export default meta;
type Story = StoryObj<typeof meta>;

function Example({ disabled }: { disabled?: boolean }) {
  const [steps, setSteps] = useState(["Define scope", "Assess risks", "Select controls", "Review"]);
  return (
    <OrderList
      items={steps}
      onChange={setSteps}
      getKey={(step) => step}
      renderItem={(step) => step}
      disabled={disabled}
    />
  );
}

export const Default: Story = {
  args: { items: [], onChange: () => {}, getKey: String, renderItem: String },
  render: () => <Example />,
};

export const Disabled: Story = {
  args: { items: [], onChange: () => {}, getKey: String, renderItem: String },
  render: () => <Example disabled />,
};
