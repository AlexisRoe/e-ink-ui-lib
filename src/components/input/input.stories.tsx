import type { Meta, StoryObj } from "@storybook/react-vite";
import { useEffect, useState } from "react";
import { isEmail, isMaxLength, isRequired } from "../../utils/validate.utils";
import { Form } from "../form/form.component";
import { Input } from "./input.component";

const meta = {
  title: "Components/Forms/Input",
  component: Input,
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "password", "email", "url", "tel", "search", "number"],
    },
    maxLength: { control: "number" },
    placeholder: { control: "text" },
    required: { control: "boolean" },
    disabled: { control: "boolean" },
    useEye: { control: "boolean" },
    useClear: { control: "boolean" },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

function Controlled(args: React.ComponentProps<typeof Input>) {
  const [value, setValue] = useState(args.value ?? "");
  // Re-sync when a Storybook control changes `value` from the outside;
  // typing doesn't touch `args.value`, so this doesn't fight local edits.
  useEffect(() => {
    setValue(args.value ?? "");
  }, [args.value]);
  return <Input {...args} value={value} onChange={setValue} />;
}

export const Default: Story = {
  args: { children: "Name", value: "", placeholder: "Enter your name" },
  render: (args) => <Controlled {...args} />,
};

export const Password: Story = {
  args: { children: "Password", type: "password", value: "hunter2" },
  render: (args) => <Controlled {...args} />,
};

export const WithMaxLength: Story = {
  args: { children: "Bio", value: "", maxLength: 20 },
  render: (args) => <Controlled {...args} />,
};

export const Required: Story = {
  args: { children: "Name", value: "", required: true },
  render: (args) => <Controlled {...args} />,
};

/**
 * `validate` runs on every change and on blur; a returned error string
 * renders in a box underneath the field, marked with `role="alert"` and
 * wired to the input via `aria-describedby`/`aria-invalid`.
 */
export const WithValidation: Story = {
  args: { children: "Email", type: "email", value: "" },
  render: (args) => <Controlled {...args} validate={isEmail} />,
};

export const CombinedValidation: Story = {
  args: { children: "Username", value: "" },
  render: (args) => (
    <Controlled {...args} validate={(value) => isRequired(value) ?? isMaxLength(value, 12)} />
  ),
};

export const Disabled: Story = {
  args: { children: "Name", value: "Ada Lovelace", disabled: true },
};

export const InAForm: Story = {
  args: { children: "" },
  render: () => (
    <Form initialValues={{ email: "" }} onSubmit={() => {}}>
      <Input name="email" type="email" validate={isEmail}>
        Email
      </Input>
      <Form.SubmitButton>Save</Form.SubmitButton>
    </Form>
  ),
};
