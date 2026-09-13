import type { Meta, StoryObj } from "@storybook/react-vite";
import { State } from "./state.component";

const meta = {
  title: "Components/Data Display/State",
  component: State.Empty,
  tags: ["autodocs"],
  argTypes: {
    title: { control: "text", description: "Required. Title shown below the icon." },
    subtitle: { control: "text", description: "Optional subtitle shown below the title." },
    description: {
      control: "text",
      description: "Optional longer description shown below the subtitle.",
    },
    action: {
      control: false,
      description: "Optional action button, given a label and a callback.",
    },
    withBorder: {
      control: "boolean",
      description: "Optional. Renders a border around the state. Defaults to `true`.",
    },
  },
} satisfies Meta<typeof State.Empty>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {
  args: {
    title: "Nothing here yet",
  },
  render: (args) => (
    <div style={{ height: 320 }}>
      <State.Empty {...args} />
    </div>
  ),
};

export const EmptyWithDetails: Story = {
  name: "Empty with details",
  args: {
    title: "Nothing here yet",
    subtitle: "No results found",
    description: "Try adjusting your search or filters.",
    action: { label: "Clear filters", onClick: () => {} },
  },
  render: (args) => (
    <div style={{ height: 320 }}>
      <State.Empty {...args} />
    </div>
  ),
};

export const ErrorState: Story = {
  name: "Error",
  args: {
    title: "Something went wrong",
  },
  render: (args) => (
    <div style={{ height: 320 }}>
      <State.Error {...args} />
    </div>
  ),
};

export const ErrorWithDetails: Story = {
  name: "Error with details",
  args: {
    title: "Something went wrong",
    subtitle: "Failed to load data",
    description: "Please check your connection and try again.",
    action: { label: "Retry", onClick: () => {} },
  },
  render: (args) => (
    <div style={{ height: 320 }}>
      <State.Error {...args} />
    </div>
  ),
};
