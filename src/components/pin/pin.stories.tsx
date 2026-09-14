import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Flex } from "../flex/flex.component";
import { Pin } from "./pin.component";

const meta = {
  title: "Components/Forms/Pin",
  component: Pin,
  tags: ["autodocs"],
  argTypes: {
    length: { control: "number" },
    useMask: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
  },
} satisfies Meta<typeof Pin>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: "",
    length: 4,
    children: "PIN code",
  },
  render: (args) => {
    const [value, setValue] = useState(args.value ?? "");

    return (
      <Flex column gap="sm">
        <Pin {...args} value={value} onChange={setValue}>
          {args.children}
        </Pin>
        <span>Value: {value}</span>
      </Flex>
    );
  },
};

export const Unmasked: Story = {
  args: {
    value: "",
    length: 6,
    useMask: false,
    children: "One-time code",
  },
  render: (args) => {
    const [value, setValue] = useState(args.value ?? "");

    return (
      <Flex column gap="sm">
        <Pin {...args} value={value} onChange={setValue}>
          {args.children}
        </Pin>
        <span>Value: {value}</span>
      </Flex>
    );
  },
};

export const Prefilled: Story = {
  args: {
    value: "12",
    length: 4,
    children: "PIN code",
  },
  render: (args) => {
    const [value, setValue] = useState(args.value ?? "");

    return (
      <Flex column gap="sm">
        <Pin {...args} value={value} onChange={setValue}>
          {args.children}
        </Pin>
        <span>Value: {value}</span>
      </Flex>
    );
  },
};

export const Disabled: Story = {
  args: {
    value: "12",
    length: 4,
    disabled: true,
    children: "PIN code",
  },
};

export const Required: Story = {
  args: {
    value: "",
    length: 4,
    required: true,
    children: "PIN code",
  },
};
