import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState } from "react";
import { Navigation } from "./navigation.component";

const meta = {
  title: "Components/Layout/Navigation",
  component: Navigation,
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "radio",
      options: ["vertical", "horizontal"],
    },
    withBorder: { control: "boolean" },
    fullWidth: { control: "boolean" },
  },
} satisfies Meta<typeof Navigation>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
  args: {
    orientation: "vertical",
    children: null,
  },
  render: (args) => (
    <Navigation {...args}>
      <Navigation.Item target="/" icon="home" label="Home" />
      <Navigation.Item label="Products" icon="folder">
        <Navigation.Item target="/products/new" label="New" />
        <Navigation.Item target="/products/archived" label="Archived" />
      </Navigation.Item>
      <Navigation.Item target="/settings" icon="settings" label="Settings" />
    </Navigation>
  ),
};

export const Horizontal: Story = {
  args: {
    orientation: "horizontal",
    children: null,
  },
  render: (args) => (
    <Navigation {...args}>
      <Navigation.Item target="/" icon="home" label="Home" />
      <Navigation.Item label="Products" icon="folder">
        <Navigation.Item target="/products/new" label="New" />
        <Navigation.Item target="/products/archived" label="Archived" />
      </Navigation.Item>
      <Navigation.Item target="/settings" icon="settings" label="Settings" />
    </Navigation>
  ),
};

function NavigationWithSelection() {
  const [selected, setSelected] = useState<{ target: string; index: number } | null>(null);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Navigation onSelect={(target, index) => setSelected({ target, index })}>
        <Navigation.Item target="/" icon="home" label="Home" />
        <Navigation.Item target="/reports" icon="file" label="Reports" />
        <Navigation.Item label="Team" icon="users">
          <Navigation.Item target="/team/members" label="Members" />
          <Navigation.Item target="/team/roles" label="Roles" />
        </Navigation.Item>
      </Navigation>
      <div>Selected: {selected ? `${selected.target} (index ${selected.index})` : "none"}</div>
    </div>
  );
}

export const WithSelectCallback: Story = {
  args: {
    children: null,
  },
  render: () => <NavigationWithSelection />,
};

export const WithoutBorder: Story = {
  args: {
    withBorder: false,
    children: null,
  },
  render: (args) => (
    <Navigation {...args}>
      <Navigation.Item target="/" icon="home" label="Home" />
      <Navigation.Item label="Products" icon="folder">
        <Navigation.Item target="/products/new" label="New" />
        <Navigation.Item target="/products/archived" label="Archived" />
      </Navigation.Item>
      <Navigation.Item target="/settings" icon="settings" label="Settings" />
    </Navigation>
  ),
};

export const NotFullWidth: Story = {
  args: {
    fullWidth: false,
    children: null,
  },
  render: (args) => (
    <div style={{ width: 480, border: "1px dashed grey" }}>
      <Navigation {...args}>
        <Navigation.Item target="/" icon="home" label="Home" />
        <Navigation.Item label="Products" icon="folder">
          <Navigation.Item target="/products/new" label="New" />
          <Navigation.Item target="/products/archived" label="Archived" />
        </Navigation.Item>
        <Navigation.Item target="/settings" icon="settings" label="Settings" />
      </Navigation>
    </div>
  ),
};
