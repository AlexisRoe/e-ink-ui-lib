import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Flex } from "../flex/flex.component";
import { Form } from "../form/form.component";
import { RadioInput } from "./radio-input.component";

const meta = {
  title: "Components/Forms/RadioInput",
  component: RadioInput,
  tags: ["autodocs"],
} satisfies Meta<typeof RadioInput>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * `RadioInput` only makes sense inside a `RadioInput.Group`, which owns the
 * selected value and generates the shared native `name` its items need for
 * exclusivity.
 */
export const Default: Story = {
  args: { value: "s", children: "" },
  render: () => {
    function GroupDemo() {
      const [size, setSize] = useState("s");
      return (
        <Flex column gap="sm">
          <RadioInput.Group label="Size" value={size} onChange={setSize}>
            <RadioInput value="s">Small</RadioInput>
            <RadioInput value="m">Medium</RadioInput>
            <RadioInput value="l">Large</RadioInput>
          </RadioInput.Group>
          <span>Value: {size}</span>
        </Flex>
      );
    }
    return <GroupDemo />;
  },
};

export const Horizontal: Story = {
  args: { value: "s", children: "" },
  render: () => {
    function GroupDemo() {
      const [size, setSize] = useState("s");
      return (
        <RadioInput.Group label="Size" orientation="horizontal" value={size} onChange={setSize}>
          <RadioInput value="s">Small</RadioInput>
          <RadioInput value="m">Medium</RadioInput>
          <RadioInput value="l">Large</RadioInput>
        </RadioInput.Group>
      );
    }
    return <GroupDemo />;
  },
};

export const Disabled: Story = {
  args: { value: "s", children: "" },
  render: () => (
    <RadioInput.Group label="Size" defaultValue="s" disabled>
      <RadioInput value="s">Small</RadioInput>
      <RadioInput value="m">Medium</RadioInput>
    </RadioInput.Group>
  ),
};

export const InAForm: Story = {
  args: { value: "s", children: "" },
  render: () => (
    <Form initialValues={{ size: "s" }} onSubmit={() => {}}>
      <RadioInput.Group label="Size" name="size">
        <RadioInput value="s">Small</RadioInput>
        <RadioInput value="m">Medium</RadioInput>
      </RadioInput.Group>
      <Form.SubmitButton>Save</Form.SubmitButton>
    </Form>
  ),
};
