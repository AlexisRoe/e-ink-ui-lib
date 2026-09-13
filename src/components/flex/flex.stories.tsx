import type { Meta, StoryObj } from "@storybook/react-vite";
import { Button } from "../button/button.component";
import { Card } from "../card/card.component";
import { Flex } from "./flex.component";

const meta = {
  title: "Components/Layout/Flex",
  component: Flex,
  tags: ["autodocs"],
  argTypes: {
    justify: {
      control: "select",
      options: [
        undefined,
        "start",
        "center",
        "end",
        "space-between",
        "space-around",
        "space-evenly",
      ],
    },
    align: {
      control: "select",
      options: [undefined, "start", "center", "end", "stretch", "baseline"],
    },
    gap: { control: "select", options: ["sm", "md", "xl"] },
    column: { control: "boolean" },
    wrap: { control: "boolean" },
    inline: { control: "boolean" },
  },
} satisfies Meta<typeof Flex>;

export default meta;
type Story = StoryObj<typeof meta>;

function Box({ label, height = 48 }: { label: string; height?: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height,
        padding: "0 16px",
        border: "2px solid black",
      }}
    >
      {label}
    </div>
  );
}

export const Row: Story = {
  args: { gap: "md" },
  render: (args) => (
    <Flex {...args}>
      <Box label="One" />
      <Box label="Two" />
      <Box label="Three" />
    </Flex>
  ),
};

export const Column: Story = {
  args: { column: true, gap: "md" },
  render: (args) => (
    <Flex {...args}>
      <Box label="One" />
      <Box label="Two" />
      <Box label="Three" />
    </Flex>
  ),
};

export const SpaceBetween: Story = {
  name: "Justify: space-between",
  args: { justify: "space-between" },
  render: (args) => (
    <Flex {...args} style={{ width: 480 }}>
      <Box label="Left" />
      <Box label="Right" />
    </Flex>
  ),
};

export const CenteredAlign: Story = {
  name: "Align: center",
  args: { align: "center", gap: "md" },
  render: (args) => (
    <Flex {...args} style={{ width: 480, height: 120, border: "2px dashed black" }}>
      <Box label="Short" height={32} />
      <Box label="Tall" height={80} />
    </Flex>
  ),
};

export const WrappingRow: Story = {
  name: "Wrap",
  args: { wrap: true, gap: "sm" },
  render: (args) => (
    <Flex {...args} style={{ width: 260 }}>
      <Box label="One" />
      <Box label="Two" />
      <Box label="Three" />
      <Box label="Four" />
    </Flex>
  ),
};

export const Inline: Story = {
  name: "Inline",
  args: { inline: true, gap: "sm" },
  render: (args) => (
    <p>
      Text before an inline flex group:{" "}
      <Flex {...args}>
        <Box label="One" height={24} />
        <Box label="Two" height={24} />
      </Flex>{" "}
      and text after it.
    </p>
  ),
};

export const ToolbarExample: Story = {
  name: "Example: toolbar",
  args: { justify: "space-between", align: "center" },
  render: (args) => (
    <Card>
      <Flex {...args} style={{ width: 420 }}>
        <span>Selected: 3 items</span>
        <Flex gap="sm">
          <Button.Naked>Cancel</Button.Naked>
          <Button>Save</Button>
        </Flex>
      </Flex>
    </Card>
  ),
};
