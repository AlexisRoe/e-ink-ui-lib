import type { Meta, StoryObj } from "@storybook/react-vite";
import { Highlight } from "./highlight.component";

const meta = {
  title: "Components/Typography/Highlight",
  component: Highlight,
  tags: ["autodocs"],
  args: {
    children: "highlighted text",
  },
  argTypes: {
    mono: {
      control: "boolean",
      description: "When true, renders a wave underline instead of a light grey background.",
    },
  },
} satisfies Meta<typeof Highlight>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Mono: Story = {
  args: {
    mono: true,
  },
};

export const InParagraph: Story = {
  render: () => (
    <p style={{ maxWidth: 480, lineHeight: 1.8 }}>
      This paragraph shows both highlight styles: by default,{" "}
      <Highlight>a highlighted phrase</Highlight> gets a light grey background, while in mono
      contexts <Highlight mono>this phrase</Highlight> instead gets a wave underline so it stays
      visible without relying on background contrast.
    </p>
  ),
};
