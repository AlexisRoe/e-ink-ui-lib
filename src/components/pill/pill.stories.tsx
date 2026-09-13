import type { Meta, StoryObj } from "@storybook/react-vite";
import { iconNames } from "../icons/icons";
import { Pill } from "./pill.component";

const meta = {
  title: "Components/Data Display/Pill",
  component: Pill,
  tags: ["autodocs"],
  argTypes: {
    icon: { control: "select", options: [undefined, ...iconNames] },
    size: { control: "select", options: ["sm", "md", "xl"] },
  },
} satisfies Meta<typeof Pill>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Solid: Story = {
  args: {
    children: "OK",
    icon: "check",
  },
};

export const Double: Story = {
  render: (args) => <Pill.Double {...args} />,
  args: {
    children: "Warning",
    icon: "alert-triangle",
  },
};

export const Filled: Story = {
  render: (args) => <Pill.Filled {...args} />,
  args: {
    children: "Critical",
    icon: "circle-x",
  },
};

export const Dashed: Story = {
  render: (args) => <Pill.Dashed {...args} />,
  args: {
    children: "Neutral",
    icon: "minus",
  },
};

export const Dotted: Story = {
  render: (args) => <Pill.Dotted {...args} />,
  args: {
    children: "Offline",
    icon: "circle-off",
  },
};

export const Sizes: Story = {
  args: { children: "" },
  render: () => (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <Pill size="sm" icon="check">
        Small
      </Pill>
      <Pill size="md" icon="check">
        Medium
      </Pill>
      <Pill size="xl" icon="check">
        Extra large
      </Pill>
    </div>
  ),
};

export const BorderVariants: Story = {
  name: "All border variants",
  args: { children: "" },
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 24 }}>
      <Pill icon="check">OK</Pill>
      <Pill.Double icon="alert-triangle">Warning</Pill.Double>
      <Pill.Filled icon="circle-x">Critical</Pill.Filled>
      <Pill.Dotted icon="circle-off">Offline</Pill.Dotted>
      <Pill.Dashed icon="minus">Neutral</Pill.Dashed>
    </div>
  ),
};

export const RoomSign: Story = {
  name: "Example: room sign",
  args: { children: "" },
  render: () => (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 24 }}>
      <Pill size="xl" icon="circle-dot">
        Empty
      </Pill>
      <Pill.Dashed size="xl" icon="circle-half-2">
        Occupied soon
      </Pill.Dashed>
      <Pill.Filled size="xl" icon="circle-off">
        Occupied
      </Pill.Filled>
    </div>
  ),
};
