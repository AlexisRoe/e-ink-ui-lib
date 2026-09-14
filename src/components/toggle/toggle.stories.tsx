import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Flex } from "../flex/flex.component";
import { Toggle } from "./toggle.component";

const meta = {
  title: "Components/Forms/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
  },
} satisfies Meta<typeof Toggle>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    checked: false,
    children: "Notifications",
  },
  render: (args) => {
    const [checked, setChecked] = useState(args.checked ?? false);

    return (
      <Flex column gap="sm">
        <Toggle {...args} checked={checked} onChange={setChecked}>
          {args.children}
        </Toggle>
        <span>Value: {checked ? "true" : "false"}</span>
      </Flex>
    );
  },
};

export const Disabled: Story = {
  args: {
    checked: true,
    disabled: true,
    children: "Notifications",
  },
};

export const Required: Story = {
  args: {
    checked: false,
    required: true,
    children: "Accept terms",
  },
};
