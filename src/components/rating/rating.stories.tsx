import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Flex } from "../flex/flex.component";
import { Form } from "../form/form.component";
import { Rating } from "./rating.component";

const meta = {
  title: "Components/Forms/Rating",
  component: Rating,
  tags: ["autodocs"],
  argTypes: {
    max: { control: "number" },
    icon: { control: "radio", options: ["heart", "star", "smiley"] },
    readOnly: { control: "boolean" },
    disabled: { control: "boolean" },
    withBorder: { control: "boolean" },
    withClear: { control: "boolean" },
  },
} satisfies Meta<typeof Rating>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: 0,
    max: 5,
    children: "How was your visit?",
  },
  render: (args) => {
    const [value, setValue] = useState(args.value ?? 0);

    return (
      <Rating {...args} value={value} onChange={setValue}>
        {args.children}
      </Rating>
    );
  },
};

export const Heart: Story = {
  args: {
    value: 3,
    max: 5,
    icon: "heart",
    children: "Favorite?",
  },
  render: (args) => {
    const [value, setValue] = useState(args.value ?? 0);

    return (
      <Rating {...args} value={value} onChange={setValue}>
        {args.children}
      </Rating>
    );
  },
};

export const Smiley: Story = {
  args: {
    value: 2,
    max: 5,
    icon: "smiley",
    children: "Mood",
  },
  render: (args) => {
    const [value, setValue] = useState(args.value ?? 0);

    return (
      <Rating {...args} value={value} onChange={setValue}>
        {args.children}
      </Rating>
    );
  },
};

export const WithClearButton: Story = {
  args: {
    value: 3,
    max: 5,
    withClear: true,
    children: "How was your visit?",
  },
  render: (args) => {
    const [value, setValue] = useState(args.value ?? 0);

    return (
      <Rating {...args} value={value} onChange={setValue}>
        {args.children}
      </Rating>
    );
  },
};

export const WithoutBorder: Story = {
  args: {
    value: 3,
    max: 5,
    withBorder: false,
    children: "How was your visit?",
  },
  render: (args) => {
    const [value, setValue] = useState(args.value ?? 0);

    return (
      <Rating {...args} value={value} onChange={setValue}>
        {args.children}
      </Rating>
    );
  },
};

export const ClampedInitialValue: Story = {
  args: {
    value: 20,
    max: 5,
    children: "How was your visit?",
  },
};

export const ReadOnly: Story = {
  args: {
    value: 4,
    max: 5,
    readOnly: true,
    children: "How was your visit?",
  },
};

export const Disabled: Story = {
  args: {
    value: 2,
    max: 5,
    disabled: true,
    children: "How was your visit?",
  },
};

export const InAForm: Story = {
  args: {
    value: 0,
    max: 5,
    children: "How was your visit?",
  },
  render: () => (
    <Form initialValues={{ satisfaction: 0 }} onSubmit={() => {}}>
      <Flex column gap="md">
        <Rating name="satisfaction" max={5}>
          How was your visit?
        </Rating>
        <Form.SubmitButton>Save</Form.SubmitButton>
      </Flex>
    </Form>
  ),
};
