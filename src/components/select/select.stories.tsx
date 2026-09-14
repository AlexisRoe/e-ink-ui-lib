import type { Meta, StoryObj } from "@storybook/react-vite";
import { Form } from "../form/form.component";
import { Select } from "./select.component";

const meta = {
  title: "Components/Forms/Select",
  component: Select,
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
    placeholder: { control: "text" },
    disabled: { control: "boolean" },
    required: { control: "boolean" },
    multiple: { control: "boolean" },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: "Fruit",
    placeholder: "Pick…",
    children: (
      <>
        <Select.Option value="apple">Apple</Select.Option>
        <Select.Option value="banana">Banana</Select.Option>
        <Select.Option value="cherry">Cherry</Select.Option>
      </>
    ),
  },
};

export const WithIcons: Story = {
  args: {
    label: "Fruit",
    placeholder: "Pick…",
    children: (
      <>
        <Select.Option value="apple" icon="star">
          Apple
        </Select.Option>
        <Select.Option value="banana" icon="heart">
          Banana
        </Select.Option>
      </>
    ),
  },
};

export const Preselected: Story = {
  args: {
    label: "Fruit",
    placeholder: "Pick…",
    defaultValue: "banana",
    children: (
      <>
        <Select.Option value="apple">Apple</Select.Option>
        <Select.Option value="banana">Banana</Select.Option>
      </>
    ),
  },
};

export const Grouped: Story = {
  args: {
    label: "Fruit",
    placeholder: "Pick…",
    children: (
      <>
        <Select.Group label="Common">
          <Select.Option value="apple">Apple</Select.Option>
          <Select.Option value="banana">Banana</Select.Option>
        </Select.Group>
        <Select.Group label="Rare">
          <Select.Option value="dragonfruit">Dragonfruit</Select.Option>
          <Select.Option value="durian">Durian</Select.Option>
        </Select.Group>
      </>
    ),
  },
};

export const Multiple: Story = {
  args: {
    label: "Fruit",
    placeholder: "Pick…",
    multiple: true,
    defaultValue: ["apple"],
    children: (
      <>
        <Select.Option value="apple">Apple</Select.Option>
        <Select.Option value="banana">Banana</Select.Option>
        <Select.Option value="cherry">Cherry</Select.Option>
      </>
    ),
  },
};

export const Required: Story = {
  args: {
    label: "Fruit",
    placeholder: "Pick…",
    required: true,
    children: (
      <>
        <Select.Option value="apple">Apple</Select.Option>
        <Select.Option value="banana">Banana</Select.Option>
      </>
    ),
  },
};

export const Disabled: Story = {
  args: {
    label: "Fruit",
    placeholder: "Pick…",
    disabled: true,
    children: <Select.Option value="apple">Apple</Select.Option>,
  },
};

export const InAForm: Story = {
  args: { label: "Fruit", placeholder: "Pick…", children: null },
  render: () => (
    <Form initialValues={{ fruit: "" }} onSubmit={() => {}}>
      <Select name="fruit" label="Fruit" placeholder="Pick…" required>
        <Select.Option value="apple">Apple</Select.Option>
        <Select.Option value="banana">Banana</Select.Option>
        <Select.Option value="cherry">Cherry</Select.Option>
      </Select>
      <Form.SubmitButton>Save</Form.SubmitButton>
    </Form>
  ),
};
