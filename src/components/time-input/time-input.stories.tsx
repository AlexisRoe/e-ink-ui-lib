import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Form } from "../form/form.component";
import { TimeInput } from "./time-input.component";

const meta = {
  title: "Components/Forms/TimeInput",
  component: TimeInput,
  tags: ["autodocs"],
} satisfies Meta<typeof TimeInput>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Alarm" },
  render: (args) => {
    function TimeInputDemo() {
      const [time, setTime] = useState("09:00");
      return <TimeInput {...args} value={time} onChange={setTime} />;
    }
    return <TimeInputDemo />;
  },
};

export const Required: Story = {
  args: { children: "Alarm", required: true },
  render: (args) => {
    function TimeInputDemo() {
      const [time, setTime] = useState("");
      return <TimeInput {...args} value={time} onChange={setTime} />;
    }
    return <TimeInputDemo />;
  },
};

export const Disabled: Story = {
  args: { children: "Alarm", value: "09:00", disabled: true },
};

export const InAForm: Story = {
  args: { children: "Alarm" },
  render: () => (
    <Form initialValues={{ alarm: "09:00" }} onSubmit={() => {}}>
      <TimeInput name="alarm">Alarm</TimeInput>
      <Form.SubmitButton>Save</Form.SubmitButton>
    </Form>
  ),
};
