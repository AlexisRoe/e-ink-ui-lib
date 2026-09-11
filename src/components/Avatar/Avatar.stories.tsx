import type { Meta, StoryObj } from "@storybook/react-vite";
import profilePhoto1 from "../../assets/profile_photos/profile_1.png";
import profilePhoto2 from "../../assets/profile_photos/profile_2.png";
import { Avatar } from "./Avatar";

const meta = {
  title: "Components/Data Display/Avatar",
  component: Avatar,
  tags: ["autodocs"],
  args: {
    userName: "Ada Lovelace",
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Initials: Story = {};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <Avatar {...args} size="sm" />
      <Avatar {...args} size="md" />
      <Avatar {...args} size="xl" />
    </div>
  ),
};

export const WithImage: Story = {
  args: {
    src: profilePhoto1,
  },
};

export const ImageSizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <Avatar {...args} size="sm" />
      <Avatar {...args} size="md" />
      <Avatar {...args} size="xl" />
    </div>
  ),
  args: {
    src: profilePhoto1,
  },
};

export const WithNotification: Story = {
  args: {
    notification: true,
  },
};

export const ImageWithNotification: Story = {
  args: {
    src: profilePhoto2,
    notification: true,
  },
};
