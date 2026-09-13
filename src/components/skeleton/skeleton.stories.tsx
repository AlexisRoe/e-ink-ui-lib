import type { Meta, StoryObj } from "@storybook/react-vite";
import { Skeleton } from "./skeleton.component";

const meta = {
  title: "Components/Layout/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "radio",
      options: ["rectangle", "round", "square"],
    },
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "rectangle",
  },
};

export const Round: Story = {
  args: {
    variant: "round",
    style: { height: 48 },
  },
};

export const Square: Story = {
  args: {
    variant: "square",
    style: { height: 96 },
  },
};

export const Paragraph: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Skeleton style={{ height: 12 }} />
      <Skeleton style={{ height: 12 }} />
      <Skeleton style={{ height: 12 }} />
      <Skeleton style={{ height: 12, width: "50%" }} />
    </div>
  ),
};

export const AvatarWithLines: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
      <Skeleton variant="round" style={{ height: 48, flexShrink: 0 }} />
      <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
        <Skeleton style={{ height: 12 }} />
        <Skeleton style={{ height: 12, width: "70%" }} />
      </div>
    </div>
  ),
};

export const AvatarWithBlock: Story = {
  render: () => (
    <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
      <Skeleton variant="round" style={{ height: 48, flexShrink: 0 }} />
      <Skeleton style={{ height: 120, flex: 1 }} />
    </div>
  ),
};
