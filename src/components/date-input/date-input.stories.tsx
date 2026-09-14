import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Form } from "../form/form.component";
import { DateInput } from "./date-input.component";

const meta = {
  title: "Components/Forms/DateInput",
  component: DateInput,
  tags: ["autodocs"],
} satisfies Meta<typeof DateInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Birthday" },
  render: (args) => {
    function DateInputDemo() {
      const [date, setDate] = useState("2024-01-01");
      return <DateInput {...args} value={date} onChange={setDate} />;
    }
    return <DateInputDemo />;
  },
};

export const Required: Story = {
  args: { children: "Birthday", required: true },
  render: (args) => {
    function DateInputDemo() {
      const [date, setDate] = useState("");
      return <DateInput {...args} value={date} onChange={setDate} />;
    }
    return <DateInputDemo />;
  },
};

export const Disabled: Story = {
  args: { children: "Birthday", value: "2024-01-01", disabled: true },
};

export const InAForm: Story = {
  args: { children: "Birthday" },
  render: () => (
    <Form initialValues={{ birthday: "2024-01-01" }} onSubmit={() => {}}>
      <DateInput name="birthday">Birthday</DateInput>
      <Form.SubmitButton>Save</Form.SubmitButton>
    </Form>
  ),
};
