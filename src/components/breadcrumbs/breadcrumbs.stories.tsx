import type { Meta, StoryObj } from "@storybook/react-vite";
import { BreadCrumbs } from "./breadcrumbs.component";

const meta = {
  title: "Components/Layout/BreadCrumbs",
  component: BreadCrumbs,
  tags: ["autodocs"],
} satisfies Meta<typeof BreadCrumbs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: null,
  },
  render: (args) => (
    <BreadCrumbs {...args}>
      <BreadCrumbs.Item target="/">Home</BreadCrumbs.Item>
      <BreadCrumbs.Item target="/settings">Settings</BreadCrumbs.Item>
      <BreadCrumbs.Item target="/settings/profile">Profile</BreadCrumbs.Item>
    </BreadCrumbs>
  ),
};

export const WithNavigateCallback: Story = {
  args: {
    children: null,
    onNavigate: (target: string) => alert(`Navigate to: ${target}`),
  },
  render: (args) => (
    <BreadCrumbs {...args}>
      <BreadCrumbs.Item target="/">Home</BreadCrumbs.Item>
      <BreadCrumbs.Item target="/reports">Reports</BreadCrumbs.Item>
      <BreadCrumbs.Item target="/reports/2026">2026</BreadCrumbs.Item>
    </BreadCrumbs>
  ),
};
