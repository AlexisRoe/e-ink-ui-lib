import type { Meta, StoryObj } from "@storybook/react-vite";
import { Form } from "../form/form.component";
import { Keypad } from "./keypad.component";

const meta = {
  title: "Components/Forms/Keypad",
  component: Keypad,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    maxLength: { control: "number" },
    allowDecimal: { control: "boolean" },
    display: { control: "boolean" },
    disabled: { control: "boolean" },
  },
} satisfies Meta<typeof Keypad>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Quantity",
    maxLength: 4,
  },
};

export const WithDisplay: Story = {
  args: {
    label: "Quantity",
    maxLength: 4,
    display: true,
  },
};

export const Decimal: Story = {
  args: {
    label: "Amount",
    maxLength: 6,
    allowDecimal: true,
    display: true,
  },
};

export const Disabled: Story = {
  args: {
    label: "PIN",
    maxLength: 4,
    display: true,
    disabled: true,
    defaultValue: "12",
  },
};

export const InAForm: Story = {
  args: { label: "", maxLength: 4 },
  render: () => (
    <Form initialValues={{ pin: "" }} onSubmit={() => {}}>
      <Keypad name="pin" label="PIN" maxLength={4} display />
      <Form.SubmitButton>Save</Form.SubmitButton>
    </Form>
  ),
};
