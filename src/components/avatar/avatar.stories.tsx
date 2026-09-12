import type { Meta, StoryObj } from "@storybook/react-vite";
import profilePhoto1 from "../../assets/profile_photos/profile_1.png";
import profilePhoto2 from "../../assets/profile_photos/profile_2.png";
import { Avatar } from "./avatar.component";

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

export const WithNotification: Story = {
  args: {
    notification: true,
  },
};

export const ProfileWithImage: Story = {
  render: (args) => <Avatar.Profile {...args} src={profilePhoto1} />,
};

export const ProfileMono: Story = {
  args: {
    size: "sm",
  },

  render: (args) => (
    <div style={{ transform: "scale(3)", transformOrigin: "top left" }}>
      <Avatar.Profile {...args} src={profilePhoto1} size="xl" mono />
    </div>
  ),
};

export const ProfileFallback: Story = {
  render: (args) => <Avatar.Profile {...args} />,
};

export const ProfileSizes: Story = {
  render: (args) => (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <Avatar.Profile {...args} src={profilePhoto1} size="sm" />
      <Avatar.Profile {...args} src={profilePhoto1} size="md" />
      <Avatar.Profile {...args} src={profilePhoto1} size="xl" />
    </div>
  ),
};

export const ProfileWithNotification: Story = {
  render: (args) => <Avatar.Profile {...args} src={profilePhoto2} notification />,
};
