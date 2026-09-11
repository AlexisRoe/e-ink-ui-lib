import type { Meta, StoryObj } from "@storybook/react-vite";
import { Title } from "./Title.component";

const meta = {
  title: "Components/Typography/Title",
  component: Title,
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: [1, 2, 3, 4, 5, 6] },
  },
} satisfies Meta<typeof Title>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: "Title",
    size: 1,
  },
};

export const AllSizes: Story = {
  args: { children: "" },
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <Title size={1}>Heading level 1</Title>
      <Title size={2}>Heading level 2</Title>
      <Title size={3}>Heading level 3</Title>
      <Title size={4}>Heading level 4</Title>
      <Title size={5}>Heading level 5</Title>
      <Title size={6}>Heading level 6</Title>
    </div>
  ),
};
