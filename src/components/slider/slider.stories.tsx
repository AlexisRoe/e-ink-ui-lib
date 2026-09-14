import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Flex } from "../flex/flex.component";
import { Slider } from "./slider.component";

const meta = {
  title: "Components/Forms/Slider",
  component: Slider,
  tags: ["autodocs"],
  argTypes: {
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    orientation: { control: "radio", options: ["horizontal", "vertical"] },
  },
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  args: {
    value: 3,
    min: 0,
    max: 10,
    children: "Brightness",
  },
  render: (args) => {
    const [value, setValue] = useState(args.value ?? 0);

    return (
      <Flex column gap="sm">
        <Slider {...args} value={value} onChange={setValue}>
          {args.children}
        </Slider>
        <span>Value: {value}</span>
      </Flex>
    );
  },
};

export const Vertical: Story = {
  args: {
    value: 3,
    min: 0,
    max: 10,
    orientation: "vertical",
    children: "Volume",
  },
  render: (args) => {
    const [value, setValue] = useState(args.value ?? 0);

    return (
      <Flex column gap="sm">
        <Slider {...args} value={value} onChange={setValue}>
          {args.children}
        </Slider>
        <span>Value: {value}</span>
      </Flex>
    );
  },
};

export const Stepped: Story = {
  args: {
    value: 20,
    min: 0,
    max: 100,
    step: 20,
    children: "Volume",
  },
  render: (args) => {
    const [value, setValue] = useState(args.value ?? 0);

    return (
      <Flex column gap="sm">
        <Slider {...args} value={value} onChange={setValue}>
          {args.children}
        </Slider>
        <span>Value: {value}</span>
      </Flex>
    );
  },
};

export const Disabled: Story = {
  args: {
    value: 5,
    min: 0,
    max: 10,
    disabled: true,
    children: "Brightness",
  },
};

export const Required: Story = {
  args: {
    value: 0,
    min: 0,
    max: 10,
    required: true,
    children: "Brightness",
  },
};
