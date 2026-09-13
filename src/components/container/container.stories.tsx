import type { Meta, StoryObj } from "@storybook/react-vite";
import { Text } from "../text/text.component";
import { Container } from "./container.component";

const meta = {
  title: "Components/Layout/Container",
  component: Container,
  tags: ["autodocs"],
  argTypes: {
    withBorder: { control: "boolean" },
    fullWidth: { control: "boolean" },
    fullHeight: { control: "boolean" },
    centered: { control: "boolean" },
  },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Container {...args}>
      <Text>Content inside a container</Text>
    </Container>
  ),
};

export const WithoutBorder: Story = {
  name: "Without border",
  args: { withBorder: false },
  render: (args) => (
    <Container {...args}>
      <Text>No border around this content</Text>
    </Container>
  ),
};

export const FullWidth: Story = {
  name: "Full width",
  args: { fullWidth: true },
  render: (args) => (
    <Container {...args}>
      <Text>Stretches to fill its parent's width</Text>
    </Container>
  ),
};

export const Centered: Story = {
  args: { centered: true, fullWidth: true },
  render: (args) => (
    <Container {...args} style={{ height: 160 }}>
      <Text>Centered content</Text>
    </Container>
  ),
};
