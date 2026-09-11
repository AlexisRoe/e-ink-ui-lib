import type { Meta, StoryObj } from "@storybook/react-vite";
import { iconNames } from "../icons/icons";
import { Button } from "./Button";

const meta = {
  title: "Components/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    iconLeft: { control: "select", options: [undefined, ...iconNames] },
    iconRight: { control: "select", options: [undefined, ...iconNames] },
    loading: { control: "boolean" },
    flipIntervalMs: { control: "number" },
    size: { control: "select", options: ["sm", "md", "xl"] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Filled: Story = {
  args: {
    children: "Filled button",
  },
};

export const FilledWithLeftIcon: Story = {
  args: {
    children: "Save",
    iconLeft: "check",
  },
};

export const FilledWithRightIcon: Story = {
  args: {
    children: "Next",
    iconRight: "arrow-right",
  },
};

export const Outlined: Story = {
  render: (args) => <Button.Outlined {...args} />,
  args: {
    children: "Outlined button",
    iconLeft: "download",
  },
};

export const Naked: Story = {
  render: (args) => <Button.Naked {...args} />,
  args: {
    children: "Naked button",
    iconLeft: "external-link",
  },
};

export const IconOnly: Story = {
  args: { children: "" },
  render: () => <Button.Icon icon="trash" aria-label="Delete" />,
};

export const IconOnlyOutlined: Story = {
  args: { children: "" },
  render: () => <Button.IconOutlined icon="edit" aria-label="Edit" />,
};

export const IconOnlyNaked: Story = {
  args: { children: "" },
  render: () => <Button.IconNaked icon="close" aria-label="Close" />,
};

export const Disabled: Story = {
  args: {
    children: "Disabled button",
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    children: "Loading",
    loading: true,
  },
};

export const LoadingOutlined: Story = {
  render: (args) => <Button.Outlined {...args} />,
  args: {
    children: "Loading",
    loading: true,
  },
};

export const FullWidth: Story = {
  args: {
    children: "Full width button",
    fullWidth: true,
  },
};

export const FullWidthOutlined: Story = {
  render: (args) => <Button.Outlined {...args} />,
  args: {
    children: "Full width outlined button",
    fullWidth: true,
  },
};

export const Sizes: Story = {
  args: { children: "" },
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="xl">Extra large</Button>
    </div>
  ),
};
