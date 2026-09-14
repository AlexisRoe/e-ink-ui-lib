import type { Meta, StoryObj } from "@storybook/react-vite";
import { Form } from "../form/form.component";
import { Chip } from "./chip.component";

const meta = {
  title: "Components/Forms/Chip",
  component: Chip,
  tags: ["autodocs"],
  argTypes: {
    icon: { control: "text" },
    disabled: { control: "boolean" },
    defaultSelected: { control: "boolean" },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Favorite",
  },
};

export const Selected: Story = {
  args: {
    children: "Favorite",
    defaultSelected: true,
  },
};

export const WithIcon: Story = {
  args: {
    children: "Favorite",
    icon: "star",
  },
};

export const Disabled: Story = {
  args: {
    children: "Favorite",
    disabled: true,
  },
};

export const SingleSelectGroup: Story = {
  args: { children: "" },
  render: () => (
    <Chip.Group defaultValue="all">
      <Chip value="all">All</Chip>
      <Chip value="drafts">Drafts</Chip>
      <Chip value="published">Published</Chip>
      <Chip value="archived">Archived</Chip>
    </Chip.Group>
  ),
};

export const MultiSelectGroup: Story = {
  args: { children: "" },
  render: () => (
    <Chip.Group multiple defaultValue={["drafts"]}>
      <Chip value="drafts">Drafts</Chip>
      <Chip value="published">Published</Chip>
      <Chip value="archived">Archived</Chip>
    </Chip.Group>
  ),
};

export const DisabledGroup: Story = {
  args: { children: "" },
  render: () => (
    <Chip.Group disabled defaultValue="all">
      <Chip value="all">All</Chip>
      <Chip value="drafts">Drafts</Chip>
    </Chip.Group>
  ),
};

export const InAForm: Story = {
  args: { children: "" },
  render: () => (
    <Form initialValues={{ status: "all" }} onSubmit={() => {}}>
      <Chip.Group name="status">
        <Chip value="all">All</Chip>
        <Chip value="drafts">Drafts</Chip>
        <Chip value="published">Published</Chip>
        <Chip value="archived">Archived</Chip>
      </Chip.Group>
      <Form.SubmitButton>Save</Form.SubmitButton>
    </Form>
  ),
};
