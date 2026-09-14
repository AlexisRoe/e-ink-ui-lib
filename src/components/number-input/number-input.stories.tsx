import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Form } from "../form/form.component";
import { NumberInput } from "./number-input.component";

const meta = {
  title: "Components/Forms/NumberInput",
  component: NumberInput,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    min: { control: "number" },
    max: { control: "number" },
    step: { control: "number" },
    useFloat: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof NumberInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Quantity",
    defaultValue: 5,
    min: 0,
    max: 10,
  },
};

/**
 * With `useFloat`, the value always displays two decimal places with a comma
 * separator (`5,00`, `5,01`, …) — except `0`, which is shown bare. Step and
 * click the buttons below to see the formatted output update live.
 */
export const FloatValue: Story = {
  args: {
    label: "Weight (kg)",
    useFloat: true,
    defaultValue: 0,
    min: 0,
    max: 5,
  },
  render: (args) => {
    function FloatValueDemo() {
      const [value, setValue] = useState(args.defaultValue ?? 0);
      return (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <NumberInput {...args} value={value} onChange={setValue} />
          <p>
            Current raw value: <code>{value}</code>
          </p>
        </div>
      );
    }
    return <FloatValueDemo />;
  },
};

export const Disabled: Story = {
  args: {
    label: "Quantity",
    defaultValue: 3,
    disabled: true,
  },
};

export const InAForm: Story = {
  args: { label: "" },
  render: () => (
    <Form initialValues={{ quantity: 1 }} onSubmit={() => {}}>
      <NumberInput name="quantity" label="Quantity" min={0} max={10} />
      <Form.SubmitButton>Save</Form.SubmitButton>
    </Form>
  ),
};
