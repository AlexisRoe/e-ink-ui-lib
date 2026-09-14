import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Flex } from "../flex/flex.component";
import { TextArea } from "./text-area.component";

const meta = {
  title: "Components/Forms/TextArea",
  component: TextArea,
  tags: ["autodocs"],
  argTypes: {
    minHeight: { control: "text" },
    maxCharacters: { control: "number" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
  },
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: "",
    children: "Bio",
  },
  render: (args) => {
    const [value, setValue] = useState(args.value ?? "");

    return (
      <TextArea {...args} value={value} onChange={setValue}>
        {args.children}
      </TextArea>
    );
  },
};

export const WithCharacterLimit: Story = {
  args: {
    value: "Hello there",
    maxCharacters: 200,
    children: "Description",
  },
  render: (args) => {
    const [value, setValue] = useState(args.value ?? "");

    return (
      <TextArea {...args} value={value} onChange={setValue}>
        {args.children}
      </TextArea>
    );
  },
};

export const CustomMinHeight: Story = {
  args: {
    value: "",
    minHeight: "200px",
    children: "Notes",
  },
  render: (args) => {
    const [value, setValue] = useState(args.value ?? "");

    return (
      <TextArea {...args} value={value} onChange={setValue}>
        {args.children}
      </TextArea>
    );
  },
};

export const Required: Story = {
  args: {
    value: "",
    required: true,
    children: "Bio",
  },
};

export const Disabled: Story = {
  args: {
    value: "Can't touch this",
    disabled: true,
    children: "Bio",
  },
};

export const InAFlexRow: Story = {
  args: {
    value: "",
    children: "Bio",
  },
  render: (args) => (
    <Flex gap="md" style={{ width: "480px" }}>
      <TextArea {...args} />
    </Flex>
  ),
};
