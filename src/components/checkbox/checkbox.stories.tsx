import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Flex } from "../flex/flex.component";
import { Form } from "../form/form.component";
import { Checkbox } from "./checkbox.component";

const meta = {
  title: "Components/Forms/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  argTypes: {
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    checked: false,
    children: "Accept terms",
  },
  render: (args) => {
    const [checked, setChecked] = useState(args.checked ?? false);

    return (
      <Flex column gap="sm">
        <Checkbox {...args} checked={checked} onChange={setChecked}>
          {args.children}
        </Checkbox>
        <span>Value: {checked ? "true" : "false"}</span>
      </Flex>
    );
  },
};

export const Disabled: Story = {
  args: {
    checked: true,
    disabled: true,
    children: "Accept terms",
  },
};

export const Required: Story = {
  args: {
    checked: false,
    required: true,
    children: "Accept terms",
  },
};

/**
 * `Checkbox.Group` owns a shared array of checked values, letting each
 * `Checkbox` identify itself with a `value` instead of managing its own
 * boolean state.
 */
export const Group: Story = {
  args: { children: "" },
  render: () => {
    function GroupDemo() {
      const [toppings, setToppings] = useState<string[]>(["cheese"]);
      return (
        <Flex column gap="sm">
          <Checkbox.Group label="Toppings" value={toppings} onChange={setToppings}>
            <Checkbox value="cheese">Cheese</Checkbox>
            <Checkbox value="olives">Olives</Checkbox>
            <Checkbox value="mushrooms">Mushrooms</Checkbox>
          </Checkbox.Group>
          <span>Value: {JSON.stringify(toppings)}</span>
        </Flex>
      );
    }
    return <GroupDemo />;
  },
};

export const InAForm: Story = {
  args: { children: "" },
  render: () => (
    <Form initialValues={{ toppings: ["cheese"] }} onSubmit={() => {}}>
      <Checkbox.Group label="Toppings" name="toppings">
        <Checkbox value="cheese">Cheese</Checkbox>
        <Checkbox value="olives">Olives</Checkbox>
      </Checkbox.Group>
      <Form.SubmitButton>Save</Form.SubmitButton>
    </Form>
  ),
};
