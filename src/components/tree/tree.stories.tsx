import type { Meta, StoryObj } from "@storybook/react-vite";
import { Tree } from "./tree.component";

const meta = {
  title: "Components/Data Display/Tree",
  component: Tree,
  tags: ["autodocs"],
  args: {
    children: <Tree.Item label="src" />,
  },
} satisfies Meta<typeof Tree>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Tree {...args}>
      <Tree.Item label="src">
        <Tree.Item label="components">
          <Tree.Item label="button.tsx" />
          <Tree.Item label="card.tsx" />
        </Tree.Item>
        <Tree.Item label="utils">
          <Tree.Item label="cx.utils.ts" />
        </Tree.Item>
        <Tree.Item label="index.ts" />
      </Tree.Item>
      <Tree.Item label="package.json" />
      <Tree.Item label="README.md" />
    </Tree>
  ),
};

export const DeeplyNested: Story = {
  render: (args) => (
    <Tree {...args}>
      <Tree.Item label="project">
        <Tree.Item label="src">
          <Tree.Item label="components">
            <Tree.Item label="tree">
              <Tree.Item label="tree.component.tsx" />
              <Tree.Item label="tree.component.css" />
            </Tree.Item>
          </Tree.Item>
        </Tree.Item>
      </Tree.Item>
    </Tree>
  ),
};

export const CollapsedByDefault: Story = {
  render: (args) => (
    <Tree {...args}>
      <Tree.Item label="src" initialExpanded={false}>
        <Tree.Item label="index.ts" />
      </Tree.Item>
      <Tree.Item label="package.json" />
    </Tree>
  ),
};
