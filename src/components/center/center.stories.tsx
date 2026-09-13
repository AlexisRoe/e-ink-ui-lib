import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text } from "../text/text.component";
import { Center } from "./center.component";

const meta = {
  title: "Components/Layout/Center",
  component: Center,
  tags: ["autodocs"],
  argTypes: {
    fullWidth: { control: "boolean" },
    fullHeight: { control: "boolean" },
  },
} satisfies Meta<typeof Center>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div style={{ border: "2px dashed black", width: 320, padding: 16 }}>
      <Center>
        <Text>Centered content</Text>
      </Center>
    </div>
  ),
};

export const FullWidthAndHeight: Story = {
  name: "fullWidth + fullHeight",
  render: () => (
    <div style={{ border: "2px dashed black", width: 320, height: 200 }}>
      <Center fullWidth fullHeight>
        <Text>Nothing here yet</Text>
      </Center>
    </div>
  ),
};
